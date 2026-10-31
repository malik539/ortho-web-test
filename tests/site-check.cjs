/* Site regression check: every route, at desktop and phone widths.
   - HTTP 200 (404 page: 404 status from a host, file served here), no console errors, no failed requests
   - SEO: title ≤ 70 chars, meta description 50–170, canonical = production URL, robots for drafts,
     og:image exists on disk, JSON-LD parses, sitemap lists exactly the indexable routes
   - Structure: one H1, lang, skip link, every <img> has alt, no horizontal overflow, no hidden reveals
   - Every internal link and asset reference resolves
   - The standalone consultation page completes in local demo mode
   Run against a static server of dist/ (tests/run.cjs starts one):  BASE=http://localhost:4321 node tests/site-check.cjs */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:4321';
const DIST = path.resolve(__dirname, '../dist');
const PROD = 'https://orthomarketing.com';
const NOINDEX = ['/results/alder-lane/', '/privacy/', '/terms/', '/404.html'];
const ROUTES = ['/', '/treatment/', '/treatment/records/', '/treatment/alignment/', '/treatment/force/', '/treatment/retention/',
  '/results/', '/results/alder-lane/', '/studio/', '/live/', '/live/172-virtual-assistants/', '/live/168-patient-reactivation/',
  '/live/79-website-security/', '/consultation/', '/privacy/', '/terms/', '/accessibility/', '/404.html'];

let passed = 0, failed = 0;
const fail = [];
const check = (name, ok, detail = '') => { if (ok) passed++; else { failed++; fail.push(`${name} ${detail}`); console.log(`FAIL  ${name} ${detail}`); } };

(async () => {
  // Sitemap ⇔ indexable routes
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(PROD, '')).sort();
  const indexable = ROUTES.filter((r) => !NOINDEX.includes(r)).sort();
  check('sitemap lists exactly the indexable routes', JSON.stringify(listed) === JSON.stringify(indexable), `listed=${listed.length} expected=${indexable.length}`);
  check('robots.txt points to the sitemap', /Sitemap: https:\/\/orthomarketing\.com\/sitemap-index\.xml/.test(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8')));

  const browser = await chromium.launch();
  const links = new Set();
  for (const vp of [{ width: 1440, height: 900, n: 'desktop' }, { width: 390, height: 844, n: 'phone' }]) {
    const ctx = await browser.newContext({ viewport: vp });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('om-loaded', '1'); } catch (e) { /* storage unavailable */ } });
    for (const r of ROUTES) {
      const page = await ctx.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push(e.message));
      page.on('response', (res) => { if (res.status() >= 400 && !res.url().endsWith('/404.html')) errs.push(`${res.status()} ${res.url()}`); });
      const res = await page.goto(BASE + r, { waitUntil: 'networkidle' });
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += vp.height * 0.8) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(80); }
      await page.waitForTimeout(1200);
      const d = await page.evaluate(() => {
        const meta = (sel, attr = 'content') => { const el = document.querySelector(sel); return el ? el.getAttribute(attr) : null; };
        const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch (e) { return false; } });
        return {
          lang: document.documentElement.lang, title: document.title, desc: meta('meta[name="description"]'),
          canonical: meta('link[rel="canonical"]', 'href'), robots: meta('meta[name="robots"]'), og: meta('meta[property="og:image"]'),
          h1: document.querySelectorAll('h1').length, skip: !!document.querySelector('a.skip[href="#main"]'),
          imgNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
          ld, overflow: document.documentElement.scrollWidth - window.innerWidth,
          hidden: [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().height > 0).length,
          failed: document.documentElement.classList.contains('motion-failed'),
          links: [...document.querySelectorAll('a[href^="/"], link[href^="/"], img[src^="/"], script[src^="/"]')].map((el) => (el.getAttribute('href') || el.getAttribute('src')).split('#')[0]),
        };
      });
      const id = `${vp.n} ${r}`;
      check(`${id} status`, res.status() === 200, String(res.status()));
      check(`${id} no console errors or failed requests`, errs.length === 0, errs.slice(0, 3).join(' | '));
      check(`${id} one H1`, d.h1 === 1, String(d.h1));
      check(`${id} no horizontal overflow`, d.overflow <= 0, `${d.overflow}px`);
      check(`${id} no reveal left hidden`, d.hidden === 0 && !d.failed, `${d.hidden}${d.failed ? ' motion-failed' : ''}`);
      if (vp.n === 'desktop') {
        const expected = r === '/404.html' ? null : PROD + r;   // the 404 page has no canonical URL
        check(`${r} lang + skip link`, d.lang === 'en' && d.skip);
        check(`${r} title ≤ 70`, d.title && d.title.length <= 70, `${d.title.length}: ${d.title}`);
        check(`${r} description 50–170`, d.desc && d.desc.length >= 50 && d.desc.length <= 170, String(d.desc && d.desc.length));
        check(`${r} canonical`, d.canonical === expected, d.canonical);
        check(`${r} robots`, NOINDEX.includes(r) ? /noindex/.test(d.robots || '') : !d.robots);
        check(`${r} og:image exists`, !!d.og && fs.existsSync(path.join(DIST, new URL(d.og).pathname)), d.og);
        check(`${r} JSON-LD parses`, d.ld.length > 0 && d.ld.every(Boolean));
        check(`${r} images have alt`, d.imgNoAlt === 0, String(d.imgNoAlt));
        d.links.forEach((l) => links.add(l));
      }
      await page.close();
    }
    await ctx.close();
  }

  // Every internal link / asset reference resolves
  const broken = [];
  for (const l of links) { const res = await fetch(BASE + l); if (res.status !== 200) broken.push(`${res.status} ${l}`); }
  check(`all ${links.size} internal links and assets resolve`, broken.length === 0, broken.slice(0, 5).join(' | '));

  // Standalone consultation page, local demo mode (no endpoint configured in this build)
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/consultation/', { waitUntil: 'networkidle' });
  const f = page.locator('[data-consult-page] form');
  await f.locator('[data-cnext]').click();
  check('consultation: empty step focuses the first invalid field', await page.evaluate(() => document.activeElement && document.activeElement.name === 'practice'));
  await f.locator('input[name=practice]').fill('Maple Ortho');
  await f.locator('input[name=city]').fill('Austin, TX');
  await f.locator('input[name=locations][value="1"]').check({ force: true });
  await f.locator('[data-cnext]').click(); await page.waitForTimeout(500);
  await f.locator('input[name=goals][value=website]').check({ force: true });
  await f.locator('[data-cnext]').click(); await page.waitForTimeout(500);
  await f.locator('input[name=current][value=little]').check({ force: true });
  await f.locator('[data-cnext]').click(); await page.waitForTimeout(500);
  await f.locator('input[name=name]').fill('Jordan Lee');
  await f.locator('input[name=email]').fill('jordan@example.com');
  await f.locator('[data-cnext]').click(); await page.waitForTimeout(1600);
  check('consultation: page mode reaches the thank-you state', /Thank you, Jordan/.test(await page.locator('[data-consult-page] [data-consult-done]').innerText().catch(() => '')));
  check('consultation: thank-you panel is in view', await page.evaluate(() => { const r = document.querySelector('[data-consult-page]').getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; }));
  await browser.close();

  console.log(failed ? `\n${failed} failed, ${passed} passed` : `\n${passed}/${passed} checks passed`);
  process.exit(failed ? 1 : 0);
})();
