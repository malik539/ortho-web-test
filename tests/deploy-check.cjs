/* Production-configuration check: serves dist/ the way Netlify would (headers from dist/_headers,
   POST /api/consultation → the real function → a mock CRM webhook) and drives it in Chromium.

   Needs a build made with the production variables:
     npm run test:deploy
   which runs: PUBLIC_CONSULT_ENDPOINT=/api/consultation PUBLIC_GTM_ID=GTM-TEST000 npm run build

   Checks: CSP + security headers on every route with zero CSP violations; consent-gated GTM
   (nothing before Accept, loads after, preference persists and can be withdrawn from the footer);
   a consultation submitted in the browser reaches the CRM webhook, attribution included. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIST = path.resolve(__dirname, '../dist');
const PORT = 4330;
const SITE = `http://localhost:${PORT}`;
const ROUTES = ['/', '/treatment/', '/treatment/alignment/', '/results/', '/results/alder-lane/', '/studio/', '/live/',
  '/live/172-virtual-assistants/', '/consultation/', '/privacy/', '/accessibility/', '/nope/'];
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

// dist/_headers → [{ pattern: RegExp, headers: [[k, v]] }]
function parseHeaders() {
  const rules = [];
  let cur = null;
  for (const line of fs.readFileSync(path.join(DIST, '_headers'), 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = { pattern: new RegExp('^' + line.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'), headers: [] }; rules.push(cur); continue; }
    const i = line.indexOf(':');
    cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
  }
  return rules;
}

let passed = 0, failed = 0;
const check = (name, ok, detail = '') => { if (ok) { passed++; console.log(`PASS  ${name}`); } else { failed++; console.log(`FAIL  ${name} ${detail}`); } };

(async () => {
  const { default: handler } = await import('../netlify/functions/consultation.mjs');
  const rules = parseHeaders();

  const leads = [];
  const hook = http.createServer((req, res) => { let b = ''; req.on('data', (c) => { b += c; }); req.on('end', () => { leads.push(JSON.parse(b)); res.end('{}'); }); });
  await new Promise((r) => hook.listen(0, r));
  Object.assign(process.env, { URL: SITE, CONTEXT: 'production', CONSULT_WEBHOOK_URL: `http://127.0.0.1:${hook.address().port}/hook` });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, SITE);
    if (url.pathname === '/api/consultation') {
      let body = ''; for await (const c of req) body += c;
      const r = await handler(new Request(url, { method: req.method, headers: req.headers, ...(req.method === 'POST' ? { body } : {}) }));
      res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(await r.text()); return;
    }
    let p = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
    let file = path.join(DIST, p), status = 200;
    if (!file.startsWith(DIST) || !fs.existsSync(file)) { file = path.join(DIST, '404.html'); status = 404; }
    for (const rule of rules) if (rule.pattern.test(url.pathname)) for (const [k, v] of rule.headers) res.setHeader(k, v.replace('upgrade-insecure-requests', ''));  // plain-http test server
    res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(PORT, r));

  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    let gtmRequests = 0;
    await ctx.route('https://www.googletagmanager.com/**', (route) => { gtmRequests++; route.fulfill({ contentType: 'text/javascript', body: 'window.__gtmStub = true;' }); });
    await ctx.addInitScript(() => {
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
      try { sessionStorage.setItem('om-loaded', '1'); } catch (e) { /* storage unavailable */ }
    });

    // 1 · headers + CSP on every route
    const violations = [], errors = [];
    for (const r of ROUTES) {
      const page = await ctx.newPage();
      page.on('pageerror', (e) => errors.push(`${r}: ${e.message}`));
      const res = await page.goto(SITE + r, { waitUntil: 'networkidle' });
      const h = res.headers();
      if (r === '/') {
        check('CSP header is served', /script-src 'self' 'sha256-/.test(h['content-security-policy'] || ''));
        check('security headers are served', h['x-content-type-options'] === 'nosniff' && h['x-frame-options'] === 'DENY' && !!h['strict-transport-security'] && !!h['referrer-policy']);
        check('motion tier script ran under the CSP', !!(await page.evaluate(() => document.documentElement.dataset.motion)));
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(300);
      violations.push(...(await page.evaluate(() => window.__csp)).map((v) => `${r}: ${v}`));
      await page.close();
    }
    check(`no CSP violations across ${ROUTES.length} routes`, violations.length === 0, violations.slice(0, 4).join(' | '));
    check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    check('fingerprinted assets are immutable', /immutable/.test((await (await fetch(`${SITE}/fonts/fraunces-opsz-latin.v5.3.0.woff2`)).headers.get('cache-control')) || ''));

    // 2 · consent-gated analytics
    const page = await ctx.newPage();
    await page.goto(SITE + '/', { waitUntil: 'networkidle' });
    check('consent bar shows on first visit', await page.isVisible('[data-consent]'));
    check('GTM does not load before consent', gtmRequests === 0);
    await page.click('[data-consent-accept]'); await page.waitForTimeout(400);
    check('GTM loads after Accept', gtmRequests === 1 && await page.evaluate(() => window.__gtmStub === true));
    await page.reload({ waitUntil: 'networkidle' });
    check('consent persists: no bar, GTM loads on the next page', !(await page.isVisible('[data-consent]')) && gtmRequests === 2);
    await page.click('[data-consent-open]');
    check('footer "Cookie preferences" reopens the choice', await page.isVisible('[data-consent]') && await page.evaluate(() => document.activeElement.matches('[data-consent-decline]')));
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('[data-consent-decline]')]);
    check('withdrawing consent reloads without GTM', gtmRequests === 2 && !(await page.evaluate(() => window.__gtmStub)));

    // 3 · consultation → function → CRM webhook
    await page.goto(SITE + '/?utm_source=deploy-check&utm_campaign=launch', { waitUntil: 'networkidle' });
    await page.click('.nav [data-consult-open]'); await page.waitForTimeout(900);
    const f = page.locator('[data-consult] form');
    await f.locator('input[name=practice]').fill('Maple Ortho');
    await f.locator('input[name=city]').fill('Austin, TX');
    await f.locator('input[name=locations][value="2-3"]').check({ force: true });
    await f.locator('[data-cnext]').click(); await page.waitForTimeout(500);
    await f.locator('input[name=goals][value=starts]').check({ force: true });
    await f.locator('[data-cnext]').click(); await page.waitForTimeout(500);
    await f.locator('input[name=current][value=agency]').check({ force: true });
    await f.locator('[data-cnext]').click(); await page.waitForTimeout(500);
    await f.locator('input[name=name]').fill('Jordan Lee');
    await f.locator('input[name=email]').fill('jordan@example.com');
    const [resp] = await Promise.all([page.waitForResponse('**/api/consultation'), f.locator('[data-cnext]').click()]);
    await page.waitForTimeout(800);
    check('form posts to /api/consultation and gets 200', resp.status() === 200);
    check('thank-you state is shown', await page.isVisible('[data-consult] [data-consult-done]'));
    const lead = leads[0] || {};
    check('the CRM webhook received the lead', lead.type === 'consultation_request' && lead.lead && lead.lead.email === 'jordan@example.com' && lead.lead.practice === 'Maple Ortho');
    check('attribution travels with the lead', lead.meta && lead.meta.utm_source === 'deploy-check' && lead.meta.utm_campaign === 'launch' && lead.meta.source === 'nav');
    await ctx.close();
  } finally {
    await browser.close(); server.close(); hook.close();
  }
  console.log(`\n${passed}/${passed + failed} checks passed`);
  process.exit(failed ? 1 : 0);
})();
