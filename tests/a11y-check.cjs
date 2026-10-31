/* Accessibility check: axe-core (WCAG 2.0/2.1/2.2 A + AA and best practice) on every route at desktop
   and phone widths after all reveals have run, plus the open mobile menu and consultation overlay.
   Run against a static server of dist/ (tests/run.cjs starts one):  BASE=http://localhost:4321 node tests/a11y-check.cjs */
const { chromium } = require('playwright');
const AXE = require.resolve('axe-core/axe.min.js');
const BASE = process.env.BASE || 'http://localhost:4321';
const ROUTES = ['/', '/treatment/', '/treatment/records/', '/treatment/alignment/', '/treatment/force/', '/treatment/retention/',
  '/results/', '/results/alder-lane/', '/studio/', '/live/', '/live/172-virtual-assistants/', '/live/168-patient-reactivation/',
  '/live/79-website-security/', '/consultation/', '/privacy/', '/terms/', '/accessibility/', '/404.html'];
const run = async (page, label) => {
  await page.addScriptTag({ path: AXE });
  const r = await page.evaluate(async () => {
    const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, resultTypes: ['violations'] });
    return res.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 3).map((x) => x.target.join(' ') + ' :: ' + (x.failureSummary || '').split('\n')[1]) }));
  });
  console.log(`${r.length ? '✗' : '✓'} ${label}`);
  r.forEach((v) => { console.log(`    ${v.impact} ${v.id} (${v.n})`); v.t.forEach((t) => console.log('       ', t.slice(0, 220))); });
  return r.length;
};
(async () => {
  const browser = await chromium.launch();
  let bad = 0;
  for (const vp of [{ width: 1440, height: 900, n: 'd' }, { width: 390, height: 844, n: 'm' }]) {
    const ctx = await browser.newContext({ viewport: vp });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('om-loaded', '1'); } catch (e) {} });
    for (const r of ROUTES) {
      const page = await ctx.newPage();
      await page.goto(BASE + r, { waitUntil: 'networkidle' });
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += vp.height * 0.7) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(90); }
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
      bad += await run(page, `${vp.n} ${r}`);
      await page.close();
    }
    // overlay open + mobile menu open
    const page = await ctx.newPage();
    await page.goto(BASE + '/treatment/', { waitUntil: 'networkidle' });
    if (vp.n === 'm') {
      await page.click('button[aria-controls="menu"]');
      await page.waitForTimeout(900);
      bad += await run(page, `${vp.n} menu open`);
      await page.keyboard.press('Escape'); await page.waitForTimeout(700);
    }
    await page.click('.nav [data-consult-open]'); await page.waitForTimeout(1400);
    bad += await run(page, `${vp.n} consult overlay open`);
    await page.close();
    await ctx.close();
  }
  await browser.close();
  console.log(bad ? `\n${bad} page states with violations` : '\nNo axe violations');
  process.exit(bad ? 1 : 0);
})();
