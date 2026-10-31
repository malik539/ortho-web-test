# The Hero — "Shape Memory"

**Version 1.0 · October 2026**
Supersedes the hero card in [Website Blueprint §01](./WEBSITE-BLUEPRINT.md#01--cold-open-hero). Built in the prototype: [`/site/index.html`](../site/index.html) (`#top`) · [`main.js`](../site/main.js) §2 and §2b · [`styles.css`](../site/styles.css) "01 · HERO".

---

## 1. The idea in one sentence

**An archwire of light enters crowded and bent out of shape, then remembers its ideal form and springs into a perfect arch, cradling the message the way the crescent cradles the "O" in the Ortho Marketing logo.**

Nickel-titanium archwires really do have *shape memory*: warmed to mouth temperature, they return to their programmed arch form and deliver the light, continuous force that moves teeth. Every orthodontist knows this. It's also exactly what Ortho Marketing promises a practice: steady force that brings everything back into alignment. The hero doesn't illustrate that promise. It performs it.

---

## 2. Why this concept

### How it answers the brief

| Requirement | How the hero delivers it |
|---|---|
| **Communicates value instantly** | The kicker names the category ("The marketing studio for orthodontic practices"). The headline names the method. The subheadline names the services, the client, and the outcome in their own metric ("new-patient starts"). |
| **Powerful emotional impression** | A clinician sees their own craft (an arch, brackets, a wire finding its form) rendered as something precious and cinematic. Recognition, then pride, then trust. |
| **Distinctive, not a generic layout** | No stock photo, no dashboard, no glowing blob. The object exists only in this category. The arch is a real 3D object in perspective, framing the copy. |
| **No decoration without purpose** | Each effect carries meaning. The crowded entrance is the problem, shape memory is the method, cursor pressure is resilience, the CTA pulse shows that the movement starts here, and the scroll crane gives the clinician's top-down view. |
| **Loads quickly** | No images or video. The LCP element is the H1 text. The arch is about 5KB of Canvas 2D and stops rendering when at rest. |
| **Encourages action** | One primary CTA, centered, inside the first screen at every tested size, with reassurance right under it. Hovering it visibly "charges" the arch. |

### The five-second read

| Time | What the visitor takes in |
|---|---|
| **1s** | A dark, cinematic stage. A glowing arch with brackets, so this is orthodontics, and it's premium. |
| **3s** | "We move markets the way you move *teeth.*" They get the metaphor and feel spoken to as a clinician. |
| **5s** | Marketing studio for orthodontic practices, since 2008: brands, websites, search, more new-patient starts. *Begin your consultation.* |

### Why the arch sits low

- **It matches the logo.** The logo's O is a blue sphere with a white crescent across its lower half. The hero is that composition at screen scale: a dark field with a luminous arc in its lower half. The brand mark becomes the room you stand in.
- **It's a smile.** The arch cradles the message the way a smile line frames a face. Orthodontists call this curve the *smile arc*.
- **It's the opening image.** It rhymes with the closing image (the Debond finale, where a flat arch completes behind the final CTA). Film language: the first and last frames echo each other.

### Alternatives considered and rejected

| Option | Why not |
|---|---|
| Video or photo of a smiling patient | The category cliché. It hurts LCP and says nothing about marketing. |
| The logo's Orb as a giant glowing 3D sphere | On-brand, but it reads as the generic "AI-startup orb." The Orb is kept for the loader and the consultation flood, where it means something. |
| Dashboard or growth chart | Generic SaaS. It shows charts before it has earned trust. |
| Photoreal 3D teeth | Anatomy is clinical and uncanny. Brackets and wire are jewelry. |
| **The previous hero** (type only, left-aligned) | Strong type, but no object to remember. The right half was empty, and the value proposition lived in a small paragraph. |

---

## 3. Composition

**Symmetry on the midline.** This updates the Creative Direction rule: true symmetry is now reserved for the **opening and closing images** (hero and Debond), the film's bookends. Everything between them stays asymmetric.

```
┌──────────────────────────────────────────────────────────────┐
│ ●rtho Marketing     Treatment Results Studio Live First visit [Book] │  nav (plane 0)
│                                                              │
│          EST. 2008 ── THE MARKETING STUDIO FOR ORTHO…         │  kicker
│                                                              │
│                  We move markets                             │  H1, 2 lines
│ │            the way you move teeth.                    │    │
│ │                                                      │    │  ← the arch's arms rise beside
│ │     We build the brands, websites and search…        │    │    the headline, outside its measure
│  \                                                    /     │
│   ╲          [ Begin your consultation ⟶ ]  See the results ╱ │  CTA
│    ╲▪          30-MINUTE STRATEGY CALL · PLAN IS YOURS      ▪╱ │  assurance
│      ╲▪▪                                              ▪▪╱    │
│          ‾‾‾▪▪‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾▪▪‾‾‾          │  apex: the smile, about 88% height
│                      ·· floor reflection ··                   │
└──────────────────────────────────────────────────────────────┘
```

### Layers (back to front)

| Plane | Contents |
|---|---|
| 3 · Atmosphere | Overhead operatory lamp, cursor key light, Ortho Blue floor bounce (CSS gradients) |
| 2 · Set | The arch (canvas): reflection, brackets in depth order, then the wire seated in the slots |
| 1 · Subject | Kicker, H1, subheadline, CTA, assurance (HTML, in flow) |
| 0 · Lens | Nav, midline, grain (fixed) |

### Desktop reference (1440 × 900)

| Element | Vertical position | Width |
|---|---|---|
| Nav | 0–88px | full |
| Kicker | about 160px | auto, centered |
| H1 (2 lines, about 104px) | about 205–400px | about 820px, centered |
| Subheadline | about 435–530px | 44ch |
| CTA row | about 580–640px | auto |
| Assurance | about 672px | auto |
| Arch apex (front brackets) | about 790px (88%) | — |
| Arch arms | rise to about 330px at x ≈ ±0.44W | beside the H1, never under it |

### The composition solver

The camera isn't hand-placed for each breakpoint. It's solved at every resize from the live layout:

- **Landscape:** the arms rise beside the copy (the cradle). The apex sits at 88–90% of the height, and always at least 7% of the viewport below the bottom of the copy. On short laptops the apex drops toward the bottom edge, and a height media query tightens the type.
- **Portrait:** the copy spans the width, so the solver picks the **steepest camera angle (46° down to 14°) whose whole arch sits below the copy**. The result is a smile beneath the CTA.
- **Fit:** the widest projected point of the arch is fitted to 44–46% of the width each side of center, so it never clips.

| Breakpoint | Result |
|---|---|
| Wide 1920×1080 | Full cradle. The arms frame the headline. |
| Desktop 1440×900 | Full cradle (the reference composition) |
| Short laptop 1280×720 | Cradle. The type tightens to 11.2vh and the apex drops to clear the assurance line. |
| Tablet landscape 1180×820 | Cradle |
| Tablet portrait 834×1112 | A deep U beneath the CTA (steep occlusal view) |
| Phone 390×844 | A wide smile beneath the CTA. Three-line H1, full-width CTA. |
| Small phone 320×640 | H1 at 2.3rem. The CTA stays above the fold; the arch sits just below it and appears on the first scroll. |

---

## 4. Copy

| Element | Final copy | Why |
|---|---|---|
| **Kicker** | `EST. 2008 ── THE MARKETING STUDIO FOR ORTHODONTIC PRACTICES` | Category clarity on the first line read: who it's for and what it is. The year signals longevity. |
| **H1** | **We move markets / the way you move *teeth.*** | The idea, in their language. The italic lands on the emotional word. Two lines on desktop, three on phones (the line breaks at "teeth."). |
| **Subheadline** | We build the brands, websites and search presence that bring orthodontic practices more new-patient starts — steadily, measurably, month after month. | What (three services), for whom, the outcome in *their* KPI, and the method (light, continuous force, translated into plain words). |
| **Primary CTA** | **Begin your consultation** | The site's single primary action, phrased as the first step of treatment rather than a sale. |
| **Secondary** | See the results | For warm visitors who want proof first. Goes to Before / After. |
| **Assurance** | `30-MINUTE STRATEGY CALL · YOUR PLAN IS YOURS TO KEEP` | Reduces risk right where the visitor decides. [verify policy] |

### A/B test candidates (change one thing at a time)

| Test | Control | Variant | Hypothesis |
|---|---|---|---|
| H1 | We move markets the way you move teeth. | Your practice, in perfect alignment. | The metaphor beats a plainer promise among orthodontists. |
| Subheadline | …more new-patient starts… | …more new-patient starts, without discounting your care. | Naming the fear of a race to the bottom raises CTR. |
| CTA | Begin your consultation | Book your records appointment | Insider language versus a familiar phrase |
| Assurance | 30-minute strategy call · Your plan is yours to keep | + "Family-run since 2008" | A trust cue near the CTA lifts clicks. |

Primary metric: `cta_click{hero}` → `consultation_submit`. Guardrail: scroll past the hero.

---

## 5. Typography

| Element | Face (production / prototype) | Size | Leading / tracking | Color · contrast |
|---|---|---|---|---|
| Kicker | Söhne Mono / IBM Plex Mono, uppercase | 12px | 1.5 / +0.09em | "Est. 2008" in Signal (5.66:1) · rest in Nitinol (8.21:1) |
| H1 | GT Sectra Display Light + Italic / Fraunces | `clamp(2.5rem, 0.6rem + 6.6vw, 8.5rem)`, about 104px at 1440 · `min(…, 11.2vh)` on short screens · 2.3rem at 320px or less | 0.94 / −0.032em | Porcelain (17.5:1) |
| Subheadline | Söhne / Hanken Grotesk | 18–24px fluid | 1.45 · max 44ch · balanced | Nitinol (8.21:1) |
| CTA | Söhne Kräftig / Hanken 600 | 16px | — | White on Ortho Blue (7.41:1) |
| Assurance | Mono, uppercase | 12px | +0.09em | Nitinol Dim (5.57:1) |

The headline is real text from the first frame. Its glyphs arrive slightly crowded (±8°, ±0.07em) and align in the same center-outward wave as the arch.

---

## 6. The 3D element: the arch

| Aspect | Spec |
|---|---|
| **Arch form** | Ovoid, a Catmull-Rom curve through 11 mirrored control points. Proportions follow a real upper arch (about 53mm intermolar width, about 47mm depth). |
| **Brackets** | 14, placed by real tooth widths from the midline out: 8.5 · 6.5 · 7.5 · 7.0 · 6.5 · 10.0 · 9.0mm. Each bracket is about 32% of its tooth's width. **Twin construction:** a base pad plus four tie-wings around a horizontal archwire slot and a vertical channel. |
| **Wire** | 220 samples. It passes through every slot; a Gaussian displacement field (σ ≈ half a tooth) bends it through crowded brackets, so the kinks are physically plausible. |
| **Crowded state** | Seeded and repeatable. Anterior teeth are worst: in/out displacement, vertical step, up to ±35° rotation and ±15° tip. Posterior teeth get 55% of that. |
| **Shape memory** | Anterior first. Each tooth rank starts 130ms after the previous one and settles over 1.7s (force easing). A white "heat front" travels along the wire from the midline to the molars as it remembers. |
| **Wire material** | A light filament: an additive Signal glow pass plus a core that shifts from Signal to white wherever the key light falls on it |
| **Bracket material** | Cool steel, tinted toward the brand blue. The upper wings catch the overhead lamp; a bright top edge shows specular light; back-facing pads go dark. |
| **Camera** | Long lens (orbit distance 17) for a jewelry-like, low-distortion look. Pitch 21° on desktop, up to 46° on portrait (solved). Parallax up to ±2.9° yaw and ±1.3° pitch. |
| **Depth cues** | True perspective; atmospheric fade with depth (opacity 1 → 0.5); far brackets blurred up to 1.4px; a 12% reflection on a black glass floor; far-to-near drawing order |
| **Technology** | Canvas 2D with no libraries, about 5KB gzipped. Device pixel ratio capped at 2. **Renders on demand:** it stops when the arch is at rest or off-screen (verified at 0 redraws over 2s idle). |
| **Optional upgrade** | WebGL (OGL, about 25KB) with physically based steel and a studio HDRI, loaded after idle on capable desktops only. The Canvas version stays the default and fallback. Only ship the upgrade if a test shows it lifts engagement. |

---

## 7. Lighting

| Light | Spec | Purpose |
|---|---|---|
| **Overhead operatory lamp** | A cool white radial at top center (14%) | Motivated light: the room is an operatory |
| **Key light = the cursor** | A damped follow (lerp 0.06) on desktop; drifts on its own over about 30s on touch. It drives **both** the CSS glow and the arch's specular highlights. | One light, consistent in 2D and 3D, so the object feels physical |
| **Floor bounce** | Ortho Blue radial beneath the apex (26%) | The brand color as light, not paint |
| **Power-on** | 1.4s with a short dip, like an operatory lamp warming up | The cold open |

No lens flares, no rim lights, no gradient blobs.

---

## 8. Entrance choreography

**First visit:** the loader runs (about 2.0s) and the Orb lands in the nav logo. That moment is **t0**. On return visits, t0 is the first frame.

| Time | Event |
|---|---|
| t0 | The lamp powers on (1.4s). The crowded arch is already drawn underneath. |
| t0 + 150ms | The kicker aligns in |
| t0 + 430ms | **Shape memory begins:** centrals first, then a new tooth rank every 130ms, each settling over 1.7s. The heat front travels the wire (2.3s). |
| t0 + 410 → 1170ms | H1 glyphs align in the same center-outward wave (delay set by distance from the midline, 2.4s each) |
| t0 + 800ms | Subheadline aligns in |
| t0 + 1000ms | CTA row aligns in |
| t0 + 1200ms | Assurance line aligns in |
| about t0 + 2.9s | The arch is at rest and rendering stops |

**Rules.** The copy is readable from the first frame. The CTA is clickable as soon as it's visible. Only one motion idea plays: a single alignment wave across both the type and the object.

**Reduced motion:** the final frame, static, with no parallax, no pointer force and no crane.

---

## 9. Hover and pointer interactions

| Target | Behavior | Purpose |
|---|---|---|
| Anywhere in the hero | The operatory light follows the cursor; highlights travel along the wire and brackets | The object feels lit and physical |
| Within 150px of a bracket | Brackets **yield**: pushed back up to 0.26 units and rotated up to 18°, then spring back (stiffness 0.085, damping 0.8) | Shape memory you can feel. Disturb the arch and it returns. No instructions needed. |
| Pointer position | Camera parallax (±2.9° yaw, ±1.3° pitch) | Reveals true depth |
| **Primary CTA, hover or keyboard focus** | **Charges the arch:** a pulse of light runs from the midline to both molars (1s) and the wire brightens about 50% while you stay on the button | Ties intent to the object: the movement starts with this button |
| Primary CTA | The button wire lengthens from 1.75 to 3rem; hover turns it white with blue text; press nudges it down 1px | Clear affordance |
| Secondary link | The underline tensions (offset 0.35 → 0.6em) | Quieter than the primary |
| Touch devices | Nothing depends on hover. The light drifts. Tapping the CTA opens the consultation. | Parity without hover |

---

## 10. Scroll behavior

- **No pinning and no scroll-jacking.** The hero scrolls at native speed.
- **Crane shot:** over the hero's height, the camera rises up and over the arch (pitch +36°, pulling back 2.2 units, eased). The cradle turns into an **occlusal (top-down) view**, the way an orthodontist reads an arch form.
- **The copy lifts away:** it moves up 70px and fades out between 15% and 70% of the scroll through the hero.
- The nav slides away on the way down and returns on the way up. The treatment-day HUD appears after 35% of a viewport ("treatment begins").
- Hard cut to Act I (light scene). The arch stops rendering once it's off-screen.

---

## 11. The primary CTA

| | |
|---|---|
| Label | **Begin your consultation** |
| Style | Ortho Blue `#1F2AFF`, white text (7.41:1), a 1px Signal edge on dark grounds (boundary at least 3:1), large size (about 58px tall), 2px radius, the wire-and-bracket glyph after the label |
| Placement | Centered under the subheadline, inside the first viewport at every tested size from 320×640 to 1920×1080. Full width up to 352px on phones, in the thumb zone. |
| States | Default · hover (white with blue text; charges the arch) · focus-visible (2px Signal ring plus the charge) · active (1px nudge) |
| Action | Opens the records-appointment overlay. The Orb's blue floods out from the button's center (900ms). `source=hero`. |
| Secondary path | *See the results* (anchor to Before / After) |
| Reassurance | The assurance line directly underneath |
| Analytics | `cta_click{hero}` → `consultation_open{source:hero}` |

---

## 12. Performance

| Item | Approach |
|---|---|
| LCP | The H1 text, painted on the first frame (even under the loader). No hero image or video. Display face preloaded. Budget under 1.8s. |
| JavaScript cost | Arch module about 5KB gzipped, with no dependencies |
| Runtime cost | Per frame: about 1,000 short strokes plus 14 brackets, only while something moves. **At rest: 0 redraws.** Off-screen: paused. |
| Layout | The canvas is absolutely positioned and the copy is in flow, so CLS is 0. No DOM reads in the draw loop (measurements happen only on resize). |
| Pixel ratio | Capped at 2 |
| Fallbacks | Without JS: copy plus CSS light, no arch. No canvas support: same. Reduced motion: a static final frame. |

---

## 13. Accessibility

- The H1's accessible name is the full sentence, and the glyph spans are `aria-hidden`. The canvas is `aria-hidden` because all meaning is in the copy.
- All hero text meets AA or better (see §5).
- The CTA has a visible focus ring, and keyboard focus triggers the same "charge" as hover.
- Motion: a full reduced-motion path, small parallax amplitudes, nothing flashing, and nothing pulsing in the hero.
- Every target is at least 44px. The phone CTA is full width.

---

## 14. Analytics

| Event | When |
|---|---|
| `cta_click{hero}` | Primary CTA clicked |
| `cta_click{hero-results}` | Secondary link clicked |
| `consultation_open{source:hero}` | The overlay opened from the hero |
| `scroll_act{crowding}` | The visitor scrolled past the hero |

**Hero KPIs:** primary-CTA click rate, the share of consultations that start in the hero, scroll-past rate, and bounce rate.

---

## 15. Hero QA checklist

- [ ] The first visit hands off from the Orb loader to t0 with no flash. Return visits start at t0 immediately.
- [ ] The H1 is readable in the first frame. LCP under 1.8s on a mid-range phone over 4G.
- [ ] The arch never overlaps the copy at 320, 390, 768, 834, 1024, 1180, 1280×720, 1440 or 1920px.
- [ ] Shape memory finishes in about 2.9s and the canvas then idles at 0 redraws.
- [ ] Pointer: highlights follow, brackets yield and spring back, parallax stays subtle. Touch: no hover dependencies.
- [ ] CTA hover and keyboard focus send the pulse and brighten the wire. Click opens the overlay from the button.
- [ ] The scroll crane is smooth, and rendering stops once the hero is off-screen.
- [ ] Reduced motion shows the static final frame. With no JS, the copy is fully readable.
- [ ] Contrast and target sizes pass. The canvas is hidden from assistive technology.

---

## 16. Implementation map

| Piece | Where |
|---|---|
| Markup | `index.html`, `<section class="hero" id="top">` |
| Styles | `styles.css`, "01 · HERO — SHAPE MEMORY", plus the short-screen and small-phone media queries |
| Glyph split and wave | `main.js` §2 (`split`, `waveGlyphs`, `startColdOpen`) |
| Arch renderer | `main.js` §2b `heroArch`: geometry, composition solver (`fit` and `layout`), materials (`strokeWire`, `drawBracket`), on-demand loop (`tick`) |
| Light, pointer and scroll wiring | `main.js`, "Operatory light" and `updateHeroScroll`, plus the frame loop |
| Type token | `tokens.css` `--t-hero` |
