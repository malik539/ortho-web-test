/* ==========================================================================
   Motion system checks (Playwright, Chromium).
   Run:  npm run build && npm run serve        (serves dist/ on :4321)
         npm run test:motion                    (or BASE=… node tests/motion-check.cjs)
   Verifies the guarantees in experience/MOTION-SYSTEM.md §6, §8 and §11.
   ========================================================================== */
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:4321';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };

const countFrames = (page, ms) => page.evaluate((ms) => new Promise((res) => {
  let n = 0; const orig = window.requestAnimationFrame;
  window.requestAnimationFrame = (cb) => { n++; return orig(cb); };
  setTimeout(() => { window.requestAnimationFrame = orig; res(n); }, ms);
}), ms);
const skipLoader = (ctx) => ctx.addInitScript(() => { try { sessionStorage.setItem('om-loaded', '1'); } catch (e) { /* noop */ } });

(async () => {
  const browser = await chromium.launch();

  // 1 · Loader is skippable by any input and never exceeds its cap
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/');
    await page.waitForTimeout(300);
    const t0 = Date.now();
    await page.keyboard.press('Shift');
    await page.waitForFunction(() => !document.documentElement.classList.contains('is-loading'), null, { timeout: 4000 });
    const ms = Date.now() - t0;
    check('Loader fast-forwards on input', ms < 900, `${ms}ms after keypress`);
    await ctx.close();
  }

  // 2 · Desktop: tier, exact curves, idle clock, reveals, cut, switch
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await skipLoader(ctx);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE + '/');
    check('Desktop tier is full', (await page.evaluate(() => OMMotion.tier)) === 'full');
    const f = await page.evaluate(() => OMMotion.ease.force(0.5));
    check('JS curve matches CSS --ease-force', Math.abs(f - 0.9718) < 0.002, f.toFixed(4));
    await page.waitForTimeout(4000);
    const idleTop = await countFrames(page, 2000);
    check('Idle at rest (hero): zero frames', idleTop === 0, `${idleTop} frames in 2s`);
    await page.evaluate(() => scrollTo(0, document.querySelector('#treatment').offsetTop));
    await page.waitForTimeout(2600);
    const lines = await page.evaluate(() => { const h = document.querySelector('#plan-title'); return { inn: h.classList.contains('is-in'), text: h.textContent.replace(/\s+/g, ' ').trim() }; });
    check('Heading revealed by lines without altering its text', lines.inn && lines.text === 'Four phases. One continuous force.', lines.text);
    const idleMid = await countFrames(page, 2000);
    check('Idle at rest (mid-page): zero frames', idleMid === 0, `${idleMid} frames in 2s`);
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600);
    await page.click('[data-cta="hero-results"]');
    await page.waitForTimeout(1500);
    const cut = await page.evaluate(() => ({ top: Math.round(document.querySelector('#results').getBoundingClientRect().top), focus: document.activeElement.id }));
    check('Cut lands on target and moves focus', Math.abs(cut.top - 80) < 4 && cut.focus === 'results-title', JSON.stringify(cut));
    await page.evaluate(() => document.querySelector('.credits [data-motion-toggle]').click());
    await page.waitForTimeout(100);
    const sw = await page.evaluate(() => [document.documentElement.dataset.motion, localStorage.getItem('om-motion')]);
    check('In-site switch reduces motion and persists', sw[0] === 'reduced' && sw[1] === 'reduced', sw.join(' / '));
    await page.evaluate(() => document.querySelector('.credits [data-motion-toggle]').click());
    check('No runtime errors (desktop)', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // 3 · Phone: lite tier, shorter pins, static grain, idle clock
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await skipLoader(ctx);
    const page = await ctx.newPage();
    await page.goto(BASE + '/');
    await page.waitForTimeout(3500);
    const lite = await page.evaluate(() => ({ tier: OMMotion.tier, force: OMMotion.tokens.d.force, grain: getComputedStyle(document.querySelector('.grain')).animationName, pin: Math.round(document.querySelector('.crowd').offsetHeight / innerHeight * 100) }));
    check('Touch device runs lite tier', lite.tier === 'lite' && lite.force === 1100 && lite.grain === 'none' && lite.pin === 220, JSON.stringify(lite));
    const idle = await countFrames(page, 2000);
    check('Idle at rest (phone): zero frames', idle === 0, `${idle} frames in 2s`);
    await ctx.close();
  }

  // 4 · Reduced motion: no loader, end states immediately, no pins
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/');
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({
      tier: OMMotion.tier,
      loader: !!document.querySelector('[data-loader]'),
      revealed: [...document.querySelectorAll('[data-reveal]')].every((el) => el.classList.contains('is-in')),
      pinned: getComputedStyle(document.querySelector('.crowd__sticky')).position,
    }));
    check('Reduced: tier, no loader, all content present, no pins', r.tier === 'reduced' && !r.loader && r.revealed && r.pinned !== 'sticky', JSON.stringify(r));
    await ctx.close();
  }

  // 5 · No horizontal overflow anywhere, at any size
  for (const [w, h, mobile] of [[1920, 1080], [1440, 900], [1280, 720], [834, 1112, true], [390, 844, true], [320, 640, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: !!mobile, hasTouch: !!mobile });
    await skipLoader(ctx);
    const page = await ctx.newPage();
    await page.goto(BASE + '/');
    await page.waitForTimeout(500);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    let worst = 0;
    for (let y = 0; y < H; y += Math.round(h * 0.8)) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(40);
      worst = Math.max(worst, await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
    }
    check(`No horizontal overflow at ${w}×${h}`, worst === 0, `${worst}px`);
    await ctx.close();
  }

  // 7 · Failsafe: if the motion scripts are blocked, content is never stranded invisible
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await skipLoader(ctx);
    const page = await ctx.newPage();
    await page.route('**/_astro/kernel.*.js', (route) => route.abort());
    await page.goto(BASE + '/');
    await page.waitForTimeout(4600);
    const fs = await page.evaluate(() => ({
      failed: document.documentElement.classList.contains('motion-failed'),
      heroSub: getComputedStyle(document.querySelector('.hero__sub')).opacity,
      heading: getComputedStyle(document.querySelector('#plan-title')).opacity,
    }));
    check('Failsafe reveals content when scripts are blocked', fs.failed && fs.heroSub === '1' && fs.heading === '1', JSON.stringify(fs));
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await skipLoader(ctx);
    const page = await ctx.newPage();
    await page.goto(BASE + '/');
    await page.waitForTimeout(4600);
    check('Failsafe stays off on a normal load', !(await page.evaluate(() => document.documentElement.classList.contains('motion-failed'))));
    await ctx.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
})();
