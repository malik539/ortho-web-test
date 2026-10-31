# Ortho Marketing: production build

The production website, built from the approved creative direction ([`creative-direction/`](creative-direction/)), experience blueprint, hero and motion system ([`experience/`](experience/)). The vanilla prototype in [`site/`](site/) is kept unchanged as the visual reference.

**Stack:** [Astro 7](https://astro.build) (static output) · vanilla ES modules · hand-written CSS on design tokens · one Netlify Function for the consultation form. No UI framework or animation library.

---

## 1. Commands

Node 22.12 or later.

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Static build to `dist/`, then writes `dist/_headers` (security headers + CSP) |
| `npm run preview` | Serve the built site at http://localhost:4321 |
| `npm test` | Lint → build → HTML validation → unit, site, accessibility and motion suites (needs Playwright + Chromium) |
| `npm run test:deploy` | Builds with production variables and checks headers, CSP, consent and the form → function → CRM path end to end |
| `npm run og` | Re-render the social cards in `public/og/` after changing a headline (needs Playwright) |
| `npm run fonts` / `npm run assets` | Re-copy font subsets / regenerate logo WebPs and icons (Python 3 + Pillow + numpy) |

Playwright isn't a project dependency (the browser is ~150 MB). Install it once with `npm i -g playwright && npx playwright install chromium`, or use any environment that already has it.

---

## 2. Architecture

```
src/
  data/          Content as plain modules (CMS-shaped): site facts, phases, cases, episodes, FAQs, SEO helpers
  layouts/       BaseLayout: head/SEO/JSON-LD, motion tier bootstrap, global chrome
  components/    Shared building blocks (Nav, Menu, Footer, ConsultForm, Compare, Metrics, PageHero, …)
    home/        The nine homepage sections, in story order
  pages/         Routes. Dynamic routes generate from data: treatment/[slug], results/[slug], live/[slug]
  scripts/
    motion/      kernel.js: the motion kernel (tokens, tiers, shared clock, scenes, reveals, navigation)
    lib/         dom helpers, analytics, overlay focus management, form submission
    scenes/      One module per scene (hero arch, crowd, rail, compare, radiograph, steps, waveform, …)
    site.js      Nav, menu, scroll tracking, UTM capture · consult.js (form) · consent.js (GTM)
  styles/        fonts → tokens → base → home → pages → consult → responsive
netlify/functions/consultation.mjs   POST /api/consultation → validates → forwards to your CRM
scripts/         headers.mjs (post-build CSP), og.mjs (social cards), copy-fonts.mjs, assets.py
tests/           run.cjs (runner), site-check, a11y-check, motion-check, consultation-function, deploy-check
```

**Pages (18):** `/`, `/treatment/` and the four phases, `/results/` and the case file, `/studio/`, `/live/` and three episodes, `/consultation/`, `/privacy/`, `/terms/`, `/accessibility/`, `404`.

**How it fits together**

- **Content before choreography.** Every word is in the HTML. Scripts only enhance. An inline head script sets the motion tier before first paint, and if scripts fail to boot within 4 s a failsafe reveals everything (`motion-failed`).
- **Motion tiers.** `full` (fine pointer), `lite` (touch, low memory, Save-Data: shorter durations, static grain) and `reduced` (OS setting or the in-site switch: no movement, same story). The kernel exposes one shared `requestAnimationFrame` clock that sleeps when nothing moves.
- **Scenes load per page.** Each component imports only its own scene module, so secondary pages ship a fraction of the homepage's JavaScript.
- **Scene cut between pages.** Cross-document view transitions open the next page from the midline while the nav holds still. Skipped under reduced motion; browsers without support navigate normally.
- **The consultation** is an overlay on every page (deep-linkable at `/consultation/` as a standalone page). The four steps validate inline, a draft persists locally, a honeypot catches bots, and UTM/referrer attribution travels with the lead.

---

## 3. Editing content

All copy that changes lives in `src/data/`:

| File | Holds |
|---|---|
| `site.js` | Agency facts, contact details, social links, podcast, consultation terms, nav and footer links |
| `phases.js` | The four treatment phases: headlines, copy, deliverables, milestones, FAQs, SEO title/description |
| `cases.js` | Case files. `illustrative: true` adds an on-page notice and keeps the page out of search |
| `episodes.js` | Podcast episodes (production: sync from the RSS feed at build time) |
| `content.js` | Homepage claims, first-visit steps, FAQs, principles, measures |

Adding a case file or episode is one object in the array: the route, sitemap, structured data and listings update on the next build. After changing a headline used on a social card, run `npm run og`.

---

## 4. Deployment

### Netlify (configured)

1. Create a site from this repository. `netlify.toml` already sets `npm run build`, `dist/` and the functions folder.
2. Set environment variables (Site configuration → Environment variables):

   | Variable | Value |
   |---|---|
   | `PUBLIC_CONSULT_ENDPOINT` | `/api/consultation` |
   | `CONSULT_WEBHOOK_URL` | Your CRM / automation webhook (HubSpot or Salesforce workflow, Zapier or Make catch hook, …) |
   | `CONSULT_WEBHOOK_TOKEN` | Optional bearer token for that webhook |
   | `PUBLIC_GTM_ID` | Optional `GTM-XXXXXXX`. Enables the consent bar; GTM loads only after Accept |

3. Deploy, then submit a test consultation and confirm it arrives in the CRM.
4. Point the domain at Netlify and enable HTTPS.

The forwarded payload is `{ type: "consultation_request", received_at, lead: {…}, meta: { source, page, utm_*, gclid, referrer, landing_page } }`.

### Cloudflare Pages or another static host

Build command `npm run build`, output `dist/`. Cloudflare Pages reads the generated `dist/_headers` as-is. On other hosts, copy its headers into the host's config. The form then needs its own endpoint: point `PUBLIC_CONSULT_ENDPOINT` at any HTTPS URL that accepts JSON (the endpoint's origin is added to the CSP automatically).

### Security headers

`scripts/headers.mjs` runs after every build and writes a strict Content-Security-Policy. Inline scripts are allowed by SHA-256 hash only, computed from the built HTML. Google Tag Manager hosts are added only when `PUBLIC_GTM_ID` is set. Also: HSTS (1 year), `nosniff`, frame denial, referrer and permissions policies, and immutable caching for fingerprinted assets and fonts.

- **GTM Custom HTML tags** inject inline scripts the CSP will block. Prefer GTM's built-in GA4/Ads tags, or add the needed hashes in `headers.mjs`.
- **HSTS:** after confirming every subdomain serves HTTPS, strengthen it to `max-age=63072000; includeSubDomains; preload` in `headers.mjs`.

---

## 5. Quality: what's verified

`npm test` runs all of this; `npm run test:deploy` covers the production configuration.

| Suite | Checks |
|---|---|
| ESLint | No undefined globals or unused code in scripts, tests and the function |
| html-validate | Every built page against the recommended ruleset: 0 errors |
| `site-check` | 18 routes × desktop and phone: 200, no console errors or failed requests, one H1, no overflow, no reveal left hidden; titles ≤ 70, descriptions 50–170, canonicals, robots, social images, JSON-LD, sitemap = indexable routes; every internal link and asset resolves; page-mode consultation completes (330 checks) |
| `a11y-check` | axe-core, WCAG 2.2 A/AA + best practice, on every page at both widths plus the open menu and consultation overlay: 0 violations |
| `motion-check` | 20 checks: idle frame budget, tiers, exact curves, reveals, cut navigation, reduce-motion switch, failsafe, overflow |
| `consultation-function` | 12 checks: method, origin, content type, size, validation, honeypot, misconfiguration, forwarding with token, upstream failure |
| `deploy-check` | 16 checks: CSP and security headers with zero violations, consent-gated GTM (nothing before Accept, persists, withdrawable from the footer), browser form → function → CRM webhook with attribution |

**Lab performance.** Phone at 390 px, throttled to slow 4G (1.6 Mbps, 150 ms) and 4× CPU, with gzip:

| Page | FCP | LCP | TBT | CLS |
|---|---|---|---|---|
| Home (first visit, with loader) | 1.06 s | 1.06 s | 240 ms | 0.001 |
| Home (repeat visit) | 1.05 s | 1.05 s | 275 ms | 0.000 |
| Treatment / phase / case / consultation / live | 0.92–1.06 s | = FCP | 44–145 ms | ≤ 0.023 |

Weight: about 16 KB of gzipped JavaScript for the whole site, split per page; one 14.6 KB gzipped stylesheet; 7–12 KB of HTML. Fonts are the largest cost: 198 KB for four latin subsets, three of them preloaded. Confirm with PageSpeed Insights and field data (CrUX) after launch.

**Browsers.**
- **Full experience:** current Chrome, Edge, Firefox and Safari.
- **Browsers back to 2022:** CSS is lowered with fallbacks, for example `vh` before `svh`.
- **Progressive extras:** view transitions, the animated FAQ height and balanced headings appear where supported.
- **Without JavaScript:** all content is readable.

---

## 6. Before launch: manual setup

These can't be done from the codebase and need Ortho Marketing's input or accounts.

**Accounts and configuration**
- [ ] **CRM webhook:** create the endpoint and set `CONSULT_WEBHOOK_URL` (+ token). Until then the live form shows a "couldn't send" message; it only fakes success on localhost.
- [ ] **Analytics:** create the GTM container (GA4 inside it) and set `PUBLIC_GTM_ID`. Map the `dataLayer` events (no personal data is ever pushed): `consultation_open`, `consultation_step`, `consultation_error`, `consultation_send_error`, `consultation_submit`, `consultation_abandon`, `cta_click`, `scroll_act`, `faq_open`, `menu_open`, `compare_interact`, `xray_toggle`, `episode_click`.
- [ ] **Domain, DNS and HTTPS** on the host. Then verify in Google Search Console and submit `https://orthomarketing.com/sitemap-index.xml`.
- [ ] **Redirects** from the current site's URLs to the new routes (add them to `netlify.toml` once the old URL list is exported).

**Content to confirm or supply**
- [ ] **Agency facts** marked `verify` in `src/data/site.js`: founding year, family-run, president bio, podcast episode count and Apple URL, consultation length and policy.
- [ ] **Contact details:** email, phone, address and social profiles in `site.js`. Empty values are simply not rendered.
- [ ] **Podcast episodes** in `episodes.js`: confirm numbers, titles and guests against the feed; ideally sync from RSS.
- [ ] **Case files:** replace the illustrative Alder Lane case (`cases.js`) with real, permissioned client work. Set `illustrative: false` and add it back to the sitemap (`NOINDEX` in `astro.config.mjs`). The homepage results section and its metrics are illustrative too.
- [ ] **Testimonial:** a real, attributed quote with permission.
- [ ] **Legal:** `/privacy/` and `/terms/` are drafts. Have counsel complete them (retention periods, processors, rights), then remove `noindex`.
- [ ] **Phase scope:** confirm deliverables, timelines and FAQ answers in `phases.js` match what the agency sells.

**Brand assets**
- [ ] **Fonts:** license GT Sectra Display, Söhne and Söhne Mono for web. Self-host them under the same family names in `src/styles/fonts.css` (Fraunces, Hanken Grotesk and IBM Plex Mono are OFL stand-ins), then update the preloads in `BaseLayout.astro`.
- [ ] **Logo vectors:** replace the logo WebPs in `public/assets/` (prepared from the supplied logo image) with exports from the master vector files, and re-run `npm run assets` for icons.
- [ ] **Photography:** the studio plate is an interim lighting test (the Orb lit with the portrait's lighting plan) and the macro plate is drawn in code. Commission the shoots described in the creative direction and [`experience/PREMIUM-AUDIT.md`](experience/PREMIUM-AUDIT.md) §13, then drop the images into `PortraitPlate` / `MacroPlate`.

**Final QA**
- [ ] Cross-browser pass in Safari (macOS and iOS) and Firefox. The automated suites run in Chromium only.
- [ ] Screen-reader pass with VoiceOver and NVDA on the homepage and the consultation flow.
- [ ] PageSpeed Insights on the deployed URL (mobile) and a CrUX check after four weeks.

---

## 7. Notes

- **Dependency audit:** production dependencies have no known advisories. Development-only ESLint pulls a `minimatch` version with a moderate ReDoS advisory (GHSA-g3hv-75wg-m249). Its fix was published days ago, so it's left for ESLint to adopt rather than forced with an override. It never ships to the browser.
- **FAQ structured data** is valid, but Google currently shows FAQ rich results only for a few authoritative sites; it still helps other search and answer engines.
- **The prototype in `site/`** keeps the original canvas blur on the hero arch. Production replaces it with an alpha-based depth cue, which cut homepage main-thread blocking from about 2 s to about 250 ms on a throttled phone.
