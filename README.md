# Ortho Marketing — *Light, Continuous Force*

A cinematic creative direction and a complete website experience blueprint for [Ortho Marketing](https://orthomarketing.com/), with a working prototype that builds every homepage section, from the loading screen to a submitted consultation request. The palette is matched to the agency's logo.

> **We move markets the way you move teeth.**
> Orthodontists move teeth with *light, continuous force*: gentle, constant pressure applied over time. The site applies the same principle to the agency's own story. Its building blocks are the logo's "O" (the Orb), a single archwire, the midline, and the alignment reveal.

## What's here

| Path | What it is |
|---|---|
| [`experience/HERO.md`](experience/HERO.md) | **The cinematic hero, "Shape Memory":** concept, composition and solver, copy with A/B variants, typography, the 3D arch, lighting, entrance timeline, hover and scroll behavior, the CTA, performance, accessibility and QA. |
| [`experience/WEBSITE-BLUEPRINT.md`](experience/WEBSITE-BLUEPRINT.md) | **The implementation-ready blueprint.** Experience strategy, the nine-question narrative, the logo-matched brand system, global systems (nav, menu, scenes, transitions), every section in order (job, final copy, layout per breakpoint, visuals, interactions, motion, transitions, CTA, accessibility, analytics, CMS fields), the full conversion flow, secondary pages, a responsive matrix, the accessibility spec, the performance budget, a QA checklist, and a content checklist. |
| [`creative-direction/CREATIVE-DIRECTION.md`](creative-direction/CREATIVE-DIRECTION.md) | The creative direction (v1.1): idea, art direction, typography, color, imagery, lighting, texture, depth, motion and voice. |
| [`creative-direction/tokens.json`](creative-direction/tokens.json) | Design tokens (W3C format) for Figma / Style Dictionary. |
| [`site/`](site/) | Working prototype: `index.html`, `tokens.css`, `styles.css`, `main.js` (vanilla, no dependencies). |
| [`site/assets/`](site/assets/) | Logo in full color, reversed (dark grounds) and white (on blue), plus the Orb as an SVG. |

## The journey

`00 Loader` → `01 Cold open` → `02 Diagnosis` → `03 Treatment plan` → `04 Before / After` → `05 The family` → `06 Live` → `07 Your first visit` → `08 Debond` → **Records appointment (consultation overlay)** → `09 End credits`

## View the prototype

```bash
cd site && python3 -m http.server 8000
```

Then open <http://localhost:8000>.

**Things to try:**
- **Loading screen:** the Orb (the logo's O) appears, its crescent smiles, then it flies into the nav logo. It plays once per session; open a new tab or a private window to see it again.
- **Hero:** an archwire of light enters crowded, then springs into a perfect arch (shape memory). Move the cursor near the brackets and they yield, then spring back. Hover *Begin your consultation* to send a pulse down the wire. Scroll to watch the camera crane over the arch.
- **Act I:** scroll slowly. Competitors' claims spread out and leave space in the center.
- **Act III:** drag the wire (or use the arrow keys), then press **Radiograph view**.
- **Any "Begin your consultation" button:** the Orb's blue floods the screen and the four-step records appointment opens. Try submitting it empty to see validation, close it halfway and reopen it (your draft is restored), then complete it to see the confirmation.
- **Tablet or phone width:** the menu opens as a circle growing from the Menu button.
- **Director's notes** (lower right) annotates every section with its job and the reasoning behind it.
- Turn on *reduce motion* in your OS. The story stays the same and the movement stops.

## Before launch

Case data, metrics and the testimonial are **illustrative**. Facts about the agency came from public directory and podcast listings and need confirming. See **Blueprint §10** and **Creative Direction §21**.
