# Ortho Marketing — Website Experience Blueprint

**Version 1.0 · October 2026**
Builds on: [Creative Direction v1.1](../creative-direction/CREATIVE-DIRECTION.md) · Working prototype: [`/site/index.html`](../site/index.html) · Tokens: [`/site/tokens.css`](../site/tokens.css)

This blueprint maps the full journey, from the first frame of the loading screen to a submitted consultation request. Every section is listed in order with its job, final copy, layout at each breakpoint, visual elements, interactions, motion, transitions, CTA, accessibility, analytics and CMS fields. The prototype builds every homepage section described here.

> **Markers used:** **[verify]** is a fact to confirm with the agency. **[illustrative]** is placeholder content to replace before launch. **[decide]** is a decision for the brand owner.

---

## Contents

1. [Experience strategy](#1-experience-strategy)
2. [Brand system applied (logo-matched)](#2-brand-system-applied-logo-matched)
3. [Global systems](#3-global-systems)
4. [The journey, section by section](#4-the-journey-section-by-section)
   - [00 Loader](#00--loader-calibration) · [01 Cold open](#01--cold-open-hero) · [02 Diagnosis](#02--act-i-diagnosis) · [03 Treatment plan](#03--act-ii-treatment-plan) · [04 Before / After](#04--act-iii-before--after) · [05 The family](#05--act-iv-the-family) · [06 Live](#06--act-v-live) · [07 First visit](#07--act-vi-your-first-visit) · [08 Debond](#08--finale-debond) · [09 End credits](#09--end-credits-footer)
5. [The conversion flow: the records appointment](#5-the-conversion-flow-the-records-appointment)
6. [Secondary pages](#6-secondary-pages)
7. [Responsive matrix](#7-responsive-matrix)
8. [Accessibility specification](#8-accessibility-specification)
9. [Performance & build](#9-performance--build)
10. [Content & asset checklist](#10-content--asset-checklist)

---

## 1. Experience strategy

### 1.1 Objective

| | Event | Definition |
|---|---|---|
| **Primary conversion** | `consultation_submit` | A records appointment submitted (all four steps) |
| Leading indicator | `consultation_open` → `consultation_step` | The funnel into and through the form |
| Secondary | `episode_click`, `cta_click{hero-results}` | Podcast engagement; intent to see proof |
| Health | `scroll_act{…}`, `compare_interact`, `xray_toggle`, `faq_open` | Whether the narrative is being read |

Set targets after a 30-day baseline. Optimize section by section using drop-off between `scroll_act` events.

### 1.2 Audience and how they arrive

| Mode | Who | Arrives from | Needs | Fastest path |
|---|---|---|---|---|
| **Cold** | Orthodontist-owner comparing agencies | Search ("orthodontic marketing agency"), paid search | To see that this agency is different, then proof | The whole film, top to bottom |
| **Warm** | Referred by a colleague or a podcast listener | Referral link, podcast show notes | Proof and trust | Hero → *See the results* → Results → First visit → consultation |
| **Hot** | Returning visitor, ready to talk | Direct, email, retargeting | No friction | Nav CTA (always one scroll-up away) → overlay, with any saved draft restored |
| **Delegate** | Practice manager or marketing lead | Forwarded link | Clarity on process and cost | Nav → First visit → FAQ → consultation (role field in step 4) |

### 1.3 The narrative spine: nine questions in order

Each section answers exactly one question a visitor is silently asking, in the order they ask it.

| # | Visitor's question | Section | Our answer | Emotion | Proof device |
|---|---|---|---|---|---|
| 1 | Who are you? | 01 Cold open | Orthodontic specialists who think like clinicians | Intrigue → recognition | The metaphor itself |
| 2 | Do you understand my problem? | 02 Diagnosis | Your market is crowded and everyone looks the same | Being seen | Their competitors' own clichés |
| 3 | What do you actually do? | 03 Treatment plan | Four phases: Records, Alignment, Force, Retention | Clarity | A structure they already trust |
| 4 | Does it work? | 04 Before / After | Same practice, different market | Conviction | Slider, radiograph data, metrics, doctor's words |
| 5 | Can I trust you? | 05 The family | Family-run since 2008, like many of you | Kinship | Named people, real facts |
| 6 | Do you know my industry? | 06 Live | We host the conversation | Respect | 170+ podcast episodes [verify] |
| 7 | What happens if I reach out? | 07 First visit | Three steps, no pressure, a plan you keep | Safety | Explicit process |
| 8 | What about my concerns? | 07 First visit (FAQ) | Straight answers | Relief | Five objections answered |
| 9 | Let's go. | 08 Debond → overlay | Begin your consultation | Momentum | The Orb opens the form |

### 1.4 Conversion architecture

- **One primary action across the whole site: "Begin your consultation."** It appears in the hero, menu, finale and footer. The nav carries the same action as "Book a consultation" (or "Consult" on mobile).
- **Every CTA opens the same overlay.** There's no page load, the visitor's place on the page is kept, and the draft saves automatically. Paid traffic can land on `/consultation`, which is the same component as a standalone page.
- **The CTA is never more than one scroll-up away.** The nav hides while scrolling down and returns on any scroll up.
- **One primary action per viewport.** Sections 02, 03, 05 and 07 deliberately have no inline CTA. They do their persuading and leave the ask to the nav and the finale.
- **A soft path for visitors who aren't ready:** "Or listen first" leads to the podcast, which builds the relationship until they are ready.
- **Micro-commitment ordering in the form:** practice details first (nothing personal), contact details last.
- **Risk reversal comes immediately before the final ask.** Section 07 answers "what happens next" and the five main objections right before the finale's CTA.

### 1.5 Experience principles

1. **One question per section.** If a section doesn't answer the next question in the spine, it's cut.
2. **Content before choreography.** All copy is in the HTML before any script runs. Motion is progressive enhancement and never blocks reading or LCP.
3. **One signature motion per viewport.** Never two competing moments on screen.
4. **Everything connects.** Every visual element traces back to one system: the Orb (the logo's O), the archwire, the midline, and the alignment reveal. Nothing is decorative on its own.
5. **Accessible by default.** Keyboard, screen reader and reduced-motion paths are designed in from the start, not retrofitted.

### 1.6 What we deliberately left out

| Left out | Why |
|---|---|
| Client logo wall | No verified permission. If added later, it lives inside Results, not as decoration. |
| "Why choose us" icon grid | Replaced by the Treatment plan, which says more and looks like no one else. |
| Animated stats band | Numbers only appear inside proof, with the time period and context. |
| Blog / Journal at launch | The podcast is the content engine and its transcripts carry the SEO. Add a Journal only once there's staff to keep up a cadence. |
| Pricing page | Pricing is specific to each plan. It's answered honestly in the FAQ instead. |
| Chat widget, exit-intent pop-ups | They contradict "no pressure." The consultation is the conversation. |
| The bracket-macro interlude (Creative Direction) | Moved to the `/treatment/alignment` hero to keep the homepage lean. The radiograph mechanic stays on the homepage inside Results, where it carries proof. |

---

## 2. Brand system applied (logo-matched)

### 2.1 The logo

The supplied logo was sampled directly. **Ortho Blue `#1F2AFF`** (the "O" and "rtho"), **near-black `#000201`** (the "Marketing" wordmark), and a **white crescent** across the O. The O is a sphere with a smile-shaped crescent, so it reads as an orb, a lamp, and a smile all at once. The site uses it as a system element called **the Orb**.

| Asset (in `/site/assets`) | Use |
|---|---|
| `ortho-marketing-logo.png` | Full color, for light grounds (Porcelain, Enamel, white) |
| `ortho-marketing-logo-reversed.png` | Dark grounds. The wordmark is switched to Porcelain; the blue and the crescent are unchanged. |
| `ortho-marketing-logo-white.png` | On Ortho Blue (the consultation overlay). All white, with the crescent knocked out to blue. |
| `orb.svg` | The O as a standalone vector: favicon, loader, confirmation |

**Rules**
- Minimum size: wordmark 120px wide; Orb 16px.
- Clear space: half the Orb's height on every side.
- Never recolor or stretch it, and never add effects.
- On dark grounds, "rtho" in Ortho Blue is 2.67:1. That's acceptable for a logo (logos are exempt from WCAG contrast), but **[decide]** whether to approve a dark-ground variant with "rtho" in Signal `#737BFF`.
- **Request master vector files (SVG/AI)** before production. The PNGs here were derived from the supplied image.

**The Orb throughout the experience:** it calibrates in the loader (§00) → flies into the nav logo → returns as the origin of the blue flood that opens the consultation (§5) → lands and smiles on the confirmation screen. The logo opens the experience and closes it.

### 2.2 Palette

| Token | Name | Hex | Role | Key contrast |
|---|---|---|---|---|
| `--c-ortho-blue` | **Ortho Blue** | `#1F2AFF` | Logo color. CTAs, the Orb, the consultation flood, the wire on light grounds | White on it 7.41:1 · on Porcelain 6.57:1 · on Occlusion 2.67:1 (fills only) |
| `--c-ortho-blue-deep` | Ortho Blue Deep | `#1820D9` | Hover/pressed state on light grounds | 8.29:1 on Porcelain |
| `--c-signal` | **Signal** | `#737BFF` | Ortho Blue lifted for lines, text and focus rings on dark | 5.66:1 on Occlusion · 5.16:1 on Graphite |
| `--c-crescent` | Crescent | `#FFFFFF` | Text and controls on Ortho Blue; the Orb's smile | — |
| `--c-occlusion` | **Occlusion** | `#0A0A0C` | Main dark ground, tuned to the logo black | Porcelain on it 17.5:1 |
| `--c-graphite` | Graphite | `#16161A` | Raised dark ground (Live) | — |
| `--c-smoke` | Smoke | `#2E2E35` | Hairlines on dark (decorative only) | — |
| `--c-nitinol` | Nitinol | `#A4A7AE` | Secondary text on dark | 8.21:1 |
| `--c-nitinol-dim` | Nitinol Dim | `#85888F` | Meta text on dark | 5.57:1 / 5.08:1 |
| `--c-porcelain` | **Porcelain** | `#F4F1EB` | Main light ground; text on dark | — |
| `--c-enamel` | Enamel | `#EAE3D5` | Secondary light ground | — |
| `--c-dentin` | Dentin | `#CFC3AC` | Hairlines on light (decorative only) | — |
| `--c-umber` | Umber | `#5E5750` | Secondary text on light | 6.30:1 |
| `--c-radiograph` | Radiograph | `#A9B4E8` | Radiograph annotations only | — |
| `--c-alert` | Alert | `#C2321F` | Errors on light grounds only | 4.94:1 |
| — | Error on blue | `#FFD7D0` | Form errors on Ortho Blue | 5.6:1 |

### 2.3 Color rules

1. **On dark grounds, Ortho Blue is a fill only** (buttons, the Orb, glows). Use **Signal** for any blue line, wire, label or focus ring on dark.
2. **On light grounds, Ortho Blue is the wire, the labels and the links.**
3. **Primary buttons are always Ortho Blue with white text (7.41:1).** On dark grounds they get a 1px Signal inner edge so the button boundary meets 3:1. Hover goes to white with blue text on dark, and Ortho Blue Deep on light.
4. **The consultation overlay is the only full-bleed Ortho Blue surface** (the "brand flood"). Its rarity is what makes it feel like stepping into the logo.
5. **Category cyan `#19B3C4` appears once,** in section 02, as the noise being pushed away.
6. **No red anywhere** except form errors on light grounds. Errors on blue use `#FFD7D0`.
7. **Client practices get their own palettes.** The "after" mockup is forest and brass on purpose.

### 2.4 Type (from the Creative Direction)

| Role | Production | Prototype | Use |
|---|---|---|---|
| Display | GT Sectra Display Light / Italic | Fraunces | H1–H3, metrics, quotes, menu links |
| Text | Söhne | Hanken Grotesk | Body, UI, buttons, form inputs |
| Mono | Söhne Mono | IBM Plex Mono | Labels, captions, the HUD, form labels |

Söhne's neutral geometry sits comfortably next to the logo's bold geometric wordmark. The display serif supplies the editorial contrast.

### 2.5 Motion tokens

`--ease-force cubic-bezier(.16,1,.3,1)` (default) · `--ease-settle cubic-bezier(.65,0,.35,1)` · debond spring `cubic-bezier(.34,1.56,.64,1)` (finale only) · durations `120 / 240 / 600 / 1400 / 2400ms`. Full rationale is in Creative Direction §13.

---

## 3. Global systems

### 3.1 Grid and breakpoints

| Breakpoint | Range | Columns | Margin | Gutter | Notes |
|---|---|---|---|---|---|
| **Mobile** | ≤ 767px | 12 (used as 1–2 spans) | 16–35px (`clamp`) | 16–22px | Single column. Sticky rails retire. |
| **Tablet** | 768–1199px | 12 (8-column rhythm: spans of 8/6/4) | 35–56px | 22–29px | Menu button replaces links. Phase numerals move inline. |
| **Desktop** | 1200–1599px | 12 | 56–80px | 29–32px | Full choreography, including sticky rails |
| **Wide** | ≥ 1600px | 12 | 80px+ | 32px | Content locks at 1600px; margins grow |

Section vertical rhythm is `clamp(96px, 9vw + 64px, 224px)`. The signature split is display copy on columns 1–8 and supporting copy on 9–12, bottom-aligned (tablet and mobile stack it).

### 3.2 Navigation bar

| | Desktop | Tablet | Mobile |
|---|---|---|---|
| **Left** | Logo, 28px high | Logo, 28px | Logo, 22px |
| **Center** | Treatment · Results · Studio · Live · First visit | — | — |
| **Right** | **Book a consultation** (sm) | Book a consultation + **Menu** | **Consult** + **Menu** |

**States**
- *Over dark scenes:* reversed logo, Porcelain links.
- *Over light scenes:* full-color logo, Occlusion links. The switch happens when a scene crosses a 36px probe line, with a 600ms color cross-fade.
- *Scrolling down past 60% of the viewport:* the nav slides up out of view (600ms force). *Any scroll up:* it returns.
- *Active link:* a wire underline drawn in (scroll spy at the viewport center), with `aria-current="true"`.
- *Hover:* the wire draws left to right and retracts to the right.
- While the loader runs, the logo is hidden so the Orb can land in its place.

**Accessibility:** `<header>` › `<nav aria-label="Primary">`. A skip link is the first focusable element. The Menu button has `aria-expanded` and `aria-controls`.

### 3.3 Menu overlay (tablet and mobile)

- **Open:** a full-screen Occlusion panel reveals as a circle growing from the Menu button's center (`clip-path`, 800ms force). Five numbered display links align in on a 60ms stagger. Below them: the primary CTA and "Est. 2008 · Family-run · Orthodontic practices".
- **Behavior:** `role="dialog"` with `aria-modal`. Focus moves to the first link and is trapped in the menu. Background content is `inert`. Escape or Close returns focus to the Menu button. Tapping a link closes the menu and scrolls to the section. The menu closes itself if the window is resized to desktop.
- **Reduced motion:** appears instantly, with no clip-path.

### 3.4 Persistent layers

| Layer | Spec | Breakpoints |
|---|---|---|
| **Midline** | Fixed 1px vertical line at 50%, 8% opacity, `mix-blend-mode: difference`; draws in top to bottom on reveal | All |
| **Grain** | SVG noise at 5% opacity, 6-step jitter; static for reduced motion | All |
| **HUD** | `TREATMENT DAY 001 / 540` with a progress hairline, mapped to scroll; difference blend; `aria-hidden` | Desktop/tablet: full label. Mobile: `001 / 540` |
| **Director's notes** | Prototype-only annotations | **Remove in production** |

### 3.5 Scene system

Every section declares `data-scene="dark|light"`. The scene controls nav color, logo version, wire color (Signal or Ortho Blue), focus-ring color and eyebrow color. **Changes between scenes are hard cuts**, the way a film cuts, and never gradients.

Scene order: dark (01) → light (02) → dark (03) → light (04) → dark (05) → graphite (06) → light (07) → dark (08, 09) → blue (overlay).

### 3.6 Page transitions (production, multi-page)

**Midline wipe** using the View Transitions API, with a fallback to an instant swap:
1. The midline expands into a full-width Occlusion panel (600ms settle).
2. The destination page's name holds at center in mono (200ms).
3. The panel parts from the midline outward (900ms force), using the same panels as the loader.

The loader runs only on a session's first hit. Later navigations use the wipe. Reduced motion uses an instant swap.

### 3.7 Scroll

Native scroll, never hijacked. Optional Lenis smoothing (duration 1.1) on desktop with a fine pointer only, and disabled for reduced motion and touch. `scroll-padding-top: 80px` so anchors clear the nav. Scroll-scrubbed scenes (02, 03, 08) read `getBoundingClientRect` inside a single rAF loop and only recompute when the scroll position has changed.

### 3.8 Consent and system UI

The cookie consent is a compact bar in the lower left (360px max). It never covers a CTA and never blocks the page. The HUD hides while consent is showing. Analytics and ad tags fire only after consent where the law requires it.

---

## 4. The journey, section by section

Every spec card uses the same fields. Final copy is shown exactly as it ships.

---

### 00 · Loader: "Calibration"

| | |
|---|---|
| **Job** | Mask the font load (no flash of reflowing text) and imprint the brand mark. **First visit per session only.** |
| **Visible copy** | `ORTHO MARKETING · EST. 2008` (mono, Nitinol) |
| **Layout (all breakpoints)** | Full-screen Occlusion, made of two half-panels that meet at the midline. The Orb is centered at `clamp(88px, 18vmin, 156px)`, with the mono line 70–112px below it. |
| **Visual elements** | The Orb (the logo's O as an SVG: blue sphere with a white crescent) |

**Sequence**

| Time | Event | Easing |
|---|---|---|
| 0ms | Panels cover the viewport. The hero HTML is already rendered underneath; the LCP element is the H1 text. | — |
| 0–700ms | The Orb scales from 0 to 1 | force |
| 320–1070ms | **The crescent opens**: the logo smiles (path morph from a zero-height band to the logo's crescent) | force |
| ≥ 1100ms | Hold until web fonts are ready. **Minimum 1.1s, hard cap 2.5s.** | — |
| +0 | **FLIP:** the Orb flies to the exact position and size of the O inside the nav logo (900ms) | settle |
| +150ms | The panels part from the midline outward (900ms) and reveal the hero | force |
| +900ms | The Orb lands, the nav logo appears, the Orb fades (160ms), and **the cold open begins** | — |

| | |
|---|---|
| **Total** | About 2.0s, with a worst case of 2.9s. Scroll is locked only while it runs. |
| **Skip conditions** | Already seen this session (`sessionStorage`) · `prefers-reduced-motion` · no JavaScript. In all three cases the page renders immediately. |
| **Transition to 01** | The panels parting is the cut to the hero. The Orb becomes the logo. |
| **Accessibility** | The loader is `aria-hidden` and never takes focus. Content is in the DOM underneath and the skip link works. |
| **Analytics** | Optional `loader_complete{ms}` for performance monitoring |

---

### 01 · Cold open (Hero)

| | |
|---|---|
| **Job** | Establish positioning and a premium impression within five seconds, and offer the primary action. |
| **Visitor question** | *Who are you?* |
| **Meta row** | `EST. 2008 · FAMILY-RUN · ORTHODONTIC PRACTICES · ORTHO MARKETING LIVE · 170+ EPISODES` [verify] |
| **Headline (H1)** | **We move markets / the way you move / *teeth.*** (line breaks set by hand) |
| **Supporting copy** | Since 2008, we've applied the principle you practice every day — *light, continuous force* — to brands, websites and search. Steadily. Measurably. Until your practice is exactly where it should be. |
| **CTA** | **Primary:** *Begin your consultation* (opens §5, `source=hero`) · **Secondary:** text link *See the results* (to §04) |

**Layout**

| Desktop | Tablet | Mobile |
|---|---|---|
| 100svh. Meta row at top. H1 vertically centered on columns 1–8, three lines up to 168px. Bottom row: lede on columns 1–6, CTA row on columns 8–12, right-aligned. The archwire runs full-bleed through the x-height of line 2. "Scroll to begin treatment" cue centered at the bottom. | Same rows. Lede on columns 1–8, CTA row left-aligned beneath it. | H1 40–48px, still three lines (each line sized to fit 375px). Meta wraps to two lines and drops the podcast fact. The button sits above the text link. Scroll cue hidden. |

| | |
|---|---|
| **Visual elements** | Operatory light (a cool white core with a Signal halo, at most 16% opacity) · Signal archwire · midline · grain |
| **Interactions** | Desktop: the light follows the cursor (lerp 0.06). Touch: the light drifts on its own over about 30 seconds. CTA hover lengthens the button wire (1.75 → 3rem). The link underline tensions on hover. |
| **Motion** | On hand-off from the loader: the light powers on (1.4s, with a dip) → each glyph moves from crowded (±8°, ±0.07em) into alignment over 2.4s, 18ms stagger → the wire relaxes from a damped wave to a straight line over 2.6s. The scroll cue loops on a 2.4s cycle. |
| **Transition to 02** | Hard cut to the light scene. The nav switches to the full-color logo as section 02 crosses the probe line. |
| **Accessibility** | The H1 carries an `aria-label` with the full sentence; the glyph spans are `aria-hidden`. The text is readable from the first frame. The meta row is a `<ul>`. |
| **Analytics** | `cta_click{hero}`, `cta_click{hero-results}`, `scroll_act{top}` |
| **CMS** | `hero.meta[]`, `hero.lines[3]`, `hero.emphasis`, `hero.lede`, `hero.primaryCta`, `hero.secondaryCta` |

---

### 02 · Act I: Diagnosis

| | |
|---|---|
| **Job** | Show empathy by naming the visitor's problem in their own language, before offering anything. |
| **Visitor question** | *Do they understand my problem?* |
| **Eyebrow** | `ACT I — DIAGNOSIS` |
| **Headline (H2)** | **Your market is *crowded.*** |
| **Supporting copy** | Every practice in your zip code promises a free consult, flexible financing and the latest technology. To a parent comparing options at 11:48 p.m., you all look the same. |
| **Resolution (H3)** | **We don't push harder. / *We create space.*** |
| **Resolution copy** | You never force a tooth into a crowded arch — you make room first. Marketing works the same way. We find the space in your market no one else occupies, then move your practice into it. |
| **CTA** | None, deliberately. This beat is emotional. The nav CTA is still available. |

**Layout**

| Desktop | Tablet | Mobile |
|---|---|---|
| A 300vh scroll track with a sticky 100svh stage. Header: eyebrow and H2 on columns 1–7, copy on 9–12. Fourteen claim chips cluster at 58% of the stage height. The resolution is centered on the midline. | H2 full width, copy on columns 1–8 below it. | Track kept at 300vh. Chips at 0.85rem. End state is four tidy rows (4·3·4·3) above and below the resolution. Copy at 14px. |

**Scroll choreography** (p = progress through the track, 0–1)

| p | What happens |
|---|---|
| 0–0.10 | The claims sit crowded: overlapping and rotated up to ±17° |
| 0.10–0.60 | The claims spread to the periphery (settle easing). Rotation goes to 0°, opacity to 20% (12% on mobile). |
| 0.16–0.40 | The header lifts 40px and fades out |
| 0.48–0.76 | The resolution aligns into the empty center (from 30px and −1.6° to rest) |
| 0.76–1.0 | Hold, so the line can be read |

| | |
|---|---|
| **Visual elements** | Chips styled as generic category noise: pills, stars, all-caps, cyan `#19B3C4` (its only appearance) |
| **Transition to 03** | Hard cut to dark |
| **Accessibility** | The chips are `aria-hidden` and all meaning is in the text. **Reduced motion:** a static layout of the header, then the resolution; the chips are hidden and the track collapses to its natural height. |
| **Analytics** | `scroll_act{crowding}` |
| **CMS** | `diagnosis.headline`, `diagnosis.copy`, `diagnosis.claims[]`, `diagnosis.resolution`, `diagnosis.resolutionCopy` |

---

### 03 · Act II: Treatment plan

| | |
|---|---|
| **Job** | Explain the services in a structure orthodontists already trust. |
| **Visitor question** | *What do you actually do?* |
| **Eyebrow** | `ACT II — TREATMENT PLAN` |
| **Headline (H2)** | **Four phases. / *One continuous force.*** |
| **Lede** | Every engagement follows the arc of good treatment: thorough records, a precise plan, steady movement, and a retention phase that protects the result. |

**Phase content (final copy)**

| # | Label | Headline (H3) | Copy | Deliverables | Clinical parallel | Timeline |
|---|---|---|---|---|---|---|
| 01 | Records | Before we move anything, we measure *everything.* | We start the way you do: with records. A full diagnostic of your market — competitors, search demand, referral patterns, reviews, and the real reasons patients choose one practice over another. | Market cephalometrics (competitive audit) · Search & demand analysis · Brand positioning · Analytics & call-tracking baseline | Photos, scans and a lateral ceph before any appliance goes on. | Weeks 1–4 |
| 02 | Alignment | An identity and website that feel like your *best appointment.* | Your brand and website are where a parent decides whether to trust you. We design both from the ground up — identity, photography, film, and a site engineered to turn attention into booked consultations. | Brand identity systems · Custom websites · Photography & film direction · Conversion & booking architecture | Brackets bonded, archwire engaged — the system that carries all future movement. | Months 1–4 |
| 03 | Force | Steady pressure. *Never a burst.* | Local SEO, Google Business Profile, paid search and paid social, tuned month by month. Not campaigns that spike and vanish — a continuous, measured force that moves your practice up the map and keeps it there. | Local SEO & map pack · Paid search & paid social · Content & video · Monthly force reports | Light, continuous force — the biomechanical principle behind efficient tooth movement. | Ongoing, adjusted monthly |
| 04 | Retention | The work doesn't end *at debond.* | Reviews, reputation, social storytelling and referring-doctor relationships — the retention phase that protects every result and turns finished patients into your most persuasive marketing. | Review generation & reputation · Social storytelling · Referring-doctor programs · Patient reactivation | Retainers hold the result. Without them, everything drifts back. | For the life of the practice |

| | |
|---|---|
| **CTA** | None inline on the homepage. In production, each phase ends with a text link, *How Records works →*, pointing to `/treatment/[phase]`. |

**Layout**

| Desktop | Tablet | Mobile |
|---|---|---|
| Intro: H2 on columns 1–8, lede on 9–12. Body is a 5/7 split. **Left:** a sticky 100svh rail with a giant numeral (7–19rem) and a vertical wire (52svh) carrying four labeled brackets. **Right:** four phase articles, each at least 100svh, vertically centered, with a three-column spec grid. | The rail retires. Each phase shows its own numeral (5–9rem) above its label. Spec grid in two columns (deliverables full width). | As tablet. Spec grid in one column. Phase padding 96px. |

| | |
|---|---|
| **Motion** | As each phase crosses the 45–55% viewport band, the active numeral aligns in (from 0.12em and −6°) while the previous one rotates out (−0.1em, 3°). Brackets fill with Signal up to the active phase. The wire fills continuously with scroll. Headlines align in. |
| **Transition to 04** | Hard cut to light |
| **Accessibility** | The rail is `aria-hidden` (it duplicates the phase content). Phases are `<article>` elements with an `<h3>`; specs are `<dl>`. |
| **Analytics** | `scroll_act{treatment}` · production adds `phase_view{n}` |
| **CMS** | `phase{number, name, headline, emphasis, copy, deliverables[], clinicalParallel, timeline, link}` |

---

### 04 · Act III: Before / After

| | |
|---|---|
| **Job** | Proof, using the format orthodontists already trust most. |
| **Visitor question** | *Does it work?* |
| **Eyebrow** | `ACT III — BEFORE / AFTER` |
| **Headline (H2)** | **Same practice. / *Different market.*** |
| **Lede** | Orthodontists trust a before-and-after more than any claim. So do we. Drag the wire — then take the radiograph. |

**Components, top to bottom**

1. **Compare frame.** A browser-chrome bar (URL on the left, a **Radiograph view** toggle on the right) above a stage that layers the *before* site (a generic template) under the *after* site (the practice's own brand). An Ortho Blue archwire divider with a bracket handle sits between them. Tags read "Before · Template" and "After · Ortho Marketing".
2. **Metrics** [illustrative], set as cephalometric annotations (a landmark dot, a leader line, a display number and a mono caption):
   - **+212%**: organic consultation requests, 12 months
   - **9/11**: target zip codes where the practice holds #1 in the map pack
   - **−38%**: cost per new-patient start
3. **Doctor's words** [illustrative]: *"They spoke to us like clinicians, not customers. Eighteen months later, our schedule looks like a different practice."* — Practice owner, Alder Lane Orthodontics
4. **Disclosure line** (remove once real data is in): "Illustrative case, figures and quote for concept presentation."

**Layout**

| Desktop | Tablet | Mobile |
|---|---|---|
| Header in the 8/4 split. Frame at full content width, 16:9.4. Metrics in three columns. Quote on columns 3–10 with a top hairline. | Frame at full width. Metrics in three columns. Quote full width. | Frame full-bleed (no side borders), 4:3. Secondary copy inside the mockups is hidden so they stay legible. Tags move to the bottom. Metrics stacked. Quote full width. |

**Interactions**

| Input | Behavior |
|---|---|
| Pointer | Drag anywhere on the stage (pointer capture). The divider maps exactly to the cursor. Vertical page scroll still works on touch (`touch-action: pan-y`). |
| Keyboard | A native range input: ←/→ 1%, PgUp/PgDn 10%, Home/End. A focus ring appears on the frame. |
| First view | A demonstration sweep, 50 → 30 → 64 → 50% at 900ms per segment, to teach the gesture. It cancels on any input. |
| **Radiograph view** | A toggle button (`aria-pressed`). **On:** the divider slides to 2% so the whole after site is visible. A Signal scan line sweeps across (1.4s), the site turns into its radiograph (skeleton outlines of the nav, plate, copy and strip on blue-black graph paper), and four data tags align in on a stagger (300–750ms): *Map pack #1 · 9 of 11 target zips* / *Organic consult requests +212%* / *LCP 0.9s · real photography* / *Reviews 4.9 · 640 · reply time < 24h* [illustrative]. **Off:** returns to the normal view. |

| | |
|---|---|
| **Motion** | Metrics and quote align in. The data tags stagger in. Nothing moves until it's in view. |
| **Transition to 05** | Hard cut to dark |
| **Accessibility** | The mockups are `aria-hidden`; the metrics and quote are the text equivalent. The range has a visually hidden label and `aria-valuetext` ("62% of the redesigned website visible"). The toggle exposes its state with `aria-pressed`. |
| **Analytics** | `compare_interact{pointer|keyboard|xray}` (first interaction only), `xray_toggle{on}`, `scroll_act{results}` |
| **CMS** | `case{practice, url, before{image|video}, after{image|video}, metrics[{value, label, period, source}], quote{text, name, role, practice, city, permission}, xray[{label, x, y}]}` |
| **Production** | Replace the CSS mockups with real screenshots (2560×1500 AVIF) or recorded scroll videos. The radiograph overlay is an annotated wireframe exported from Figma, on the same coordinate system. |

---

### 05 · Act IV: The family

| | |
|---|---|
| **Job** | Build human trust. Show the people and the values. |
| **Visitor question** | *Can I trust them?* |
| **Eyebrow** | `ACT IV — THE FAMILY` |
| **Headline (H2)** | **A family practice, *for family practices.*** |
| **Supporting copy** | Ortho Marketing has been family-run since 2008. So are many of the practices we serve — parents and children, partners of thirty years, associates who became owners. We know what it means to build something with your name on it, and to protect it for the next generation. |
| **Facts** | Founded: 2008 · Structure: Family-run · President: Dean Steinman, 25+ years in orthodontic & dental marketing · Specialism: Orthodontic practices [verify all] |
| **CTA** | None on the homepage. In production, a text link *Meet the team →* to `/studio`. |

| Desktop | Tablet | Mobile |
|---|---|---|
| Portrait plate on columns 1–5 (4:5), text on 7–12, facts as a 2×2 grid. | Plate on columns 1–6, text on 7–12. | Plate, then text, stacked. Facts in one column. |

| | |
|---|---|
| **Visual elements** | Portrait of the President: north window, 85mm, one key light, negative fill (Creative Direction §9). The prototype shows the lighting plan as a placeholder. |
| **Motion** | Plate and H2 align in. Production: the portrait drifts up to 6% against the frame (plane 2 parallax). |
| **Accessibility** | Portrait alt text: "Dean Steinman, President of Ortho Marketing, in the studio." |
| **Analytics** | `scroll_act{studio}` |

---

### 06 · Act V: Live

| | |
|---|---|
| **Job** | Authority, plus a soft conversion for visitors who aren't ready to book. |
| **Visitor question** | *Do they know my industry?* |
| **Kicker** | `● ON AIR` (the only pulsing element on the site) |
| **Headline (H2)** | **Ortho Marketing *Live.*** |
| **Supporting copy** | Conversations with the orthodontists, operators and specialists redefining practice growth. Hosted by Dean Steinman. |
| **Episodes** [verify titles and numbers] | **Ep. 172** · Streamlining your practice with virtual assistants · *with the COO of MyOrthoVA* / **Ep. 168** · Bringing past patients back · *with Blair Feldman, Retainer Club* / **Ep. 79** · Protecting your practice website from hackers · *with our SEO manager* |
| **CTA** | Text link: *Listen to every episode* (to `/live`) |

| Desktop | Tablet | Mobile |
|---|---|---|
| Header in the 8/4 split. Waveform 120px tall, 112 bars. Episode rows: number (7rem) · title (d3) · guest (18rem) · play (3rem). | Rows: number · title with the guest beneath it · play | As tablet with a 5rem number column. Waveform 48 bars. |

| | |
|---|---|
| **Interactions** | Rows link to `/live/[episode]`. On hover, a Signal wire draws across the row (1.4s) and the play bracket fills with Ortho Blue. Production phase 2: an inline mini-player with a persistent bottom player. |
| **Motion** | The On-air lamp pulses on a 2.6s cycle. Waveform bars oscillate (1.8s, alternating); the played portion (31%) is in Signal. Pause both when off-screen. |
| **Accessibility** | The waveform is `aria-hidden`. Episodes are an `<ol>`, and each link's accessible name is its title. |
| **Analytics** | `episode_click{episode}`, `cta_click{live-all}` |
| **CMS** | The latest three entries from the `Episode` type, synced from the podcast RSS feed |

---

### 07 · Act VI: Your first visit

| | |
|---|---|
| **Job** | Risk reversal and objection handling, right before the ask. |
| **Visitor questions** | *What happens if I reach out?* · *What about my concerns?* |
| **Eyebrow** | `ACT VI — YOUR FIRST VISIT` |
| **Headline (H2)** | **What happens *when you reach out.*** |
| **Lede** | No pitch deck. No pressure. A consultation built like a records appointment — so the first conversation is already useful. |

**Three steps** on one wire

| Step | Meta | Title | Copy |
|---|---|---|---|
| 01 | About 3 minutes | **Records** | Tell us about your practice in four short steps. Before we speak, a strategist reviews your market, your search presence and your reviews. |
| 02 | 30 minutes | **Consultation** | A video or phone call with a strategist — not a salesperson. We walk you through what we found, including what you're already doing well. |
| 03 | Yours to keep | **Treatment plan** | A written plan with priorities, milestones and a clear investment. It's yours to keep, whether or not we work together. [verify policy] |

**FAQ: "Before you book"**

| Question | Answer |
|---|---|
| Do you only work with orthodontists? | Orthodontic practices are our specialism — it's in our name. Our strategy, our creative and our podcast are built around how patients and parents actually choose an orthodontist. [verify] |
| How soon will we see results? | Paid search can generate consultation requests within weeks. Organic search, reviews and reputation compound over months. Your treatment plan sets milestones for both, and monthly force reports show progress against them. |
| Do we need a new website? | Not always. Records tell us whether your current site can be aligned or should be rebuilt. If it's working, we'll tell you. |
| We already have an agency. Can we still book? | Yes. Many consultations are second opinions. You'll leave with an objective read on what's working, whatever you decide. |
| What does it cost? | Investment depends on your market, your goals and the phases you need. Your treatment plan states it clearly — no surprises. |

| Desktop | Tablet | Mobile |
|---|---|---|
| Header in the 8/4 split. Steps in three columns hanging from a horizontal wire, one bracket per step. FAQ title on columns 1–4, list on 5–12. | Steps in three columns. FAQ title above the list. | Steps stacked on a **vertical** wire down the left edge. FAQ full width. |

| | |
|---|---|
| **Interactions** | The FAQ uses native `<details>`/`<summary>`. Each answer has a square icon that changes from + to − and fills with Ortho Blue when open. Height animates with `::details-content` and `interpolate-size`; other browsers open instantly. |
| **Motion** | When the steps come into view, the wire draws (1.6s) and the brackets engage one after another (300ms, then every 450ms). Steps align in. |
| **CTA** | None. The finale, directly below, is the ask. |
| **Accessibility** | Steps are an `<ol>`. Summaries are at least 44px tall. Disclosure state is announced natively. |
| **Analytics** | `faq_open{question}`, `scroll_act{first-visit}` |
| **CMS / SEO** | `steps[]`, `faqs[{q, a}]`. Output `FAQPage` structured data. |

---

### 08 · Finale: Debond

| | |
|---|---|
| **Job** | The ask. |
| **Visitor question** | *Let's go.* |
| **Eyebrow** | `FINALE — DEBOND` |
| **Headline (H2)** | **Let's see where your practice *could be.*** |
| **Supporting copy** | Begin with a records appointment for your brand. We map your market, audit your search presence and walk you through a treatment plan. |
| **CTA** | **Primary (lg):** *Begin your consultation* · **Secondary:** *Or listen first* (to §06) |
| **Assurance** | `30 MINUTES · WITH A STRATEGIST · PLAN IS YOURS TO KEEP` [verify] |

| Desktop | Tablet | Mobile |
|---|---|---|
| 115svh. The arch (a 1200×760 SVG) is centered behind the text, and the text is centered on the midline. This is the site's only symmetrical composition. | Same, with the arch at 120vw. | The arch becomes a standalone graphic above the text (max 420px) so it never sits behind body copy. |

| | |
|---|---|
| **Motion** | The wire draws along the arch as the section's center travels from 115% to 55% of the viewport. Fourteen brackets (molar → incisor → molar, sized like the teeth) snap from crooked (±25°, scale 0.4) into alignment with the debond spring, the site's only overshoot. |
| **Transition to the conversion** | Clicking the CTA starts **the Orb flood**: an Ortho Blue circle expands from the button's center to cover the viewport (`clip-path: circle()` from 0 to 150%, 900ms force). The form aligns in at +350ms. See §5. |
| **Accessibility** | The arch is `aria-hidden`. The CTA is a real link (`href="#consultation"`, which is `/consultation` in production), so it works without JavaScript. |
| **Analytics** | `cta_click{finale}`, `cta_click{finale-listen}` |

---

### 09 · End credits (Footer)

| | |
|---|---|
| **Job** | Closure, plus utility navigation. |
| **Content** | Reversed logo → "presents" → **Light, *Continuous* Force** → credits: *Starring:* Your practice · *Treatment:* Strategy · Identity · Websites · Search · Reputation · *Filmed on location:* In every zip code you serve · *Running time:* 18 to 24 months. Then, for as long as you practice. |
| **Base row** | Footer nav (Treatment · Results · Studio · Live · First visit · **Consultation**, which opens the overlay) · © 2026 Ortho Marketing · Family-run since 2008. Production adds: address, phone, email [client to supply] · podcast platforms · social links · Privacy · Terms · Accessibility statement. |
| **Layout** | Centered credit roll, then the base row (nav across the full width, legal beneath). Mobile: everything stacks. |
| **Accessibility** | `<footer>` landmark containing `<nav aria-label="Footer">`. Links have at least 44px tap height (with block padding). |

---

## 5. The conversion flow: the records appointment

### 5.1 Entry points

| Trigger | Location | `source` |
|---|---|---|
| *Book a consultation* / *Consult* | Nav (all breakpoints) | `nav` |
| *Begin your consultation* | Hero | `hero` |
| *Begin your consultation* | Menu overlay | `menu` |
| *Begin your consultation* | Finale | `finale` |
| *Consultation* | Footer nav | `footer` |
| `#consultation` deep link | Emails, ads | `unknown` (plus UTM parameters) |
| `/consultation` | Standalone page for paid traffic (same component, no flood) | `page` |

### 5.2 Open and close choreography

| Phase | Behavior |
|---|---|
| **Open** | The Ortho Blue flood expands from the trigger's center (900ms force) → content fades and aligns in at +350ms → focus moves to the step title at +450ms. The background becomes `inert`; page scroll is locked. |
| **Step change** | The new step aligns in (from −12px and 16px, −1.4°, over 1.4s). A bracket on the progress wire engages and the fill advances. The live region announces "Step 2 of 4". Focus moves to the new step title. |
| **Close** | Close button or Escape → the flood contracts back to the trigger (600ms settle) → focus returns to the trigger. `consultation_abandon{step}` fires if the form wasn't submitted. The draft is kept. |
| **Reduced motion** | No flood animation; the blue surface appears instantly. Focus behavior is unchanged. |

### 5.3 Layout

- **Sticky header:** white logo · `RECORDS APPOINTMENT` · *Close ✕*. It stays visible while the form scrolls on small screens.
- **Progress:** a white wire with four brackets labeled *Practice · Goals · Today · Contact*. Brackets fill as steps are completed.
- **Step:** mono "Step 0X of 04", a display question (H2 size), then the fields. Content is at most 860px wide, centered.
- **Navigation row:** *Back* (hidden on step 1) · **Continue** (**Request consultation** on step 4) · `SAVED AS YOU GO`

| Desktop | Tablet | Mobile |
|---|---|---|
| Two-column field rows where paired (city + locations, name + role, email + phone) | As desktop | Single column. Progress labels hidden (brackets only). Logo 20px. Kicker hidden. |

### 5.4 Steps and fields

| Step | Question | Field | Type | Required | Validation / autocomplete | Error copy |
|---|---|---|---|---|---|---|
| 1 | **Tell us about your practice.** | Practice name | text | ✓ | `organization` | We need your practice name to prepare your records. |
| | | Website | url | — | `url`, placeholder "yourpractice.com" | — |
| | | City & state | text | ✓ | `address-level2` | Add your city so we can map your market. |
| | | Locations | radio chips: 1 · 2–3 · 4+ | ✓ | — | Choose how many locations you have. |
| 2 | **What should move first?** *(Choose all that apply.)* | Goals | checkbox chips: More new-patient starts · More adult patients · A new website · A rebrand · Reviews & reputation · A new location · Recover from a slow year | at least 1 | — | Choose at least one goal. |
| 3 | **Where are you today?** | Your marketing today | radio chips: In-house · Another agency · Not much yet | ✓ | — | Tell us how your marketing runs today. |
| | | Monthly marketing investment | select: Prefer not to say · Under $3,000 · $3,000–$6,000 · $6,000–$12,000 · $12,000+ | — | Defaults to "Prefer not to say" | — |
| | | Anything we should know? | textarea | — | Placeholder: "A new competitor, a partner retiring, a second location opening…" | — |
| 4 | **Where should we send your plan?** | Your name | text | ✓ | `name` | Please add your name. |
| | | Your role | select: Orthodontist / owner · Practice manager · Marketing lead · Other | — | — | — |
| | | Email | email | ✓ | `email`, format check | We need a working email to send your treatment plan. |
| | | Phone | tel | — | `tel` | — |
| | | Best time to talk | radio chips: Morning · Midday · Afternoon | — | — | — |

### 5.5 Validation and errors

- Fields are validated when the visitor presses Continue, never while they type. Errors clear as soon as the field changes.
- Errors appear inline under the field, prefixed with "!", in `#FFD7D0` on blue (5.6:1). The field's underline turns the same color.
- `aria-invalid="true"` plus `aria-describedby` link each field to its error. **Focus moves to the first invalid field.**
- No red, and no modal alerts.

### 5.6 Draft persistence

Every change saves `{step, values}` to `localStorage`. Reopening resumes at the saved step with the values filled in. The draft is cleared on submit. This is a convenience for the visitor's own device only; nothing depends on it.

### 5.7 Submission (production)

```jsonc
POST /api/consultation        // server forwards to the agency CRM [decide: HubSpot / Salesforce / other]
{
  "practice": "Harbor Point Orthodontics",
  "website": "harborpointortho.com",
  "city": "Stamford, CT",
  "locations": "2-3",
  "goals": ["starts", "reputation"],
  "current": "agency",
  "budget": "$3,000–$6,000",
  "notes": "",
  "name": "Jordan Reyes",
  "role": "Orthodontist / owner",
  "email": "jordan@…",
  "phone": "",
  "time": "morning",
  "meta": {
    "source": "finale",                 // which CTA opened the form
    "utm": { "source": "", "medium": "", "campaign": "", "term": "", "content": "" },
    "gclid": "", "fbclid": "",
    "landing_page": "/", "referrer": "",
    "submitted_at": "ISO-8601"
  }
}
```

- **UTM and click IDs** are captured on the first page view into `sessionStorage` and attached to the submission.
- **Spam protection:** a honeypot field plus server-side rate limiting. Add a CAPTCHA only if abuse appears.
- **While sending:** the button shows `aria-busy` and reads "Sending…".
- **Failure:** an inline message, "We couldn't send your records. Please try again, or email [address]." All values are kept.
- **Notifications:** an internal alert to the strategist team with the full record, and an automatic reply to the prospect (subject: *Records received — {Practice}*).

### 5.8 Confirmation

| Element | Content |
|---|---|
| **The Orb** | A white sphere with a blue crescent lands (scale 0.4 → 1 with −20° rotation, 2.4s), then **smiles** (the crescent opens, 900ms). |
| Kicker | `RECORDS RECEIVED` |
| Headline | **Thank you, {first name}.** |
| Copy | A strategist will review **{Practice}**'s market before your consultation, then email you to confirm a time. |
| Next steps | 01 We review your records — search, reviews, competitors. · 02 We email you to schedule thirty minutes. · 03 You receive your treatment plan. |
| CTAs | **Listen while you wait** (closes the overlay and scrolls to Live) · *Back to the site* |
| **Production upgrade** | Embed the agency's scheduler (Calendly or HubSpot Meetings) under the next steps so prospects can choose a time immediately, and change the copy to "Choose a time that suits you." [decide] |

Focus moves to the confirmation container. Closing and reopening the overlay starts a fresh, empty form.

### 5.9 Analytics funnel

`consultation_open{source, resumed_step}` → `consultation_step{1…4}` → `consultation_error{step, fields}` → **`consultation_submit{source, locations, goals}`** / `consultation_abandon{step}`

**No personally identifiable information goes into the dataLayer.** Ad-platform conversion tags (Google Ads, Meta) fire on `consultation_submit` only.

---

## 6. Secondary pages

Each one reuses homepage components; there's no new visual language. Sections are listed in order.

| Page | Sections in order |
|---|---|
| **/treatment** | Hero ("Four phases. *One continuous force.*" with the 01–04 numerals as an index) → Phase index (four rows, each linking to its phase) → How an engagement runs (milestone wire) → Case strip (two before/afters) → First visit (three steps) → Debond CTA → Credits |
| **/treatment/[phase]** | Hero (giant numeral, headline, clinical parallel) → What it is (deliverables as spec rows) → How it moves (milestones on a wire) → Signature visual (*Alignment* uses the bracket-macro and radiograph plate from the Creative Direction; *Force* uses a market-ceph chart; *Records* an audit sample; *Retention* a reviews timeline) → Related case → Phase FAQ (3–5 questions) → *Next phase →* → Debond CTA |
| **/results** | Hero ("Same practice. *Different market.*") → Filter chips (*Start-up · Growth · Multi-location · Rebrand · Recovery*) → Case grid as "patient files" (hovering scrubs before/after; one metric per card) → Doctor quote → Debond CTA |
| **/results/[case]** | Case file: Records (situation and market ceph) → Diagnosis (one-line insight) → Treatment plan (the homepage rail) → Before / After with radiograph → Results (3–5 metrics with period and source) → Doctor's words (60–90s film and quote) → Retention (what's ongoing) → *Next case →* → Debond CTA |
| **/studio** | Cold open portrait → Since 2008 timeline wire → Care team grid (every portrait lit the same way) → How we work (four principles) → Live teaser → Debond CTA |
| **/live** | On-air hero with the latest episode player → Episode list (search, filter by topic) → Subscribe row (platform links) → Soft CTA ("Rather talk to us directly?") |
| **/live/[episode]** | Player (waveform with chapter markers) → Guest (studio-lit portrait) → Show notes → Full transcript → Related episodes → CTA |
| **/consultation** | The overlay component as a standalone page (no flood). Closing it goes back to the referrer or the homepage. |
| **404** | "This page has drifted. *Without retention, everything does.*" → links to the five main sections → primary CTA |
| **Legal** | Privacy · Terms · Accessibility statement (simple text layout) |

---

## 7. Responsive matrix

| Element | Desktop (≥1200) | Tablet (768–1199) | Mobile (≤767) |
|---|---|---|---|
| Loader | Orb 156px | Orb about 18vmin | Orb 88px+ |
| Nav | Logo · 5 links · CTA | Logo · CTA · Menu | Logo (22px) · "Consult" · Menu |
| Menu | — (inline links) | Full-screen circle reveal | Full-screen circle reveal |
| Hero H1 | Up to 168px, columns 1–8 | Fluid, about 80–110px | 40–48px, three lines |
| Hero CTAs | Right-aligned on columns 8–12 | Left-aligned under the lede | Button above link |
| Operatory light | Follows the cursor | Drifts on its own | Drifts on its own |
| Diagnosis | Elliptical spread | Elliptical spread | Four tidy rows |
| Treatment rail | Sticky numeral and wire | Retired; numeral inline per phase | Retired; numeral inline per phase |
| Spec grid | 3 columns | 2 columns | 1 column |
| Compare frame | 16:9.4, bordered | 16:9.4 | 4:3, full-bleed, simplified mockups |
| Radiograph tags | 4 | 4 | 3 (strip tag hidden) |
| Metrics | 3 columns | 3 columns | Stacked |
| Studio | Plate 5 / text 6 | Plate 6 / text 6 | Stacked |
| Episodes | 4-column row | Number · title + guest · play | Same as tablet |
| Steps | 3 columns on a horizontal wire | 3 columns on a horizontal wire | Stacked on a vertical wire |
| FAQ | Title 4 / list 8 | Stacked | Stacked |
| Debond arch | Behind the text | Behind the text (120vw) | Standalone above the text |
| HUD | Full label | Full label | Numbers only |
| Consultation | 2-column field rows, labeled progress | 2-column field rows | 1 column, unlabeled brackets, sticky header |

---

## 8. Accessibility specification

**Target: WCAG 2.2 AA.**

### 8.1 Keyboard map

| Context | Keys | Result |
|---|---|---|
| Page | Tab / Shift+Tab | Skip link → logo → nav links → CTA → Menu → content in reading order |
| Compare | Tab to the slider; ←/→, PgUp/PgDn, Home/End | Moves the divider; the frame shows a focus ring |
| Radiograph | Enter / Space | Toggles the view (`aria-pressed`) |
| FAQ | Enter / Space on a question | Opens or closes the answer |
| Menu / Consultation | Tab is trapped inside; Escape closes | Focus returns to the element that opened it |
| Consultation chips | Arrow keys within a radio group; Space for checkboxes | Native behavior on hidden inputs, with visible focus |

### 8.2 Screen readers

- **Landmarks:** `header`, `nav` (Primary and Footer), `main`, `footer`. The menu and consultation are dialogs (`role="dialog"`, `aria-modal`, labeled).
- **Headings:** H1 (hero) → one H2 per act → H3 for phases, steps, the FAQ title and the resolution line.
- **Live region:** "Step N of 4" is announced on every step change in the consultation.
- **Decorative elements** are `aria-hidden`: the midline, grain, HUD, archwires, chips, rail, waveform and arch.
- **Split-text headline:** the full sentence is the heading's accessible name.

### 8.3 Reduced motion (`prefers-reduced-motion: reduce`)

| Moment | Reduced alternative |
|---|---|
| Loader | Skipped |
| Cold open | Text already aligned; wire straight; light static |
| Diagnosis | Static header and resolution; chips hidden; no scroll track |
| Treatment rail | Numerals swap instantly |
| Alignment reveals | Content visible immediately |
| Compare | No demo sweep; radiograph appears instantly |
| Steps | Wire and brackets already engaged |
| Debond | Arch drawn in full, brackets aligned |
| Menu and consultation | Appear instantly (no clip-path flood) |
| Waveform, On-air lamp, grain | Static |

### 8.4 Other requirements

- **Contrast:** see §2.2. All text pairs meet AA. Ortho Blue on dark is used for fills only.
- **Targets:** every control is at least 44×44px (chips, summaries, buttons, menu, close).
- **Forms:** visible labels, `autocomplete` values, errors linked with `aria-describedby`, no reliance on placeholder text.
- **Reflow:** usable at 320px width and at 200% zoom, with no horizontal scroll (verified at 390px).
- **Test plan:** automated axe checks in CI, a keyboard-only pass, VoiceOver (macOS and iOS), NVDA on Windows, and a reduced-motion pass.

---

## 9. Performance & build

### 9.1 Loading strategy

- **The LCP element is the H1 text,** rendered in HTML underneath the loader. The loader never delays it.
- **Inline critical CSS.** Preload the display face (Light and Italic) and the text face (Regular). Use `font-display: swap`. The loader hides the swap on first visit.
- **JavaScript:** a core bundle (nav, scenes, reveals, menu, consultation; about 12KB gzipped) plus scene modules (crowding, compare, arch) loaded with dynamic `import()` when an IntersectionObserver sees them approaching.
- **Images:** AVIF/WebP with `srcset` (640–2560w), lazy below the fold, explicit dimensions to avoid layout shift.
- **Animation:** `transform` and `opacity` only. One rAF loop. Waveform and lamp animations pause off-screen.

### 9.2 Budgets

| Metric | Budget |
|---|---|
| LCP (4G, mid-range phone) | under 1.8s |
| CLS | under 0.05 |
| INP | under 150ms |
| JS on the homepage | 90KB gzipped or less |
| Fonts | 160KB woff2 or less in total |
| Hero imagery | None (text hero) |

### 9.3 Recommended stack

Astro or Next.js (static output) · Sanity CMS · GSAP + ScrollTrigger (the prototype's choreography maps one to one) · View Transitions API for page transitions · a serverless function for `/api/consultation` connected to the CRM · GTM dataLayer.

### 9.4 Prototype → production map

| Blueprint section | Prototype source |
|---|---|
| 00 Loader | `main.js` §1 · `styles.css` "00 · LOADER" |
| 01 Cold open | `main.js` §2 · "01 · COLD OPEN" |
| 02 Diagnosis | `main.js` §3 · "02 · ACT I" |
| 03 Treatment plan | `main.js` §4 · "03 · ACT II" |
| 04 Before / After + radiograph | `main.js` §5 · "04 · ACT III" |
| 06 Live | `main.js` §6 · "06 · ACT V" |
| 07 First visit + FAQ | `main.js` §7, §9 · "07 · ACT VI" |
| 08 Debond | `main.js` §8 · "08 · FINALE" |
| Nav, menu, scenes, HUD | `main.js` §11–12 · "GLOBAL NAV + MENU" |
| Consultation | `main.js` §13 · "CONVERSION" |

### 9.5 Launch QA checklist

- [ ] Every [verify] fact confirmed; every [illustrative] item replaced
- [ ] Loader: skips on a second visit, on reduced motion and without JS; never exceeds 2.9s
- [ ] Nav: colors switch correctly in every scene; hides and reveals; scroll spy correct
- [ ] Menu and consultation: focus trap, Escape, focus return, `inert` background, scroll lock
- [ ] Consultation: validation on all four steps, draft resume, success and failure states, CRM record created, auto-reply sent, conversion tags fire once
- [ ] Compare: pointer, touch and keyboard; radiograph toggle; demo cancels on input
- [ ] Reduced-motion pass across every section
- [ ] axe: zero violations; keyboard-only and screen-reader passes completed
- [ ] Core Web Vitals within budget on a mid-range Android phone over 4G
- [ ] No horizontal scroll at 320, 375, 390, 768, 834, 1024, 1180, 1440 and 1920px
- [ ] Director's notes removed

---

## 10. Content & asset checklist

| Item | Owner | Needed for |
|---|---|---|
| Master logo vectors (SVG/AI); decision on a dark-ground variant | Agency | Nav, loader, overlay |
| Confirmed facts (2008, family-run, President's title and tenure, specialism, episode count) | Agency | 01, 05, 06 |
| 2–4 real case studies: before/after captures, metrics with period and source, doctor quote with written permission | Agency + clients | 04, /results |
| President portrait and team portraits (shot to the Creative Direction lighting plan) | Production | 05, /studio |
| Podcast RSS feed URL and platform links | Agency | 06, /live |
| Consultation policy: "plan yours to keep", response time, territory policy | Agency | 07, 08, confirmation |
| CRM endpoint and field mapping; strategist notification routing; auto-reply sender | Agency | §5.7 |
| Scheduler account (optional) | Agency | §5.8 |
| GTM container, Google Ads and Meta conversion IDs, consent tool | Agency | §5.9, §3.8 |
| Contact details (address, phone, email), social links, legal pages | Agency | 09 |
| Font licenses (GT Sectra Display, Söhne, Söhne Mono) | Agency | All |
