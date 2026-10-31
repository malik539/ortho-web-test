# Ortho Marketing — Cinematic Motion System

**Version 1.0 · October 2026**
Implemented in the prototype:
- [`site/motion.js`](../site/motion.js): the motion kernel (clock, curves, tiers, tweens, scenes, reveals, navigation)
- [`site/main.js`](../site/main.js): the page's scenes
- [`site/tokens.css`](../site/tokens.css): motion tokens
- [`site/styles.css`](../site/styles.css): CSS primitives

**Live reference:** [`site/motion.html`](../site/motion.html), the Motion Lab, where every curve, duration and primitive can be replayed. **Automated checks:** [`tests/motion-check.js`](../tests/motion-check.js).

Builds on: [Creative Direction §13](../creative-direction/CREATIVE-DIRECTION.md#13-motion-language) · [Website Blueprint](./WEBSITE-BLUEPRINT.md) · [Hero spec](./HERO.md)

---

## Contents

1. [Principles](#1-principles)
2. [Tokens: curves, durations, staggers, amplitudes, smoothing](#2-tokens)
3. [Choreography and timing rules](#3-choreography-and-timing-rules)
4. [The catalogue](#4-the-catalogue)
   - [4.1 Loading sequence](#41-loading-sequence) · [4.2 Text reveals](#42-text-reveals) · [4.3 Image transitions](#43-image-transitions) · [4.4 Parallax](#44-parallax) · [4.5 Depth effects](#45-depth-effects) · [4.6 Scroll-triggered animation](#46-scroll-triggered-animation) · [4.7 Pinned sections](#47-pinned-sections) · [4.8 Hover states](#48-hover-states) · [4.9 Micro-interactions](#49-micro-interactions) · [4.10 Scene transitions](#410-scene-transitions) · [4.11 Signature moments map](#411-signature-moments-map)
5. [Implementation](#5-implementation)
6. [Performance requirements](#6-performance-requirements)
7. [Mobile alternatives](#7-mobile-alternatives)
8. [Reduced motion](#8-reduced-motion)
9. [Accessibility](#9-accessibility)
10. [Supported devices and fallbacks](#10-supported-devices-and-fallbacks)
11. [QA](#11-qa)

---

## 1. Principles

| # | Principle | In practice |
|---|---|---|
| 1 | **Light, continuous force** | Motion is slow, steady and inevitable: long ease-outs, no bounce. The single exception is the debond spring in the finale. |
| 2 | **Everything aligns** | Things arrive slightly *crowded* (offset and rotated) and settle into place. That's the brand idea, expressed as movement. |
| 3 | **One signature per viewport** | At most one hero-scale motion on screen at a time. Everything else is quiet support. |
| 4 | **Motion never blocks** | Nothing delays reading, clicking or navigating. Targets never move under the cursor. Every long sequence can be skipped. |
| 5 | **Rest is the default** | When nothing is happening, the site renders **zero frames**. Ambient loops pause when they're off-screen. |

### What we never do

Bounce or elastic easing (apart from debond) · scroll-jacking or hijacked scroll speed · horizontal scroll sections · parallax on body text · counters that spin up numbers · typewriter effects · cursor trails or custom cursors · auto-playing carousels · shaking an invalid form field · motion longer than 2.4s (other than scroll-linked motion) · animating `width`, `height`, `top` or `left` · flashing anything more than three times a second.

---

## 2. Tokens

`tokens.css` is the single source of truth. The kernel reads the same custom properties at runtime, so CSS transitions and JavaScript motion share **identical** curves and durations. An exact cubic-bezier solver means `OMMotion.ease.force(0.5)` returns `0.9718`, the same value the browser computes for `--ease-force`.

### 2.1 Curves

| Token | Value | Character | Use for | Never for |
|---|---|---|---|---|
| `--ease-force` | `cubic-bezier(0.16, 1, 0.3, 1)` | A fast start and a very long, inevitable settle | **Default.** Entrances, reveals, settles, overlays opening | Exits |
| `--ease-settle` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric | Things already on screen moving somewhere new: glides, FLIP, the cut closing, scrubbed mappings | First appearances |
| `--ease-release` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Accelerates away | Exits only | Anything arriving |
| `--ease-debond` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | A single overshoot of about 10% | **The finale brackets only.** Debond day is a celebration. | Everything else |
| `linear` | — | — | The raw mapping from scroll to progress, *before* smoothing | Any visible motion on its own |

### 2.2 Durations

| Token | Full | Lite | Reduced | Use |
|---|---|---|---|---|
| `--d-instant` | 120ms | 120ms | 1ms | Press, toggle, chip state |
| `--d-quick` | 240ms | 240ms | 1ms | Hover, focus, color, icon swaps, error messages |
| `--d-measured` | 600ms | 600ms | 1ms | Menus, overlays, opacity, the cut, nav hide/show |
| `--d-force` | 1400ms | **1100ms** | 1ms | Reveals and settles: the alignment move |
| `--d-treatment` | 2400ms | **1800ms** | 1ms | Signature moments only: glyph alignment, exposure scale, Orb landing |

**Ceiling:** no single animation lasts longer than `--d-treatment`. The only exception is motion tied to scroll position, which the visitor controls.

### 2.3 Staggers

| Token | Value | Use |
|---|---|---|
| `--stagger-glyph` | 18ms | Hero glyphs (overridden by the center-out wave, 260–1020ms) |
| `--stagger-list` | 60ms | Menu links, chips, rows |
| `--stagger-line` | 90ms | Lines within one heading |
| `--stagger-block` | 110ms | Siblings in a group: wire, then heading, then copy, then action |
| Tooth rank (hero) | 130ms | Arch brackets, front teeth first |

**Stagger cap:** at most six items stagger individually. Beyond that, stagger groups rather than individual items.

### 2.4 Amplitudes: how far things travel

| Token / rule | Full | Lite | Why |
|---|---|---|---|
| `--m-align-x / -y` | −14px / 18px | −10px / 14px | "Crowded" offsets, small enough to stay readable |
| `--m-align-r` | −2.2° (alternating with +1.4°) | same | The crowding cue. Never more than 3° for blocks and lines. The hero H1 glyphs, a signature moment, go up to ±8°. |
| `--m-rise` | 16px | 16px | Interactive blocks rise but **never rotate** |
| `--m-exposure-scale` | 1.035 → 1 | same | A photographic push-in |
| Parallax | ≤ 10% of element height | off | Vestibular safety |
| Blur | ≤ 1.4px (hero depth of field only) | ≤ 1.4px | Expensive. Depth cue only. |
| Hero camera | ±2.9° yaw, ±1.3° pitch; +36° crane on scroll | crane only | Shows real depth without disorienting |

### 2.5 Scroll smoothing ("light force" scrubbing)

Scrubbed scenes don't snap to the scroll position. They **trail** it with frame-rate-independent damping:

```
k = 1 − (1 − s)^(dt / 16.7ms)      p ← p + (target − p) · k
```

| Scene | `s` | Why |
|---|---|---|
| Crowding (pinned) | 0.16 | Turns notched mouse-wheel steps into one steady push |
| Debond arch | 0.14 | The wire draws like it's being pulled |
| Treatment rail fill | 0.20 | Should track closely; it's information |
| Hero crane | 0.20 | Gentle, but responsive |

At 60fps, s = 0.16 settles to within 1% in about 26 frames (430ms). It never lags enough to feel disconnected.

---

## 3. Choreography and timing rules

1. **Order of arrival: structure, then heading, then copy, then action.** The eyebrow wire draws first, the heading lines settle 110ms later, the copy fades 110ms after that, and the CTA rises last.
2. **Entrance budget:** every section's entrance completes within **1.6s** of it entering the viewport. Signature moments are the exception.
3. **Reading delay cap:** nothing a visitor might want to read waits more than **450ms** after its section becomes visible.
4. **Body copy never moves.** It fades in place. Only headings, labels, blocks and images travel.
5. **Interactive elements never rotate** and travel at most 16px. Once something can be clicked, it doesn't move again (apart from hover feedback).
6. **One signature per viewport.** When a scrubbed scene is active (Crowding, Debond), nothing else in that viewport animates.
7. **Exits use `--ease-release`** at about 60% of the entrance duration. Overlays close faster than they open (600ms against 900ms).
8. **States are reversible on the same curve.** A hover releases on the curve it arrived on, which is the shape-memory principle.
9. **Reveals fire once.** Scrolling back up doesn't replay them. Scrubbed scenes do reverse, because they *are* scroll position.

---

## 4. The catalogue

### 4.1 Loading sequence

The loader runs on the **first visit per session only**. It's skipped when reduced motion is on, when there's no JavaScript, or when the Web Animations API isn't available.

| Time | Event | Duration · curve |
|---|---|---|
| 0 | Two Occlusion half-panels meet at the midline. The hero HTML is rendered underneath; the LCP element is the H1 text. | — |
| 0 | The Orb (the logo's O) scales from 0 to 1 | 700ms · force |
| 320ms | **The crescent opens**: the logo smiles (path morph) | 750ms · force |
| ≥ 1100ms | Hold until web fonts are ready. **Minimum 1.1s, hard cap 2.5s.** | — |
| *any input* | **Skip:** a keypress, pointer, wheel or touch fast-forwards to the hand-off (measured at about 0.5s) | — |
| hand-off | **FLIP:** the Orb flies to the O inside the nav logo | 900ms (480ms if skipped) · settle |
| +150ms | The panels part from the midline outward | 900ms · force |
| landing | The nav logo appears, the Orb fades, and the cold open begins (Hero §8) | 160ms |

### 4.2 Text reveals

| Primitive | Applies to | Motion | Timing |
|---|---|---|---|
| **Glyph alignment** | The hero H1 only, once per site | Each glyph moves from crowded (±8°, ±0.07em) to aligned in a wave from the center outward, in step with the arch | 2.4s each · force · delays 260–1020ms by distance from center |
| **Lines** (`data-reveal="lines"`) | Every H2/H3 display heading, and quotes | Words are wrapped as spans and **grouped by measured line**. Each line settles from crowded (offset plus alternating ±rotation). | 1400ms transform, 600ms opacity · force · +90ms per line |
| **Fade** (`data-reveal="fade"`) | Ledes and body copy | Opacity only. **Body copy never moves.** | 1400ms · force · +120ms |
| **Wire** (`data-reveal="wire"`) | Eyebrows (`ACT II ── Treatment plan`) | The wire draws from the left, then the label resolves | Wire 1400ms; label 600ms at +260ms · force |
| **Align** (`data-reveal="align"`) | Rare: a whole block that should feel "placed" | The block moves from crowded to aligned | 1400ms · force |

**Splitting rules:** split by word, never by glyph, except for the hero H1, which carries an `aria-label`. Word spans don't change what screen readers announce (this is verified: the heading text is unchanged). Lines are measured at reveal time, after fonts have loaded, so line breaks are always correct.

**Numbers:** shown as final values. There are no counting animations, because counters delay comprehension and read as gimmicky.

### 4.3 Image transitions

| Primitive | Applies to | Motion |
|---|---|---|
| **Exposure** (`data-reveal="exposure"`) | Plates, portraits, case photography | A dark Occlusion veil lifts (opacity, 1400ms) while the image eases from scale 1.035 to 1 (2400ms), like a print developing under light |
| **Before / After** | The Results compare frame | Pointer drag maps exactly to the cursor. Keyboard uses a native range input. A one-time demo sweep runs 50 → 30 → 64 → 50% (900ms per leg, settle) and cancels on any input. The handle scales to 1.08 while grabbed. |
| **Radiograph** | The Results "after" site | A scan line sweeps across (1.4s, settle). Skeleton outlines and data tags align in, staggered 300–750ms. The divider glides to 2% (900ms, settle) so the whole after site is visible. |
| **Video** (production) | Case films, hero loops on inner pages | The poster frame is shown first. The video fades in over it (600ms) on `canplay`. No autoplay with sound; loops are muted and paused off-screen. |
| **Hover push-in** (production) | Case cards | The image eases from scale 1 to 1.02 (1400ms, force) and releases on the same curve |

### 4.4 Parallax

| Where | Amount | Tier |
|---|---|---|
| Hero copy lift on scroll | −70px and a fade (between 15% and 70% of the hero scroll) | Full and lite |
| Hero camera crane | +36° pitch, pulling back 2.2 units | Full and lite |
| Hero camera parallax (pointer) | ±2.9° yaw, ±1.3° pitch | Full only |
| Portrait and case photography (production) | ≤ 6% of element height, image inside its frame | Full only |

**Rules:** parallax only ever applies to set elements (images, the arch), **never to text blocks people are reading**. It's capped at 10% and switched off in lite and reduced tiers.

### 4.5 Depth effects

| Effect | Implementation |
|---|---|
| **Z-planes** | Plane 3 atmosphere (CSS light) · plane 2 set (canvas, images) · plane 1 subject (copy) · plane 0 lens (nav, midline, grain) |
| **True perspective** | The hero arch is projected in 3D, so near brackets are larger than far ones |
| **Atmospheric fade** | Opacity falls from 1 to 0.5 with depth (hero arch) |
| **Depth of field** | Far brackets blur up to 1.4px (canvas filter, where supported) |
| **Reflection** | A 12% mirror of the wire on a black glass floor |
| **Light** | The cursor is the key light: one light that drives both the CSS glow and the 3D highlights |
| **Overlays** | Opaque surfaces (Orb flood, menu), never frosted glass, so there's no costly backdrop blur |

### 4.6 Scroll-triggered animation

**Reveals** (kernel §7): an IntersectionObserver with `threshold: 0.15` and `rootMargin: 0 0 −6% 0`. Each fires **once**. Siblings stagger 110ms (`data-reveal-group` widens the group), and `data-reveal-delay` adds an offset.

**Scrubbed scenes** (kernel §6): `OMMotion.scene(el, { measure, smooth, reduced, onProgress })`. They're only measured while within 25% of the viewport, and the clock sleeps when nothing is moving.

| Scene | Measure | Smoothing | Reduced behavior |
|---|---|---|---|
| Hero crane and copy lift | `progress.leave` (hero height scrolled) | 0.20 | Holds at 0 |
| Crowding | `progress.track` (pinned track) | 0.16 | Skipped: static layout |
| Treatment rail fill | First phase center → last phase center at the viewport middle | 0.20 | Live (it's information, not decoration) |
| Debond arch | `progress.cross(1.15, 0.55)` (center travels from 115% to 55% of the viewport) | 0.14 | Holds at 1 (fully drawn) |
| Treatment-day HUD, scene-aware nav | `onScroll` | — | Live |

### 4.7 Pinned sections

| Section | Pin | Length (full / lite) | Content while pinned |
|---|---|---|---|
| **Act I: Crowding** | `position: sticky` stage | **300vh / 220vh** | The claims spread, the header lifts, and the resolution aligns. Readable at every scroll position. |
| **Act II: Treatment rail** | Sticky numeral and wire, **desktop ≥ 1200px only** | Length of the four phases | The phases scroll normally beside it |

**Rules**
- **At most two pins per page.** Neither may exceed 300vh.
- Pins are CSS `sticky`, never JavaScript scroll-jacking. Scroll speed is always native.
- **Never pin forms, CTAs or anything that needs reading time** beyond a headline and two lines.
- Every pinned state is a readable composition. There are no frames of half-overlapping text.
- Navigation **cuts across pins** (§4.10), so nobody has to scrub through 300vh to reach a section.
- **Reduced motion unpins everything** into static layouts.

### 4.8 Hover states

| Element | Changes | Duration · curve | Release |
|---|---|---|---|
| Primary button | Background and text color (on dark: white with blue text; on light: Ortho Blue Deep); the wire lengthens from 1.75 to 3rem; press nudges it down 1px | 240ms · force; wire 600ms · force; press 120ms | Same curve |
| **Hero CTA (charge)** | Plus a light pulse down the archwire (1s) and the wire brightening (damped, lerp 0.08 per frame) | 1000ms · force | Fades with the same damping |
| Text link | Underline offset 0.35 → 0.6em; underline color to the brand blue | 240ms · force | Same |
| Nav link | A wire draws left to right (scaleX), then retracts to the right | 600ms · force | Origin flips |
| Menu button | Icon lines spread from 7 to 10px | 240ms · force | Same |
| Episode row | A wire draws across the row; the play bracket fills with Ortho Blue | 1400ms · force; 240ms | Same |
| Radiograph toggle, chips | Border, background and text color | 240ms | Same |
| Compare handle | Scale 1.08 while grabbed; grabbing cursor | 240ms · force | Same |
| Hero brackets (pointer) | Pushed back up to 0.26 units and 18°, then spring back | Spring: stiffness 0.085, damping 0.8 | Shape memory |
| Hero light | Damped follow (lerp 0.06 per frame) | Continuous until it settles | Stops when settled |

**Touch:** nothing depends on hover. `:active` gives 120ms press feedback, and hover-only effects are simply absent.

### 4.9 Micro-interactions

| Interaction | Motion |
|---|---|
| **Form field focus** | The underline grows from the left, 0 → 100% (600ms · force) |
| **Validation error** | The message aligns in (240ms · force: 4px and opacity). The underline turns `#FFD7D0`. Focus moves to the first invalid field. **No shake.** |
| **Chip select** | Fill and text invert (240ms); press scales to 0.97 (120ms) |
| **Submitting** | The button wire extends and retracts on a loop (900ms · settle, alternating) while `aria-busy` is set |
| **Consultation step change** | The new step aligns in (from −12px and 16px, −1.4°, over 1.4s · force). A progress bracket fills (600ms), the progress wire advances (1400ms · force), and "Step N of 4" is announced. |
| **Confirmation** | The Orb lands (scale 0.4 → 1, −20°, over 2.4s · force), then smiles (900ms at +500ms) |
| **FAQ** | The icon cross rotates to a minus (600ms · force); the panel height opens (600ms · force, where supported) |
| **First-visit steps** | The wire draws (1.6s · force); brackets engage at 300ms, then every 450ms |
| **Nav** | Hides while scrolling down and returns on scroll up (600ms · force). **Reappears on keyboard focus.** Color and logo cross-fade by scene (600ms · settle). |
| **Treatment-day HUD** | The counter tracks scroll. The HUD fades in after 35% of a viewport (600ms). |
| **Reduce-motion switch** | The knob slides (600ms · force); the change applies instantly |
| **Skip link** | Slides into view on focus (240ms · force) |

### 4.10 Scene transitions

| Transition | When | Spec |
|---|---|---|
| **Hard cut** | Between dark and light sections | Instant, like a film cut. The nav color and logo cross-fade (600ms · settle) when the new scene crosses a 36px probe line. |
| **Glide** | In-page links where the target is within 1.5 viewports | Eased scroll · settle · `clamp(distance/vh × 520ms, 380ms, 820ms)`. Focus moves to the target heading. |
| **Cut (midline wipe)** | In-page links beyond 1.5 viewports | The panels close to the midline (390ms · settle) with a Signal seam → the destination label (e.g. `ACT III — BEFORE / AFTER`) holds for 140ms → an instant jump → the panels open (600ms · force). About 1.2s in total. Focus moves to the heading and the URL hash updates. *Gliding thousands of pixels through pinned, scrubbed scenes is slow and nauseating; a cut is faster, calmer and on-brand.* |
| **Orb flood** | Any consultation CTA | An Ortho Blue circle grows from the click point (900ms · force); content fades in at +350ms; focus moves at +450ms. Closing contracts it to the trigger (600ms · settle) and returns focus. |
| **Menu iris** | Menu button | A circle grows from the button (800ms · force); links align in on a 60ms stagger starting at +200ms |
| **Page transition** (production, multi-page) | Route change | The same midline wipe through the **View Transitions API**, with a shared-element morph of the logo (sketch below). Instant swap where unsupported or with reduced motion. |

```css
/* Production page transitions — same tokens, same choreography */
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: wipe-close calc(var(--d-measured) * .65) var(--ease-settle) both; }
::view-transition-new(root) { animation: wipe-open var(--d-measured) var(--ease-force) both; }
.brand { view-transition-name: brand; }            /* the logo stays put across pages */
@keyframes wipe-close { to { clip-path: inset(0 50% 0 50%); } }
@keyframes wipe-open  { from { clip-path: inset(0 50% 0 50%); } to { clip-path: inset(0 0 0 0); } }
html[data-motion="reduced"]::view-transition-group(*) { animation: none !important; }
```

### 4.11 Signature moments map

One per viewport, top to bottom:

| Viewport | Signature | Supporting motion allowed |
|---|---|---|
| Loader | The Orb calibrates and flies to the logo | None |
| Hero | Shape memory (the arch and glyphs in one wave) | Copy aligns in |
| Act I | Crowding scene (pinned) | None |
| Act II | Treatment rail | Line reveals on phase headlines |
| Act III | Before/After and Radiograph | Metrics rise, leader lines draw, quote lines settle |
| Act IV | Portrait exposure | Heading lines, fade |
| Act V | On-air lamp and waveform (ambient) | Heading lines |
| Act VI | First-visit wire and brackets | FAQ disclosures (on demand) |
| Finale | Debond arch (the one spring) | CTA rises |
| Conversion | Orb flood → confirmation Orb smile | Step alignment |

---

## 5. Implementation

### 5.1 Architecture

```
tokens.css ──────────────► CSS primitives (styles.css)
  curves · durations ·        [data-reveal] align/lines/rise/fade/wire/exposure/draw
  staggers · amplitudes       hover/micro states · .cut · tiers · reduced
  tier overrides                      ▲
        │ getComputedStyle           │ classes / custom properties
        ▼                            │
motion.js — the kernel (≈4.6KB min+gz) ───────────────────────────────┐
  §1 exact bezier · §2 tokens · §3 tiers · §4 clock (one rAF, sleeps)  │
  §5 tween · §6 scenes (smoothed) · §7 reveals · §8 loop pausing       │
  §9 navigate (glide / cut) · §10 reduce-motion switch                 │
        │ window.OMMotion                                              │
        ▼                                                              │
main.js — page scenes (≈12.9KB min+gz)                                 │
  loader (WAAPI) · hero arch (canvas, on the shared clock) · crowding  │
  · rail · compare · debond · menu · consultation ─────────────────────┘
```

### 5.2 The right tool for each job

| Job | Tool | Why |
|---|---|---|
| State changes (hover, focus, open, selected) | **CSS transitions** using the tokens | Declarative, interruptible, compositor-friendly |
| Ambient loops (grain, waveform, on-air lamp) | **CSS keyframes** with `data-loop` | Paused off-screen and in hidden tabs by the kernel |
| One-shot choreographed element moves (Orb FLIP) | **Web Animations API**, using `OMMotion.tokens.css.*` easings | A precise timeline with promises |
| Values CSS can't animate (SVG path `d`, canvas, scroll position) | **`OMMotion.tween`** | Exact token curves on the shared clock |
| Scroll-linked progress | **`OMMotion.scene`** | Smoothed, gated by intersection, sleeps when settled |
| 3D canvas | Its own draw function, subscribed to **`OMMotion.add`** only while moving | One clock, zero idle cost |
| Page-to-page (production) | **View Transitions API** | Native, and degrades to an instant swap |

### 5.3 Kernel API

| API | Purpose |
|---|---|
| `OMMotion.tier` / `.reduced` / `.full` | The current tier: `full`, `lite` or `reduced` |
| `OMMotion.tokens` | `{ d: {instant…treatment}, ease: {force, settle, release, debond, linear}, curve, css, stagger }` |
| `OMMotion.add(fn)` | Subscribe `fn(now, dt)` to the shared clock. Return `false` to unsubscribe. |
| `OMMotion.tween({ from, to, duration, delay, ease, onUpdate, onComplete })` | Animate a value with token curves. Under reduced motion it jumps straight to the end. |
| `OMMotion.scene(el, { measure, smooth, reduced, onProgress })` | A scroll-linked scene. `reduced` is a number (hold that value), `'skip'` or `'live'`. |
| `OMMotion.progress.track / leave / cross(from, to)` | Standard measures |
| `OMMotion.onScroll(fn)`, `onResize(fn)`, `onTier(fn)` | Lifecycle hooks (resize is debounced 120ms) |
| `OMMotion.navigate(el)` | Glide or cut to an element, then move focus |
| `OMMotion.bindReveals(scope)` | Bind `[data-reveal]` in injected content |

**Authoring in HTML:**

```html
<p class="eyebrow mono" data-reveal="wire"><span>Act II</span> Treatment plan</p>
<h2 class="d1" data-reveal="lines">Four phases.<br> <em>One continuous force.</em></h2>
<p class="lede" data-reveal="fade">Every engagement follows the arc of good treatment…</p>
<figure class="plate" data-reveal="exposure">…</figure>
<svg><path d="…" pathLength="1" data-draw/></svg>       <!-- draws when its revealed parent arrives -->
<div data-loop>…</div>                                    <!-- ambient animation, paused off-screen -->
<a href="#results">…</a>                                  <!-- glides or cuts automatically; data-no-cut opts out -->
<button data-motion-toggle aria-pressed="false">Reduce motion</button>
```

**Authoring in JavaScript:**

```js
const M = window.OMMotion;
M.scene(section, {
  measure: M.progress.cross(1.0, 0.5), smooth: 0.14, reduced: 1,
  onProgress: (p) => line.style.strokeDashoffset = 1 - M.ease.settle(p),
});
M.tween({ to: 1, duration: M.tokens.d.force, ease: 'force', onUpdate: (v) => orb.setAttribute('d', smile(v)) });
```

### 5.4 Production mapping (if the team standardizes on GSAP)

| Kernel | GSAP equivalent |
|---|---|
| `add` (shared clock) | `gsap.ticker.add` |
| `tween` | `gsap.to(obj, { duration, ease: CustomEase.create('force', '.16,1,.3,1') })` |
| `scene` with `smooth: s` | `ScrollTrigger.create({ scrub: ~0.6–1.0 })` (time-based scrub, similar feel) |
| Crowding pin | `ScrollTrigger({ pin: true, end: '+=200%' })`, or keep CSS `sticky` (preferred) |
| Reveals | `ScrollTrigger.batch('[data-reveal]', { onEnter, once: true })` |
| `navigate` cut | A ScrollToPlugin glide for short distances; the cut stays custom |
| Tiers | `gsap.matchMedia()` with `(prefers-reduced-motion)` and `(pointer: coarse)` |

**Recommendation:** ship the kernel (about 4.6KB, no dependencies). GSAP plus ScrollTrigger adds about 35KB gzipped and solves problems this site doesn't have. Adopt it only if the team already maintains GSAP elsewhere.

### 5.5 Progressive enhancement

All content is in the HTML, and hidden reveal states only apply under `.js`.

- **Failsafe:** the kernel adds `.motion-ready` when it boots, and the page script adds `.scenes-ready`. If either is missing 4s after load (a blocked or failed script), an inline timer adds `.motion-failed`, which forces every reveal-hidden element visible. Content can never be stranded invisible.
- **No JavaScript:** content is fully visible, and the OS reduced-motion setting still stops CSS loops.

---

## 6. Performance requirements

### 6.1 Targets

| Metric | Target |
|---|---|
| Frame rate during scrubbed scenes | **60fps** (16.7ms) on reference devices; 50fps or better on the lite reference device |
| Main-thread work per frame while scrubbing | ≤ 4ms of scripting · ≤ 2ms style and layout · ≤ 6ms paint and composite |
| **Idle cost** | **0 frames** with nothing moving (measured: hero, mid-page and phone all at 0 frames over 2s) |
| Long animation frames (LoAF) during scroll | None over 50ms |
| INP | < 150ms (motion never blocks input; overlays respond within 350ms) |
| CLS from motion | **0**. Only `transform` and `opacity` move layout-relevant elements. |
| Motion JS | Kernel ≈4.6KB plus scenes ≈12.9KB, min+gz (measured); budget 30KB |
| Loader | ≤ 2.5s cap; skippable (measured 0.5s after input) |

### 6.2 Engineering rules

1. **Animate only `transform` and `opacity`.** Allowed exceptions: `clip-path` on full-screen overlays (flood, menu), `filter: blur` at no more than 1.4px on canvas sprites, and `background-size` on form underlines.
2. **One clock.** No private `requestAnimationFrame` loops. Subscribe to `OMMotion.add` and return `false` when done.
3. **Read, then write.** Scenes read one bounding rectangle each per frame inside the kernel pump. No DOM reads in draw loops; the canvas measures only on resize.
4. **Gate by visibility.** Scenes outside ±25% of the viewport aren't measured. Loops pause off-screen and in hidden tabs. The canvas stops when off-screen.
5. **`will-change` only where motion is continuous** (hero glyphs, claims, hero content). Never apply it page-wide.
6. **Cap device pixel ratio:** 2 on full, 1.5 on lite (hero canvas).
7. **Limit splitting.** Word spans for headings only (≤ 60 per heading). Glyph spans for the hero H1 only (≤ 40).
8. **At most about 40 elements animating at once** (the crowding scene uses 14 chips).
9. **No layout-triggering properties.** Never animate `width`, `height`, `top`, `left`, `margin` or `font-size`. The FAQ height animation uses the native `::details-content` path.

### 6.3 Monitoring

- **Lab:** `node tests/motion-check.js` (21 checks: loader skip, tiers, exact curves, idle frames, reveals, cut and focus, switch persistence, lite pins, reduced end states, overflow at six sizes, Motion Lab, and the script-failure failsafe).
- **Live (production):** a `PerformanceObserver` for `long-animation-frame` and INP, reported to analytics with the motion tier attached. Alert if the 75th percentile exceeds budget for any tier.
- **CI:** Lighthouse CI with LCP, CLS and total-blocking-time budgets, plus the motion check suite on every pull request.

---

## 7. Mobile alternatives

The **lite** tier is chosen automatically for coarse pointers (touch), low-power devices (≤ 2 cores or ≤ 2GB memory) and Save-Data.

| Primitive | Desktop (full) | Touch / lite |
|---|---|---|
| Durations | 1400 / 2400ms long steps | **1100 / 1800ms** (shorter distances, shorter times) |
| Reveal travel | 14px / 18px | 10px / 14px |
| Hero arch | Shape memory, cursor light, bracket force, parallax, crane · DPR 2 | Shape memory and crane · DPR 1.5 · **no pointer effects, no autonomous drift** |
| Hero light | Follows the cursor | Static (saves battery) |
| Crowding pin | 300vh | **220vh** |
| Treatment rail | Sticky numeral and wire | Retired below 1200px; numerals inline |
| Grain | 6-step jitter | **Static** |
| Waveform | 1.8s cycle | 2.6s cycle, paused off-screen |
| Compare | Drag | Drag with `touch-action: pan-y` (vertical page scroll is never blocked) plus the native range |
| Menu | — | Iris from the Menu button |
| Hover | Rich hover states | `:active` press feedback only. Nothing is hover-dependent. |
| Gyroscope / device tilt | — | **Not used** (permission prompts, motion sickness) |

---

## 8. Reduced motion

**Tier logic:** `reduced` applies when the OS asks for reduced motion **or** the visitor turns on the in-site **Reduce motion** switch (in the footer and the menu, persisted in `localStorage`). An explicit in-site choice wins in both directions. The tier is set **before first paint** by an inline script, so there's never a flash of motion. It also updates live when the OS setting changes.

| Primitive | Reduced behavior |
|---|---|
| Loader | Skipped |
| Hero | Final frame: glyphs aligned, arch settled, no light follow, no parallax, no crane |
| Reveals | All content present immediately |
| Crowding | Unpinned: static header, then the resolution; chips hidden |
| Treatment rail | Numerals swap instantly; the fill still reflects position (it's information) |
| Compare | No demo sweep; radiograph and glide jump instantly |
| Debond | Arch fully drawn, brackets aligned |
| Navigation | Instant jump (no glide, no cut); focus still moves to the target |
| Overlays | Menu and consultation appear instantly |
| Loops | Grain, waveform and on-air lamp are static |
| State feedback | Color and state changes stay, but are instant (1ms) |
| No JavaScript | `@media (prefers-reduced-motion)` stops every CSS transition and loop |

**What stays:** every piece of content, every state (open/closed, selected, focus), focus rings and the story. Only the movement goes.

---

## 9. Accessibility

| WCAG 2.2 criterion | How the system meets it |
|---|---|
| **2.2.2 Pause, Stop, Hide** | Ambient loops pause off-screen, and the in-site **Reduce motion** switch stops them everywhere |
| **2.3.1 Three Flashes** | Nothing flashes. The on-air lamp is the only pulse, at 0.38Hz. |
| **2.3.3 Animation from Interactions** | The reduced tier removes all non-essential motion, triggered by the OS or the in-site switch |
| **2.4.3 Focus Order** | After a glide or cut, focus moves to the target heading. Overlays trap focus and return it to the trigger. |
| **2.4.11 Focus Not Obscured** | The scroll-hidden nav reappears on `:focus-within`; `scroll-padding-top` keeps focused targets clear of it |
| **2.5.7 Dragging Movements** | The Before/After drag has a keyboard and single-pointer alternative (a native range input) |
| **2.1.1 Keyboard** | Every interaction, including the CTA charge (on focus), works from the keyboard |

**Vestibular safety:** no page-level zooms (image push-ins are at most 3.5%), no spinning, no horizontal scroll-jacking, parallax capped at 10% and switched off in lite and reduced, and the camera crane limited to 36° and tied to scroll.

**Screen readers:** word-split headings read normally. The glyph-split H1 uses an `aria-label`. The canvas, waveform, arches and HUD are `aria-hidden`. The cut overlay is `aria-hidden` and focus moves to a real heading.

---

## 10. Supported devices and fallbacks

**Browsers:** Chrome and Edge 120+, Safari 17+ (macOS and iOS 17+), Firefox 120+, Samsung Internet 23+. Older evergreen versions get the reduced-motion presentation automatically where features are missing.

**Reference devices for performance sign-off:** MacBook Air M1 · Windows laptop with Intel Iris Xe · iPhone 12 · Pixel 6a · Galaxy A54 (mid-range) · Moto G Power 2022 (the low-end lite reference).

| Feature | Used for | Fallback |
|---|---|---|
| IntersectionObserver | Reveals, scenes, loop pausing | Content shown immediately; scenes always active |
| Web Animations API | Loader FLIP | Loader skipped |
| Canvas `filter` | Hero depth of field | No blur; everything else intact |
| `::details-content` and `interpolate-size` | FAQ height animation | Opens instantly |
| `:has()` | Compare frame focus ring | Range input still focusable and operable |
| View Transitions API (production) | Page wipes | Instant navigation |
| `localStorage` | Motion preference, consultation draft | Follows the OS setting; no draft saving |

---

## 11. QA

**Automated:** with the site served (`cd site && python3 -m http.server 8000`):

```bash
BASE=http://localhost:8000 node tests/motion-check.js
```

**Manual checklist**

- [ ] First visit: the loader hands off to the hero with no flash; any key skips it; return visits start at the hero.
- [ ] The hero settles by about 2.9s; then the clock is idle (Motion Lab readout or the Performance panel).
- [ ] Each section's entrance completes within 1.6s; body copy only fades.
- [ ] Crowding pin: readable at every position; wheel and trackpad both feel steady (smoothing).
- [ ] Nav links far away **cut**, near ones **glide**; focus lands on the heading; the hash updates.
- [ ] The nav reappears when tabbing into it while scrolled.
- [ ] Hover states release on the same curve; no hover dependencies on touch.
- [ ] Forms: the underline grows on focus, errors align in without shaking, the submitting wire loops.
- [ ] Reduce motion (OS and in-site switch): no loader, no pins, instant overlays, static loops, all content present.
- [ ] Lite (phone): grain static, 220vh pin, no pointer effects on the hero.
- [ ] Performance panel: no long frames over 50ms while scrolling through Crowding and Debond on the reference phone.
- [ ] No horizontal overflow at 320 → 1920px.
