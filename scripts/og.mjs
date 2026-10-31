/* Social cards (Open Graph / Twitter), 1200×630 PNG, rendered in Chromium with the site's own
   fonts, logo and palette. Output is committed to public/og/, so builds never depend on a browser.

   Run after changing a headline:  npm run og
   Requires Playwright with Chromium (not a project dependency — install it globally or with npx). */
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PHASES } from '../src/data/phases.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = fileURLToPath(new URL('..', import.meta.url));
const out = `${root}public/og/`;
const b64 = (p) => readFileSync(root + p).toString('base64');

const CARDS = [
  { slug: 'og-default', label: 'Brand · Web · Growth', title: ['We move markets', 'the way you move teeth.'] },
  { slug: 'og-treatment', label: 'Treatment plan', title: ['Four phases.', 'One continuous force.'] },
  ...PHASES.map((p) => ({ slug: `og-${p.slug}`, label: `Phase ${p.number} · ${p.name}`, title: p.headline })),
  { slug: 'og-results', label: 'Results · Case files', title: ['Same practice.', 'Different market.'] },
  { slug: 'og-studio', label: 'Studio · The family', title: ['A family practice,', 'for family practices.'] },
  { slug: 'og-live', label: 'Ortho Marketing Live', title: ['Conversations on', 'practice growth.'] },
  { slug: 'og-consultation', label: 'First visit', title: ['What happens', 'when you reach out.'] },
];

const fonts = `
  @font-face { font-family: F; font-style: normal; font-weight: 100 900; src: url(data:font/woff2;base64,${b64('public/fonts/fraunces-opsz-latin.v5.3.0.woff2')}) format("woff2"); }
  @font-face { font-family: F; font-style: italic; font-weight: 100 900; src: url(data:font/woff2;base64,${b64('public/fonts/fraunces-opsz-italic-latin.v5.3.0.woff2')}) format("woff2"); }
  @font-face { font-family: M; src: url(data:font/woff2;base64,${b64('public/fonts/ibm-plex-mono-400-latin.v5.3.0.woff2')}) format("woff2"); }`;
const logo = `data:image/webp;base64,${b64('public/assets/ortho-marketing-logo-reversed-660.webp')}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = (c) => {
  const len = c.title.join(' ').length;
  const size = len > 46 ? 70 : len > 34 ? 84 : 96;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0A0A0C; color: #F4F1EB; position: relative; }
  .light { position: absolute; inset: 0; background:
      radial-gradient(60% 80% at 88% 0%, rgba(31,42,255,.30), transparent 62%),
      radial-gradient(40% 50% at 100% 100%, rgba(115,123,255,.10), transparent 70%); }
  .logo { position: absolute; left: 72px; top: 64px; width: 236px; height: auto; }
  .label { position: absolute; right: 72px; top: 74px; font: 400 15px/1 M; letter-spacing: .14em; text-transform: uppercase; color: #737BFF; }
  h1 { position: absolute; left: 72px; right: 140px; bottom: 168px; font: 300 ${size}px/1.02 F; letter-spacing: -.03em; font-optical-sizing: auto; }
  h1 span { display: block; text-wrap: balance; }
  h1 em { display: block; font-style: italic; }
  .wire { position: absolute; left: 0; right: 0; bottom: 116px; height: 1px; background: linear-gradient(90deg, rgba(115,123,255,.0), rgba(115,123,255,.7) 12%, rgba(115,123,255,.7) 88%, rgba(115,123,255,0)); }
  .bracket { position: absolute; left: 72px; bottom: 109px; width: 15px; height: 15px; background: #1F2AFF; box-shadow: 0 0 24px rgba(31,42,255,.8); }
  .foot { position: absolute; left: 72px; right: 72px; bottom: 60px; display: flex; justify-content: space-between; font: 400 15px/1 M; letter-spacing: .14em; text-transform: uppercase; color: rgba(244,241,235,.62); }
  </style></head><body>
  <div class="light"></div>
  <img class="logo" src="${logo}" alt="">
  <p class="label">${esc(c.label)}</p>
  <h1><span>${esc(c.title[0])}</span>${c.title[1] ? `<em>${esc(c.title[1])}</em>` : ''}</h1>
  <span class="wire"></span><span class="bracket"></span>
  <p class="foot"><span>orthomarketing.com</span><span>For orthodontic practices</span></p>
  </body></html>`;
};

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const c of CARDS) {
  await page.setContent(html(c), { waitUntil: 'load' });
  await page.evaluate(() => globalThis.document.fonts.ready); // runs in the page, not in Node
  await page.screenshot({ path: `${out}${c.slug}.png`, type: 'png' });
  console.log(`public/og/${c.slug}.png`);
}
await browser.close();
