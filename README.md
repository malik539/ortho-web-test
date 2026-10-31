# Ortho Marketing — *Light, Continuous Force*

A cinematic creative direction for [Ortho Marketing](https://orthomarketing.com/), delivered as a written direction plus a working homepage prototype that puts it into practice.

> **We move markets the way you move teeth.**
> Orthodontists move teeth with *light, continuous force*: gentle, constant pressure applied over time. This direction applies the same principle to the agency's brand, website and story, and turns its vocabulary (crowding, records, alignment, the archwire, debond, retention) into a complete visual and motion system.

## What's here

| Path | What it is |
|---|---|
| [`creative-direction/CREATIVE-DIRECTION.md`](creative-direction/CREATIVE-DIRECTION.md) | The full creative direction: idea, storytelling, art direction, composition, typography, color, imagery, lighting, texture, depth, motion, voice, sitemap and page blueprints, components, accessibility, technical translation, production plan and launch verification checklist. |
| [`creative-direction/tokens.json`](creative-direction/tokens.json) | Design tokens (W3C format) for Figma / Style Dictionary. |
| [`site/index.html`](site/index.html) | Working homepage prototype: the site as a film in five acts. |
| [`site/tokens.css`](site/tokens.css) | The same tokens as CSS custom properties. |
| [`site/styles.css`](site/styles.css) · [`site/main.js`](site/main.js) | Prototype styles and motion system (vanilla JS, no dependencies). |

## View the prototype

```bash
cd site && python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `site/index.html` directly also works.

**Things to try:**
- Watch the **cold open**: the operatory light switches on, and the crowded letters of the headline move into alignment along the red archwire.
- Scroll through **Act I** slowly. Scrolling applies force: competitors' claims spread out and leave space in the center.
- Move the cursor over the **bracket plate** to switch into radiograph view.
- **Drag the wire** in Before / After.
- Watch the **Treatment day** counter in the lower left. Reading the page is an 18-month course of treatment.
- Press **Director's notes** (lower right) to annotate every scene with the reasoning behind it.
- Turn on *reduce motion* in your OS. The story stays the same and the movement stops.

## Before launch

The prototype uses fictional practice names and **illustrative metrics**. Facts about the agency came from public directory and podcast listings. See **§21 Verification before launch** in the creative direction for the full checklist.
