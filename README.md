# Ortho Marketing: *Light, Continuous Force*

The website for [Ortho Marketing](https://orthomarketing.com/), from cinematic creative direction to a production-ready build. The palette is matched to the agency's logo.

> **We move markets the way you move teeth.**
> Orthodontists move teeth with *light, continuous force*: gentle, constant pressure applied over time. The site applies the same principle to the agency's own story. Its building blocks are the logo's "O" (the Orb), a single archwire, the midline, and the alignment reveal.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:4321>. To build and verify everything (needs Playwright with Chromium):

```bash
npm test
```

**[BUILD.md](BUILD.md)** covers architecture, content editing, deployment, test results, and the **manual setup list before launch**.

## What's here

| Path | What it is |
|---|---|
| [`src/`](src/) | **The production site** (Astro 7, static). 18 pages: home, treatment and four phases, results and case file, studio, podcast and episodes, consultation, legal, accessibility, 404. Content lives in `src/data/`. |
| [`netlify/functions/`](netlify/functions/) | The consultation endpoint: validates leads and forwards them to your CRM webhook. |
| [`tests/`](tests/) | Regression suites: routes and SEO, axe-core accessibility, motion system, the form function, and the production configuration (headers, CSP, consent, form → CRM). |
| [`experience/MOTION-SYSTEM.md`](experience/MOTION-SYSTEM.md) | **The cinematic motion system:** principles, tokens, choreography, the full catalogue, performance budgets, mobile and reduced-motion tiers, accessibility and QA. |
| [`experience/HERO.md`](experience/HERO.md) | **The cinematic hero, "Shape Memory":** concept, composition, copy, the 3D arch, lighting, entrance timeline, interactions, performance and QA. |
| [`experience/WEBSITE-BLUEPRINT.md`](experience/WEBSITE-BLUEPRINT.md) | **The experience blueprint:** narrative, brand system, every section in order with copy, layout, motion, CTA and analytics, the conversion flow, secondary pages, responsive matrix, accessibility and performance specs. |
| [`creative-direction/`](creative-direction/) | The creative direction (v1.1) and W3C design tokens. |
| [`site/`](site/) | The approved vanilla prototype and Motion Lab (`site/motion.html`), kept as the visual reference. Serve with `cd site && python3 -m http.server 8000`. |

## The journey

`00 Loader` → `01 Cold open` → `02 Diagnosis` → `03 Treatment plan` → `04 Before / After` → `05 The family` → `06 Live` → `07 Your first visit` → `08 Debond` → **Records appointment (consultation)** → `09 End credits`

**Things to try:**
- **Loading screen:** the Orb (the logo's O) appears, its crescent smiles, then it flies into the nav logo. It plays once per session.
- **Hero:** an archwire of light enters crowded, then springs into a perfect arch. Move the cursor near the brackets and they yield; hover *Begin your consultation* to send a pulse down the wire.
- **Act I:** scroll slowly. Competitors' claims spread out and leave space in the center.
- **Act III:** drag the wire (or use the arrow keys), then press **Radiograph view**.
- **Any "Begin your consultation":** the Orb's blue floods the screen and the four-step records appointment opens. Submit it empty to see validation, close it halfway and reopen it (your draft is restored), then complete it.
- **Move between pages:** the next page opens from the midline while the nav holds still.
- **Reduce motion:** the switch in the footer or menu, or the OS setting. The story stays the same and the movement stops.

## Before launch

Case data, metrics and the testimonial are **illustrative**, and agency facts came from public listings and need confirming. Contact details, the CRM webhook, analytics, font licenses, photography and legal copy also need Ortho Marketing's input. See **[BUILD.md → Before launch](BUILD.md#6-before-launch-manual-setup)**.
