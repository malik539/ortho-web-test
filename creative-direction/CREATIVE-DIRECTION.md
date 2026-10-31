# Light, Continuous Force
### A cinematic creative direction for Ortho Marketing

**Version 1.1 · October 2026.** v1.1 replaces the original red accent with a palette matched to the supplied Ortho Marketing logo and aligns the homepage sequence with the [Website Experience Blueprint](../experience/WEBSITE-BLUEPRINT.md).
Working prototype: [`/site/index.html`](../site/index.html) · Tokens: [`tokens.json`](./tokens.json) and [`/site/tokens.css`](../site/tokens.css)

---

## Contents

1. [The brief, reframed](#1-the-brief-reframed)
2. [The idea](#2-the-idea-light-continuous-force)
3. [Creative principles](#3-creative-principles)
4. [Visual storytelling: the site as a film](#4-visual-storytelling-the-site-as-a-film)
5. [Art direction](#5-art-direction)
6. [Composition](#6-composition)
7. [Typography](#7-typography)
8. [Color](#8-color)
9. [Imagery](#9-imagery)
10. [Lighting](#10-lighting)
11. [Texture & material](#11-texture--material)
12. [Depth & atmosphere](#12-depth--atmosphere)
13. [Motion language](#13-motion-language)
14. [Voice & copy](#14-voice--copy)
15. [Site architecture & page blueprints](#15-site-architecture--page-blueprints)
16. [Component system](#16-component-system)
17. [Responsive behavior](#17-responsive-behavior)
18. [Accessibility](#18-accessibility)
19. [Technical translation](#19-technical-translation)
20. [Production plan](#20-production-plan)
21. [Verification before launch](#21-verification-before-launch)

---

## 1. The brief, reframed

### What we're working with

Ortho Marketing is a family-run agency founded in 2008. It serves orthodontic practices across brand, websites, SEO, paid media, social and reputation. It is led by President Dean Steinman, who has more than 25 years in orthodontic and dental marketing, and it produces the podcast *Ortho Marketing Live*. The agency describes itself as the country's #1 orthodontic marketing agency. (Every fact here is listed for verification in [§21](#21-verification-before-launch).)

### Who we're talking to

The audience is the orthodontist who owns a practice. That person is:

- **Trained in precision.** They plan movements to tenths of a millimeter. Vague promises and soft language make them suspicious straight away.
- **Fluent in a private language.** Crowding, space, records, debond, retention, light continuous force. If we speak it accurately, we're an insider. If we misuse it, we're out.
- **Persuaded by evidence.** Their own sales tool is the before-and-after, and they trust results they can see.
- **Under pressure.** DSOs consolidate, general dentists offer aligners, and paid-search costs keep rising. They're defending the practice they built.
- **Often a family business.** Partners, parents and children, associates who become owners. Many of them are building something to hand on.
- **Wary of salespeople.** They're sold to constantly, by labs, suppliers, software vendors and agencies.

### The problem with the category

Nearly every orthodontic marketing agency looks the same: teal and medical blue, tooth icons, stock teenagers smiling with braces, "Grow your practice!", three feature cards, a dashboard screenshot. The agencies have become as interchangeable as the practices they're meant to set apart.

**That is our clients' exact problem, at the agency's own scale.** The most persuasive thing the Ortho Marketing site can do is solve that problem on itself, in front of the visitor.

### What the website has to do

| # | Job | Measured by |
|---|-----|-------------|
| 1 | **Prove craft within five seconds.** The first frame should look like nothing else in the category. | Scroll depth past the hero, time on page |
| 2 | **Prove understanding.** Speak orthodontics fluently enough that a clinician feels recognized. | Engagement with the Treatment Plan and Results sections |
| 3 | **Convert to a consultation.** Turn a premium impression into a booked strategy call. | Consultation starts and completions |

---

## 2. The idea: Light, Continuous Force

Orthodontists learn early that teeth move best under **light, continuous force**. Heavy force gives fast-looking motion but damages tissue and stalls. Gentle, constant force applied over time is what moves bone. It's patient and precise, and it doesn't let up.

Good marketing works the same way. Campaigns that spike and disappear are heavy force. What moves a practice up a market, and keeps it there, is steady pressure applied over months: brand, website, search, reviews and referrals, calibrated and measured the whole time.

> ### We move markets the way you move teeth.

**Why this idea works**

- **It's ownable.** No generalist agency could say it believably. It only works for an orthodontic specialist.
- **It's an insider signal.** Any orthodontist recognizes the principle immediately, and that recognition builds trust before we've made a single claim.
- **It explains the business model.** Long-term engagement and retainer-style retention read as clinical best practice instead of a sales tactic.
- **It generates the design system.** Alignment, the archwire, the midline, the arch, treatment phases and radiographs are all visual material that comes directly from the idea, not decoration added afterwards.

**Guardrail: one clinical metaphor per screen, at most.** The idea gets its power from precision. If the site turns into a stream of tooth puns, the idea is dead. Where a metaphor doesn't make the meaning clearer, say the plain thing.

### Manifesto

> Every practice in your zip code promises a free consult, flexible financing and the latest technology. Louder isn't the answer. Space is.
>
> You never force a tooth into a crowded arch. You take records, make room and apply light, continuous force until everything sits exactly where it belongs. Then you protect the result.
>
> We work the same way. We measure your market, find the space nobody else holds, and move your practice into it, steadily and measurably, for as long as you practice.
>
> **Ortho Marketing. Light, continuous force. Since 2008.**

---

## 3. Creative principles

| Principle | Means | Doesn't mean |
|---|---|---|
| **1. Measured, not loud** | Large negative space, one accent color, quiet confidence. We create space, because that's literally the strategy. | Exclamation points, badges, competing CTAs, "limited time". |
| **2. Inevitable motion** | Everything moves slowly and steadily into place, like teeth under a wire. Motion carries meaning. | Bounce, springiness, parallax for its own sake, motion that only decorates. |
| **3. Clinical eye, human heart** | The rigor of a ceph tracing alongside the warmth of a family practice. Mono annotations next to emotional italics. | Cold medical sterility, or sentimental stock-photo warmth. |
| **4. Proof over promise** | Before/after, numbers, named people, real rooms. Every claim gets substantiated or cut. | "Award-winning", "best-in-class", unattributed testimonials. |

---

## 4. Visual storytelling: the site as a film

The homepage is a short film in acts, and the acts follow the arc of orthodontic treatment. A clinician reading from top to bottom goes through records, diagnosis, treatment and retention, and gets to the consultation feeling the agency already thinks the way they do.

| Scene | Treatment parallel | Ground | Emotional beat | Question answered | Signature moment |
|---|---|---|---|---|---|
| **Cold open** | The consultation | Dark | Intrigue → recognition | "Who are these people?" | The operatory light switches on; crowded letters align along the archwire |
| **Act I: Diagnosis** | Crowding | Light | Discomfort, being seen | "Do they understand my problem?" | Competitors' claims crowd together, then scroll pushes them to the edges and opens space |
| **Act II: Treatment plan** | Records → alignment → force → retention | Dark | Clarity, control | "What do they actually do?" | The sticky archwire rail engages a bracket for each phase |
| *(Interlude: The craft, moved to `/treatment/alignment` in v1.1)* | The appliance | Dark | Desire | "Is their work beautiful?" | Macro plate of a bracket with a radiograph scanner |
| **Act VI: Your first visit** | The first appointment | Light | Safety | "What happens if I reach out?" | Three steps on one wire, then the FAQ |
| **Act III: Before / After** | The result | Light | Proof | "Does it work?" | Before/after slider where the divider is the archwire |
| **Act IV: The family** | Chairside manner | Dark | Trust, kinship | "Will they care about my practice?" | Portrait lighting plan; family-run since 2008 |
| **Act V: Live** | Continuing education | Graphite | Authority, generosity | "Do they know the industry?" | On-air broadcast lamp and waveform |
| **Finale: Debond** | Braces come off | Dark | Release, celebration | "What's the next step?" | The wire settles into a perfect arch with fourteen brackets |
| **End credits** | Retention | Dark | Warmth | | Footer written as film credits |

### Story devices that run through the whole site

- **The archwire.** A single 1.5px line: Signal on dark grounds, Ortho Blue on light. It's the visual thread that ties every act together: it straightens in the hero, divides before from after, runs through the treatment rail, underlines on hover, and resolves into the arch at the end. It's always this weight, and always the brand blue for its ground.
- **The treatment-day counter.** A fixed HUD in the lower left that maps scroll position to an 18-month course of treatment, `Treatment day 001 / 540`. Reading the site literally becomes a course of treatment.
- **The midline.** A fixed vertical hairline at 50% of the viewport, at 8% opacity with difference blending so it works on dark and light. Orthodontists spend careers getting midlines right, and the site keeps one visible throughout.
- **Hard cuts.** Changes between dark and light scenes are cinematic cuts, not gradients. The contrast is the drama.

---

## 5. Art direction

### The world: *The Operatory After Hours*

Picture an orthodontic practice at 6:40 a.m., before anyone arrives. One lamp is on. Steel instruments sit in their trays. The chairs are empty, the room is quiet, and the light comes through a north window. It's a place of precision with nobody performing for anyone, which is how the brand should feel: clinical and cinematic, calm and exact.

### References (for the quality bar, never for imitation)

- **Cinematography:** Roger Deakins's single-source, motivated light. Kubrick's one-point symmetry, which is the midline (we save true symmetry for the opening and closing images). Denis Villeneuve's restraint and sense of scale.
- **Photography:** Irving Penn's still lifes, where an object becomes a portrait. Hiroshi Sugimoto's seascapes, where the horizon reads as the occlusal plane. Fine-watch macro photography, with its steel, raking light and obsessive cleanliness.
- **Graphic language:** Cephalometric tracings, Swiss typographic rationalism, Criterion Collection title cards, and scientific-instrument catalogues from the 1960s.

### Anti-references (what this brand never looks like)

- Teal, aqua or medical blue as a brand color. (Category cyan appears once, in Act I, as the noise.)
- Tooth icons, tooth-shaped logos, sparkle effects, smile arcs.
- Stock photos of teenagers with braces on white backgrounds, or families on beaches.
- Fake dashboards, isometric illustration, 3D-rendered teeth.
- Glassmorphism, gradient blobs, neon, generic purple-to-blue SaaS gradients.
- Three-icon feature rows. Logo walls used as decoration.

---

## 6. Composition

### Three compositional devices taken from orthodontics

| Device | Definition | Rules |
|---|---|---|
| **The Midline** | A fixed vertical axis at 50% | Display type sits left of the midline. Supporting copy sits right of it, bottom-aligned to the headline's last baseline. True symmetry about the midline is saved for the opening and closing images (the hero and the Debond finale), which bookend the film. |
| **The Occlusal Plane** | A horizontal axis | The archwire runs on it in the hero. In photography, horizons and tabletops sit on it. In layouts, it's where tension resolves. |
| **The Arch** | A parabolic curve | Used once per page at most (the finale on Home) and in the logo mark. Never as a decorative swoosh. |

### Grid

- **12 columns.** Maximum content width 1600px.
- **Margins:** `clamp(16px, 5vw − 3px, 80px)`. **Gutters:** `clamp(16px, 1.6vw + 10px, 32px)`.
- **Signature split:** display text spans columns 1–8 and supporting copy spans 9–12, bottom-aligned. This asymmetric tension shows up in every act header.
- **Section rhythm:** padding of `clamp(96px, 9vw + 64px, 224px)`. Heroes keep at least 40% of the canvas empty.
- **Scale contrast:** hero display type (up to 168px) against 12px mono annotations, a ratio of 10:1 or more. Dramatic scale contrast is a big part of what makes it feel cinematic.

### Breakpoints

`375` (base) · `760` (single column) · `1024` (sticky rails appear) · `1440` (design target) · `1600+` (content locks, margins grow)

---

## 7. Typography

### Families

| Role | Production face | Prototype fallback | Why |
|---|---|---|---|
| **Display** | **GT Sectra Display** (Grilli Type), Light/Book + Italic | Fraunces (variable, opsz) | Its letterforms look cut with a scalpel: calligraphic warmth with surgical sharpness. That's the brand's clinical-eye, human-heart duality in one typeface. |
| **Text** | **Söhne** (Klim), Buch/Kräftig | Hanken Grotesk | Engineered and neutral, with no personality competing with the display face. Very legible at small sizes. |
| **Mono** | **Söhne Mono** (Klim), Buch | IBM Plex Mono | The clinical annotation voice: measurements, case numbers, captions, the HUD. |

*All three production faces need web licenses. Budget for them before design sign-off.*

### Scale (fluid, min → max)

| Token | Size | Line-height | Tracking | Use |
|---|---|---|---|---|
| `--t-hero` | 40 → 168px | 0.94 | −0.032em | The cold-open headline only |
| `--t-d1` | 42 → 112px | 0.94 | −0.032em | Act headlines |
| `--t-d2` | 34 → 76px | 1.0 | −0.032em | Phase and section headlines |
| `--t-d3` | 26 → 44px | 1.15 | −0.02em | Episode titles, credits, sub-heads |
| `--t-lede` | 18 → 24px | 1.45 | 0 | Introductory paragraphs |
| `--t-body` | 16 → 17px | 1.6 | 0 | Body |
| `--t-small` | 14px | 1.55 | 0.01em | UI, buttons, spec lists |
| `--t-mono` | 12px | 1.5 | +0.09em, uppercase | Annotations, labels, HUD |

### Rules

1. **The italic is the emotional payoff.** Each headline gets one italic phrase, the word that lands: *"Your market is* ***crowded.****"*
2. **Display type is never bold.** Weights 300–400 only. The authority comes from scale, not weight.
3. **Mono is always uppercase, tracked +0.09em, 12px or smaller,** and only used for measurement-like content: labels, captions, numbers, metadata.
4. **Break headline lines by hand at phrase boundaries.** No more than eight words per headline.
5. **Numerals are lining.** They're tabular in the HUD, metrics and data.
6. **Measure is 34–46 characters** for ledes and body. No centered body text except in the finale.
7. **Optical sizing stays on.** Display tracking tightens as size grows.

---

## 8. Color

**The palette is matched to the Ortho Marketing logo.** The logo was sampled at Ortho Blue `#1F2AFF`, near-black `#000201` and a white crescent. The darks are tuned to the logo's black. The light neutrals keep their dental shade-tab names (BL1, A1, B2), which bring warmth next to the electric blue.

| Token | Name | Hex | Role |
|---|---|---|---|
| `--c-ortho-blue` | **Ortho Blue** | `#1F2AFF` | The logo color. Primary CTAs, the Orb, the consultation flood, the wire on light grounds. |
| `--c-ortho-blue-deep` | **Ortho Blue Deep** | `#1820D9` | Hover/pressed state on light grounds |
| `--c-signal` | **Signal** | `#737BFF` | Ortho Blue lifted for wires, labels, links and focus rings on dark grounds |
| `--c-crescent` | **Crescent** | `#FFFFFF` | The logo's smile. Text and controls on Ortho Blue. |
| `--c-occlusion` | **Occlusion** | `#0A0A0C` | Main dark ground, tuned to the logo black |
| `--c-graphite` | **Graphite** | `#16161A` | Raised dark surfaces, the Live scene |
| `--c-smoke` | **Smoke** | `#2E2E35` | Hairlines on dark (decorative only) |
| `--c-nitinol` | **Nitinol** | `#A4A7AE` | Secondary text and data on dark |
| `--c-nitinol-dim` | **Nitinol Dim** | `#85888F` | Tertiary and meta text on dark |
| `--c-porcelain` | **Porcelain · BL1** | `#F4F1EB` | Main light ground; text on dark |
| `--c-enamel` | **Enamel · A1** | `#EAE3D5` | Secondary light ground |
| `--c-dentin` | **Dentin · B2** | `#CFC3AC` | Hairlines on light (decorative only) |
| `--c-umber` | **Umber** | `#5E5750` | Secondary text on light |
| `--c-radiograph` | **Radiograph** | `#A9B4E8` | Only inside radiograph views |
| `--c-alert` | **Alert** | `#C2321F` | Form errors on light grounds only |

### The Orb

The logo's "O" is a blue sphere with a white smile-shaped crescent. It's a lamp, a lens and a smile at once, and the site uses it as a system element: it calibrates in the loading screen, flies into the nav logo, returns as the origin of the blue flood that opens the consultation, and smiles again on the confirmation screen. The logo opens the experience and closes it.

### Proportions

**About 55% Occlusion · 30% Porcelain/Enamel · 10% neutrals · no more than 5% Ortho Blue/Signal in any viewport.** The exception is the consultation overlay, the one full-bleed Ortho Blue surface.

### Rules

- **On dark grounds, Ortho Blue is a fill only** (buttons, the Orb, glows), because it's 2.67:1 against Occlusion. Use **Signal** for every blue line, wire, label or focus ring on dark.
- **On light grounds, Ortho Blue is the wire, the labels and the links** (6.57:1 on Porcelain).
- **Primary buttons are always Ortho Blue with white text (7.41:1).** On dark grounds they get a 1px Signal inner edge so the button boundary meets 3:1.
- **The archwire is Signal on dark and Ortho Blue on light.** It's always 1.5px.
- **Category cyan (`#19B3C4`) appears exactly once,** in Act I, as the noise we push away.
- **No red,** except form errors on light grounds. Errors on blue use `#FFD7D0`.
- **Client practices get their own palettes.** The "after" mockup in Act III is deliberately forest and brass, not Ortho Marketing's colors. We design their brands; we don't clone ours.

### Contrast (WCAG 2.2)

| Pair | Ratio | Passes |
|---|---|---|
| Porcelain on Occlusion | 17.5:1 | AAA |
| Nitinol on Occlusion | 8.21:1 | AAA |
| Nitinol Dim on Occlusion / Graphite | 5.57:1 / 5.08:1 | AA |
| Signal on Occlusion / Graphite | 5.66:1 / 5.16:1 | AA |
| White on Ortho Blue | 7.41:1 | AAA |
| Ortho Blue on Porcelain | 6.57:1 | AA |
| Ortho Blue Deep on Porcelain | 8.29:1 | AAA |
| Umber on Porcelain | 6.30:1 | AA |
| Error `#FFD7D0` on Ortho Blue | 5.6:1 | AA |
| Ortho Blue on Occlusion | 2.67:1 | **Fills only**, never text or lines |

## 9. Imagery

### Four photographic series

**1 · The Clinicians: portraits**
- *Subject:* Real orthodontists, team members, and Ortho Marketing's own family. Never models.
- *Light:* One key light, motivated by a real window or practical lamp. 8:1 lighting ratio. Negative fill on the shadow side.
- *Lens:* 85mm at f/1.8–2.8, at eye level or slightly below. Subjects are still, mid-thought, not "smiling for the camera".
- *Wardrobe:* Their own clothes or scrubs, in muted colors. No logos.
- *Never:* Crossed arms, thumbs up, staged laughter, white seamless backdrops.

**2 · The Instruments: macro still life**
- *Subject:* Brackets, archwires, ligatures, aligner trays, pliers, bands, all photographed like watch movements.
- *Light:* One strip light, raking from camera left, on black velvet. Polarized to control specular highlights.
- *Lens:* 100mm macro at f/8–f/11, focus-stacked for edge-to-edge sharpness.
- *Color:* Steel and black, with the elastic as the only color.
- *Where it appears:* the `/treatment/alignment` hero (the bracket-macro plate with the radiograph scanner).

**3 · The After: patients living**
- *Subject:* What a finished smile makes possible: a teen on stage, a bride mid-laugh, an adult presenting at work.
- *Rule:* **We never show a perfect smile straight on.** The mouth is mid-laugh, partly out of frame or turned away. The subject is the confidence, not the teeth.
- *Light:* Natural or available light, documentary handheld, 35mm.
- *Casting:* Real patients of client practices, with signed photo releases and treatment-confidentiality consent.

**4 · The Rooms: practice architecture**
- *Subject:* Client and agency spaces at blue hour or first light, empty or with one person.
- *Composition:* One-point perspective centered on the midline. Horizons on the occlusal plane.
- *Lens:* 24mm tilt-shift with verticals corrected.

### Global grade: "Operatory"

Warm highlights (about 3200K practical light), neutral midtones, shadows lifted to Occlusion `#0D0C0B` rather than crushed to black, fine 35mm grain, slight halation on practical lights. **No teal-and-orange.**

### Film and motion footage

- **Inner-page hero loops** (optional): 8–12 seconds, locked-off camera, **one movement only** (a lamp switching on, a wire being cut, an elastic stretched over a tie wing). Muted, seamless loop.
- **Case films:** 60–90-second documentary portraits of client doctors. Interview at eye level, B-roll from series 1–4.

### Illustration and data: the cephalometric language

Data never appears as stock charts. It's drawn as **cephalometric tracing**:
- Landmarks are 6px dots in Ortho Blue on light grounds or Signal on dark.
- Leader lines are 1px and angle into a horizontal label.
- Angles are dashed arcs with the measurement in mono.
- *Market cephalometrics:* the classic ceph landmarks S–N–A–B are recast as the patient funnel: **S**earch → **N**otice → **A**ppointment → **B**egin treatment. The angle between A and B is conversion.

### The radiograph treatment

A radiograph layer shows "what's underneath": data, structure, measurement. Metal is radiopaque so it glows; elastics are radiolucent so they disappear. It's revealed by a scanner band that follows the cursor and sweeps on its own when idle. Annotations use the Radiograph color only.

---

## 10. Lighting

**In photography,** every frame has one motivated key light, coming from the upper left by default. Shadows fall toward the lower right.

**On the site itself,** the light has to be consistent with the photography:

- **Operatory light.** In dark heroes, a cool radial light (a white core with a Signal halo, at most 16% opacity) follows the cursor with heavy damping (lerp 0.06 per frame). On touch devices it drifts on its own along a slow path that takes 25–35 seconds per cycle.
- **Power-on.** The cold open starts black. The light comes up over 1.4 seconds with a short dip, like an operatory lamp warming up.
- **Light direction.** Every gradient, vignette and plate originates from the upper left, so photography and UI read as one lit space.
- **No drop shadows on UI.** Elevation comes from light and surface tone. The only soft shadows are on photographic plates and the before/after frame.

---

## 11. Texture & material

| Material | On the site | Spec |
|---|---|---|
| **Film grain** | Full-screen overlay | SVG fractal noise at 5.5% opacity, jittered in 6 steps (~7fps). Static when reduced motion is on. |
| **Enamel** | Light scenes | Warm porcelain, never `#FFF`. Ivory tones layered to suggest translucency. |
| **Steel** | Lines and illustrations | 1px Nitinol hairlines. Brushed-metal gradients only inside illustrated plates. |
| **Elastic** | The accent | The one saturated material: Ortho Blue, the elastic color the brand chose. |
| **Radiograph** | X-ray views | Luminous blue-gray on blue-black, with a soft glow. |
| **Paper** (print) | Proposals, leave-behinds | Uncoated warm white stock, mono captions, display headlines. |

**Not used:** glassmorphism, neumorphism, gradient meshes, blobs, noise-heavy gradients. The brand's materials are real orthodontic ones.

---

## 12. Depth & atmosphere

### The z-plane model

| Plane | Contents | Behavior |
|---|---|---|
| **0 · Lens** | Grain, midline, HUD, nav | Fixed; scene-aware color (difference blend) |
| **1 · Subject** | Display type, CTAs | Moves with scroll; owns the alignment reveals |
| **2 · Set** | Plates, photography, mockups | May drift up to 10% against plane 1 |
| **3 · Atmosphere** | Light, haze, vignette | Responds to cursor and time, never to scroll |

### Rules

- **Parallax stays at or below 10% differential**, between planes 1 and 2 only, and never on body text.
- **Haze:** dark scenes carry a wide, low-opacity radial glow so they never read as flat black.
- **Vignette:** photographic plates fall off radially to about 80% black at the corners.
- **Depth of field:** when an overlay is open (menu, video), the scene behind blurs 4–6px instead of getting a flat scrim.

---

## 13. Motion language

> **Engineering spec:** [MOTION-SYSTEM.md](../experience/MOTION-SYSTEM.md) turns this language into tokens, a kernel (`site/motion.js`), tiers and budgets. The live reference is `site/motion.html`.

### Principles

1. **Light, continuous force.** Motion is slow, steady and inevitable. Long ease-outs, no bounce. The single exception is debond, the one celebratory overshoot on the whole site.
2. **Everything aligns.** The reveal is never a generic fade-up. Elements arrive **crowded** (rotated 1.4–2.2°, offset about 14px/18px) and **settle into alignment**.
3. **Shape memory.** Like a NiTi wire returning to its programmed shape, every hover state releases back to rest along the same curve.
4. **Scroll is treatment time.** Scroll-scrubbed sequences progress only with the user's scroll. Nothing autoplays away from them.
5. **One idea per moment.** Never more than one signature motion on screen at once.

### Tokens

| Token | Value | Use |
|---|---|---|
| `--ease-force` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals and settles, the default curve |
| `--ease-settle` | `cubic-bezier(0.65, 0, 0.35, 1)` | Repositioning, scrubbed sequences |
| `--ease-release` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Exits only |
| *debond spring* | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Finale brackets only |
| `--d-instant` | 120ms | Press, toggle |
| `--d-quick` | 240ms | Hover, focus |
| `--d-measured` | 600ms | Menus, UI state, opacity |
| `--d-force` | 1400ms | Alignment reveals |
| `--d-treatment` | 2400ms | Cold open, signature moments |
| `--stagger` | 55ms (blocks) / 18ms (glyphs) | Sequencing |

### Signature moments

| Moment | Trigger | Choreography |
|---|---|---|
| **Cold open** | Page load | 0ms black → 200ms light powers on (1.4s) → 350ms each glyph moves from crowded (±8° rotation, ±0.07em offset) into alignment over 2.4s with an 18ms stagger, while the archwire relaxes from a damped wave to a straight line over 2.6s. The text is readable from the first frame. |
| **Crowding** | Scroll-scrub across 300vh | 0–10% the claims sit crowded. 10–60% they spread to the periphery, rotation goes to 0° and opacity to 20%. 16–40% the act header lifts away. 48–76% "We create space." aligns into the empty center. |
| **Treatment rail** | Scroll position | Sticky numerals cross-fade with rotation as each phase crosses the viewport center. Brackets engage (fill with Signal). The wire fills continuously with scroll. |
| **Radiograph** | Cursor / idle | A scanner band (±14% wide) follows the cursor with 0.08 damping and sweeps slowly (about a 16-second cycle) when idle. |
| **Before / after** | Drag, keyboard, or first view | The first time it's seen, a demo sweep (50 → 30 → 64 → 50%, 900ms per segment) that cancels on any interaction. The divider is the archwire with a bracket handle. |
| **On air** | Ambient | The only pulsing element on the site: a 2.6s glow cycle. |
| **Debond** | Scroll | The wire draws along the arch as its center travels from 115% to 55% of the viewport. Each of the fourteen brackets snaps from crooked (±25°, scale 0.4) to aligned on the debond spring as the wire reaches it. |
| **Treatment day** | Scroll | The counter goes 001 → 540 and its progress hairline scales in step. |
| **Navigation** | Scroll direction | Steps aside going down, returns going up. Color follows the scene underneath. |
| **Page transition** | Route change | *Midline wipe:* the midline hairline expands into a full-width Occlusion panel (600ms settle). The next page's name holds in mono at center, then the panel parts from the midline outward (900ms force). |

### Micro-interactions

- **Buttons:** the wire after the label lengthens from 1.75 to 3rem with a bracket square riding at its end. Pressing nudges the button down 1px.
- **Text links:** the underline offset increases (0.35 → 0.6em) and the underline turns the brand blue, as if it were under tension.
- **Nav links:** a wire draws in left to right and retracts to the right.
- **Episode rows:** a wire draws across the row over 1.4s and the play bracket fills with Ortho Blue.
- **Focus:** a 2px outline (Signal on dark, Ortho Blue on light) with a 4px offset. Always visible on keyboard focus.

### Sound (optional, off by default)

If enabled from a corner toggle: a low room tone in dark scenes, a soft metallic *tick* when a bracket engages, and a single warm chord at debond. Never autoplayed, and the preference persists.

### Reduced motion

With `prefers-reduced-motion: reduce` on, the story stays and the movement goes. Text starts aligned, the wire starts straight, the crowding sequence becomes a static two-part layout, the arch is drawn in full, reveals become instant, and grain and waveforms are static.

### Performance rules

Animate `transform` and `opacity` only. One `requestAnimationFrame` loop drives everything, and scroll work runs only when the scroll position has changed. Off-screen effects are gated with IntersectionObserver. Target 60fps on a mid-range 2022 phone.

---

## 14. Voice & copy

**Voice:** the calm authority of a clinician who reads poetry.

### Rules

- Short declaratives. Rhythm over adjectives.
- **No exclamation points.** Ever.
- American English: *practice* (noun and verb), *color*, *millimeter*.
- Use clinical terms precisely, or don't use them.
- **One metaphor per screen, at most.**
- Numbers over adjectives: "212% more consultation requests," never "massive growth".
- **Banned words:** cutting-edge, state-of-the-art, game-changer, unlock, skyrocket, supercharge, synergy, best-in-class, solutions, "smile" puns.

### Glossary: clinical term → what it means here

| Term | Meaning in our marketing | Example |
|---|---|---|
| **Records** | Discovery and audit | "Before we move anything, we measure everything." |
| **Crowding** | A saturated, look-alike market | "Your market is crowded." |
| **Space** | Unoccupied positioning | "We don't push harder. We create space." |
| **Alignment** | Brand, website and message working as one system | Phase 02 |
| **Archwire** | The strategy that carries every tactic | Divider, underline, rail |
| **Light, continuous force** | Steady, compounding, measured marketing | Phase 03, the core idea |
| **Retention** | Reviews, reputation, referrals, reactivation | "The work doesn't end at debond." |
| **Debond** | Launch; the reveal of the result | Finale |
| **Cephalometrics** | Competitive and funnel analysis | "Market cephalometrics" |
| **Midline** | The central axis: what the practice stands for | Composition |

### Headline bank

- We move markets the way you move teeth.
- Your market is crowded. *We create space.*
- Before we move anything, we measure everything.
- Steady pressure. *Never a burst.*
- The work doesn't end at debond.
- Same practice. *Different market.*
- A family practice, *for family practices.*
- We light a bracket the way others light *a watch.*
- Your best new patient is already searching. *Be where they look.*
- Let's see where your practice *could be.*

### CTA language

| Context | Use | Never |
|---|---|---|
| Primary | **Begin your consultation** | Get started, Submit |
| Navigation | **Book a consultation** / **Consult** (mobile) | Contact us |
| Proof | **See the results** | Learn more |
| Soft | **Or listen first** (to the podcast) | Subscribe now |

### Microcopy

- **404:** "This page has drifted. Without retention, everything does." → *Back to the homepage*
- **Form success:** "Records received. A strategist will review your market before your consultation, so the first conversation is already useful."
- **Form error:** "We need a working email to send your treatment plan."
- **Loading:** `Calibrating…` (mono, used sparingly)

---

## 15. Site architecture & page blueprints

### Sitemap

```
/                         Home: the film (prototype)
/treatment                Treatment plan overview
  /treatment/records      Phase 01: strategy, audit, positioning
  /treatment/alignment    Phase 02: identity, websites, photography & film
  /treatment/force        Phase 03: local SEO, paid search, paid social, content
  /treatment/retention    Phase 04: reviews, social, referring doctors, reactivation
/results                  Case index ("patient files")
  /results/[case]         Case file template
/studio                   The family, the team, since 2008
/live                     Ortho Marketing Live (podcast index)
  /live/[episode]         Episode template
/journal                  Editorial insights
  /journal/[article]
/consultation             The records appointment (multi-step form)
/404, /privacy, /terms, /accessibility
```

### Page blueprints

**Home** — see the prototype and [§4](#4-visual-storytelling-the-site-as-a-film).

**Treatment / [phase]**
1. *Hero:* a giant phase numeral (e.g. "03") on the left, the headline on the right, and the clinical parallel in mono beneath.
2. *What it is:* lede plus three or four deliverables as numbered spec rows.
3. *How it moves:* a horizontal timeline drawn as a wire with brackets at the milestones (Week 1, Month 1, Month 3…).
4. *Proof:* one related case with a before/after and a single metric.
5. *FAQ:* answers written by a strategist, in clinical shorthand where it helps.
6. *Next phase →:* the wire continues to the next phase page.
*Signature moment:* the numeral aligns on arrival. *CTA:* Begin your consultation.

**Results (index)**
- The grid is laid out as **patient files**: each card is a plate showing the practice's site before and after (hovering scrubs between them), the practice type and region in mono, and one headline metric.
- Filters by challenge: *Start-up practice · Growth · Multi-location · Rebrand · Recovery*.
- Card reveals align in a stagger, like teeth seating into an arch.

**Results / [case]: the case file**
1. *Records:* the situation, with market cephalometrics (tracing-style funnel data).
2. *Diagnosis:* the insight in one sentence, set large.
3. *Treatment plan:* the phases engaged, using the same rail as Home.
4. *Before / After:* full-bleed slider, then the identity system and photography.
5. *Results:* three to five ceph-annotated metrics with time periods and sources.
6. *The doctor's words:* a short documentary film plus a pull quote (italic display, mono attribution with practice and city).
7. *Retention:* what's ongoing now.
8. *Next case →*

**Studio**
- *Cold open:* a portrait of the family or leadership (Plate 07 lighting).
- *Since 2008:* a horizontal timeline along a wire, with each milestone as a bracket.
- *The care team:* portrait grid, every person lit identically, with name, role and years in orthodontic marketing in mono.
- *How we work:* the four creative principles, written for clients.

**Live (index and episode)**
- *Index:* on-air header, latest episode with a waveform player (the played portion in Signal), then the episode list.
- *Episode:* guest portrait lit studio-style, chapter markers on the waveform, full transcript (good for SEO and accessibility), related episodes.

**Journal**
- Editorial layout with a display headline, a 38–42ch measure for long reads, pull quotes in italic display, and diagrams in the cephalometric style.

**Consultation: the records appointment**
- **Four steps shown as four brackets on a wire:**
  1. *Your practice:* name, website, number of locations, city.
  2. *Your goals:* more new-patient starts, a rebrand, a new location, adult treatment, recovery.
  3. *Your current marketing:* agency, channels, monthly budget range.
  4. *Your consultation:* name, email, phone, preferred times.
- Every completed step engages a bracket. Submitting runs a small debond on the arch.
- Confirmation: "Records received…" with a calendar booking embed.

---

## 16. Component system

| Component | Anatomy | Notes |
|---|---|---|
| **Nav** | Arch logomark + wordmark · 4 links · primary CTA | Transparent and scene-aware. Hides going down. Full-screen menu under 1024px. |
| **Primary button** | Label + wire + bracket square | Ortho Blue with white text (7.41:1). 1px Signal edge on dark. Hover: white with blue text on dark, Ortho Blue Deep on light. Radius 2px. Sizes sm/md/lg. |
| **Text link** | Underline at 1px | Tension hover (offset plus brand blue). |
| **Act label (eyebrow)** | `ACT II` in Signal (Ortho Blue on light) + 40px wire + label in Nitinol | Opens every major section. |
| **Plate** | Image or illustration container + mono caption (plate number, technical credits) | Every image carries its own "film slate". The radiograph variant is optional. |
| **Phase** | Mono label · d2 headline · lede · spec grid (Deliverables / Clinical parallel / Timeline) | Used on Home and the Treatment pages. |
| **Metric** | Ceph leader line + landmark dot · display number · mono caption | Always states the time period and source. |
| **Compare slider** | Browser chrome · two layers · archwire divider with bracket handle · range input | Keyboard accessible, with aria-valuetext. |
| **Episode row** | Number · title (d3) · guest (mono) · play bracket | The wire draws across on hover. |
| **Quote** | Italic display quote · mono attribution · optional small portrait plate | Real names and practices only. |
| **Form field** | Mono label above · underline input · underline thickens on focus · inline error | In the consultation overlay: white on Ortho Blue, errors in `#FFD7D0`. Full spec in the Blueprint §5. |
| **HUD** | `TREATMENT DAY 001 / 540` + progress hairline | Fixed, with difference blend. |
| **Credits footer** | Billing-block layout (Starring, Treatment, Filmed on location, Running time) + nav + legal | Ends every page. |

---

## 17. Responsive behavior

| Element | Desktop | Mobile (≤760px) |
|---|---|---|
| Hero | 3-line display headline at about 9vw, CTA row on the right | Display at 40–48px, CTAs stacked, scroll cue hidden |
| Operatory light | Follows the cursor | Drifts on its own |
| Crowding | Claims move to an elliptical periphery | Claims move to four tidy rows above and below the resolve line |
| Treatment rail | Sticky numeral and wire | Rail hidden; phases stack with mono labels |
| Radiograph | Follows the cursor | Sweeps on its own; drag to control |
| Before / after | 16:9 frame | Full-bleed 4:3 frame; labels at the bottom |
| Debond arch | Behind the headline | Standalone graphic above the headline |
| HUD | `TREATMENT DAY 001 / 540` | `001 / 540` |
| Nav CTA | "Book a consultation" | "Consult" |

---

## 18. Accessibility

Target **WCAG 2.2 AA** throughout.

- **Contrast:** see the table in [§8](#8-color). Ortho Blue on dark grounds is used for fills only.
- **Motion:** the full `prefers-reduced-motion` alternative in [§13](#13-motion-language). No flashing, and nothing that pulses faster than once every 2.6s.
- **Split-text headlines:** the heading gets an `aria-label` with the full sentence, and the glyph spans are `aria-hidden`.
- **Compare slider:** a native range input that's keyboard operable, with `aria-valuetext` ("62% redesigned website visible") and a visible focus ring on the frame.
- **Decorative SVG** is `aria-hidden`. Meaningful plates get a `role="img"` and a descriptive label.
- **Structure:** a skip link, one H1 per page, sequential headings, and landmark regions.
- **Media:** captions on all video, transcripts for every podcast episode.
- **Targets:** at least 44 × 44px. Focus is never hidden.

---

## 19. Technical translation

### Recommended stack

- **Framework:** Astro, or Next.js App Router. Content renders statically to HTML and motion is layered on top as progressive enhancement.
- **CMS:** Sanity, with structured content for cases, episodes, people and phases.
- **Motion:** GSAP with ScrollTrigger for production choreography. The prototype's vanilla rAF loop maps one to one onto ScrollTrigger timelines. Lenis smooth scroll is optional and must respect reduced motion.
- **No WebGL needed.** A later upgrade could add an OGL shader for the radiograph (real refraction and bloom) without changing the system.

### Performance budget

| Metric | Budget |
|---|---|
| LCP | under 1.8s on 4G (the hero is text, not video) |
| CLS | under 0.05 |
| INP | under 150ms |
| JS (home) | 90KB gzipped or less |
| Fonts | 3 families, subset, 160KB woff2 total or less; preload the display face |
| Hero loops | 2.5MB or less, AV1 with an H.264 fallback, poster frame first |

### Asset specs

- **Photography:** 6000px masters exported to AVIF/WebP at 640, 960, 1440, 1920 and 2560w. Art-directed crops for mobile.
- **Video:** 4K masters. Web delivery at 1080p, muted, `playsinline`, lazy-loaded below the fold.
- **Diagrams and data:** inline SVG using design tokens, so they're theme-safe.

### Content model (core types)

`Case` (practice, region, challenge, phases[], before/after, metrics[] {value, label, period, source}, quote, film) · `Phase` · `Episode` (number, title, guests[], audio, transcript, chapters[]) · `Person` · `Article`

### Analytics events

`consultation_start` · `consultation_step_{1-4}` · `consultation_submit` · `compare_interact` · `radiograph_interact` · `episode_play` · `cta_click {location}` · `scroll_act_{n}`

### SEO

Each phase gets an indexable landing page. Every case is a crawlable page. Episode transcripts are on the page. Schema: `Organization`, `Service`, `PodcastSeries`, `PodcastEpisode`, `Article`. The cinematic layer never hides content from crawlers: all copy is in the HTML before any script runs.

### How the prototype implements each signature effect

The section-by-section map from blueprint to code is in [Website Experience Blueprint §9.4](../experience/WEBSITE-BLUEPRINT.md#94-prototype--production-map).

---|---|
| Crowded-glyph split and alignment | `main.js` §1, `styles.css` "COLD OPEN" |
| Archwire wave-to-line | `main.js` §1 (`wireD`, `animateWire`) |
| Operatory light | `main.js` LOOP; `.hero__light` |
| Crowding scrub | `main.js` §2 |
| Treatment rail | `main.js` §3 |
| Radiograph scanner | `main.js` §4; `.macro--xray` clip-path |
| Before / after | `main.js` §5 |
| Debond arch | `main.js` §7 |
| Alignment reveals | `main.js` §8; `[data-align]` |
| HUD and scene-aware nav | `main.js` §9 |

---

## 20. Production plan (12 weeks)

| Weeks | Phase | Output |
|---|---|---|
| 1–2 | **Records** | Fact verification ([§21](#21-verification-before-launch)), real case data collected, copy finalized, font licenses bought |
| 2–4 | **Shoot** | Photography and film (shot list below) |
| 3–7 | **Design** | Figma system built from `tokens.json`; all templates; motion prototypes for every signature moment |
| 6–11 | **Build** | Front end, CMS, content entry, analytics |
| 11–12 | **Retention** | QA, accessibility audit, performance tuning, launch, 30-day optimization |

### Shot list

| Plate | Subject | Series | Setup |
|---|---|---|---|
| 01 | Hero still life: archwire, single bracket, elastic | Instruments | 100mm macro, strip light camera left, black velvet |
| 02 | President portrait | Clinicians | North window, 7–8 a.m., 85mm f/1.8, negative fill |
| 03 | Strategist at work, screen glow as the key light | Clinicians | Practical light, 50mm, wide aperture |
| 04 | Twin bracket macro (as in prototype) | Instruments | Focus-stacked, f/11 |
| 05 | Clear aligner tray, caustic light | Instruments | Backlit glass table, 100mm |
| 06 | Client practice operatory at first light | Rooms | 24mm tilt-shift, one-point perspective |
| 07 | Family / leadership group | Clinicians | Single large softbox, 8:1 ratio, dark set |
| 08 | Podcast studio, on-air lamp | Rooms | Practical lights only, 35mm |
| 09–12 | Patient "after" moments (with releases) | The After | Documentary, 35mm, available light |

---

## 21. Verification before launch

The concept uses facts from public sources (directory listings and podcast descriptions). **Check each one with the agency before anything is published:**

- [ ] Founded in **2008**, **family-run**.
- [ ] **Dean Steinman**, President, **25+ years** in orthodontic and dental marketing.
- [ ] Specialism: **orthodontic practices**. If the agency also serves general dentists, keep the orthodontic-first positioning and add a secondary route.
- [ ] Podcast **episode numbers, titles and guests** (Ep. 172 virtual assistants / MyOrthoVA; Ep. 168 reactivations / Blair Feldman, Retainer Club; Ep. 79 website security; site speed and rankings).
- [ ] The **"98% of clients ranked #1 on Google"** claim that appears in a podcast description. Substantiate it with data and a defined methodology, or don't use it.
- [ ] The **"#1 orthodontic marketing agency"** self-description. Use it only with substantiation.
- [ ] **All prototype metrics are illustrative** (+212%, 9/11, −38%). Replace them with verified client results, each with a time period and source.
- [ ] **"Alder Lane Orthodontics" and "SmileCare Orthodontics" are fictional** mockups. Replace them with real client work, with permission.
- [ ] **Patient imagery:** signed photo releases and confidentiality-compliant consent.
- [ ] **Trademarks:** use third-party aligner brand names only within their brand guidelines.
- [ ] **Font licenses:** GT Sectra Display, Söhne, Söhne Mono (web plus app if needed).
