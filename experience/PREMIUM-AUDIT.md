# Premium agency audit

**Scope.** The new Ortho Marketing site in this repository: all 18 pages, the homepage's nine sections and the motion system. Each section was reviewed in viewport-sized frames at 1440 × 900 and 390 × 844, including progress points through the pinned scenes, hover states, the menu and the consultation flow. The live orthomarketing.com could not be reached from the audit environment (it's blocked by the network allowlist), so the audit covers the redesign that replaces it.

**Verdict before this pass.** The foundations were already premium: the hero typography and the 3D archwire, a disciplined palette (Ortho Blue never used as text on dark), the clinical "treatment" storyline, a coherent motion system, and fast pages. What let it down were **finishing problems**. Fixed layers collided with content. One image slot looked like a wireframe. Secondary pages fell back to a template. Some iconography contradicted itself. These are the things that make a crafted site read as "almost finished".

**How to read the ranking.**
- **Severity:** how much the issue damages trust in the craft. *Critical* means it is seen on almost every screen.
- **Impact:** how visible it is.
- **Priority:** P1 = fix now, P2 = this pass, P3 = next (needs assets, licenses or a larger build).

---

## Ranked issues

| # | Issue | Where | Severity | Impact | Priority | Status |
|---|---|---|---|---|---|---|
| 1 | The fixed "Treatment day" counter sits on top of content | Homepage, every section; worst on phones | Critical | High | P1 | **Fixed** |
| 2 | The fixed midline rule cuts through headings, body copy and the finale CTA | Homepage below Act I | High | High | P1 | **Fixed** |
| 3 | The studio portrait slot reads as an unfinished wireframe | Homepage Act IV, /studio/ | High | High | P1 | **Fixed** (interim); photography is P3 |
| 4 | Every secondary page hero is the same template, with an empty right half | 15 secondary pages | High | High | P1 | **Fixed** |
| 5 | "▶" play buttons on rows that navigate (there is no audio player) | Homepage Live, /live/, episode pages, /treatment/ | Medium | Medium | P1 | **Fixed** |
| 6 | The finale's brackets are flat cream squares that read as a loading spinner | Homepage finale | Medium | Medium | P1 | **Fixed** |
| 7 | The results index shows one small card floating in an empty section, with a crude two-color thumbnail | /results/ | High | Medium | P2 | **Fixed** |
| 8 | The 700px end-credits roll repeats under every page | All secondary pages | Medium | Medium | P2 | **Fixed** |
| 9 | Act I opens with claims piled into an illegible clump, words cut in half | Homepage Act I | Medium | Medium | P2 | **Fixed** |
| 10 | Ragged display headings: orphans and italic phrases split across lines | Site-wide | Medium | Medium | P2 | **Fixed** |
| 11 | The hero kicker wraps unevenly on phones | Homepage hero, mobile | Low | Low | P2 | **Fixed** |
| 12 | Stand-in typefaces (Fraunces, Hanken Grotesk) instead of the specified GT Sectra Display and Söhne | Site-wide | High | High | P3 | Needs licenses |
| 13 | No real photography or film anywhere | Studio, case files, alignment craft plate | High | High | P3 | Needs a shoot |
| 14 | On phones the hero arch shrinks to a thin strip, so the first screen reads as text only | Homepage hero, mobile | Medium | Medium | P3 | Recommended |
| 15 | Episode pages have no player; "Listen" leaves the site | /live/[episode]/ | Medium | Low | P3 | Recommended |
| 16 | The closing CTA band uses the same copy on most pages | Secondary pages | Low | Low | P3 | Recommended |
| 17 | The case file has wide empty gaps between its rows | /results/alder-lane/ | Low | Low | P3 | Recommended |

---

## Findings and fixes

### 1 · The HUD collides with content (Critical)
**Why it hurts.** A fixed element covering the content beneath it is the quickest way to make a site look broken. The counter sat at the bottom left of every screen and covered the +212% metric, episode titles, deliverables, the giant phase numerals and the finale arch. On a phone it covered something in almost every frame. Premium sites reserve space for their instruments.
**Fix (implemented).** The counter is now a **treatment ruler in the right margin**:
- **Layout:** a vertical label, a 1px wire with one tick every two months, a bracket that rides the wire as you scroll, and a stacked day/540 readout. It inherits the brackets-on-a-wire language and reads as a measuring instrument.
- **Placement:** it is shown only at ≥ 1200px, where the margin exists, so it never overlaps content. On smaller screens it is removed rather than squeezed.
- **Files:** `Hud.astro`, `scenes/hud.js`, `base.css`.

### 2 · The midline cuts through copy (High)
**Why it hurts.** The 1px vertical axis is the hero's alignment line. Below Act I it was still running down the center of the screen through "Consultation", the finale headline and even the CTA button, where it looks like a rendering bug.
**Fix (implemented).** The midline powers on with the hero as before and **rests (fades out) once Act I resolves**. Inside a scene it means something; elsewhere it's gone. (`scenes/hud.js`, `base.css`)

### 3 · The studio plate looks like a wireframe (High)
**Why it hurts.** The largest image slot on the homepage showed faint grey linework on a grey box. It reads as "image goes here", in the section meant to build human trust.
**Fix (implemented, interim).** **Plate 07 · Lighting test**:
- **The subject:** the Orb, rendered as a physical object and lit exactly as the portrait will be. North-window key from the upper left, negative fill on the camera's right, an Ortho Blue floor bounce and a contact shadow.
- **The lighting plan** sits around it as quiet linework.
- **On a fine pointer the cursor becomes the key light:** the specular highlight, window spill and shadow move with it, on the shared motion clock.
- **The caption says what it is.** It's honest, on-brand and finished-looking.

**Still required (P3):** the real portrait session. (`PortraitPlate.astro`, `scenes/plate.js`, `home.css`)

### 4 · Secondary heroes are generic (High)
**Why it hurts.** Fifteen pages opened with the same composition: a left-aligned headline over an empty dark field. The homepage feels authored; the rest of the site felt like a theme.
**Fix (implemented).**
- **The arch:** every page hero now carries **the same archwire**, rising across the right half with six steel brackets. It draws on and the brackets seat in sequence on arrival, so each page reads as a step along one continuous treatment.
- **Phase pages light their bracket in Ortho Blue,** so Records through Retention show where you are in the plan.
- **Cost:** the arch is rendered at build time with CSS-only motion, so it adds no JavaScript and doesn't affect LCP. Reduced motion shows it already seated.
- **Measure:** the headline is capped (in em, so it stays stable across the font swap) so long titles never cross the arch.
- **Files:** `PageHero.astro`, `lib/bracket.js`, `pages.css`.

### 5 · Contradictory iconography (Medium)
**Why it hurts.** A play triangle promises audio. These rows navigate to another page, so the icon breaks a promise every time it's clicked. It was also the only glyph on the site outside the wire-and-bracket family.
**Fix (implemented).** The rows now use **the same wire-and-bracket arrow that follows every primary button**. It extends on hover and focus, as the button arrows do. (Live, EpisodeList, treatment index; `home.css`, `pages.css`)

### 6 · The finale brackets read as dots (Medium)
**Why it hurts.** The hero builds brackets in real perspective, with tie-wings, slots and specular light. The finale, the story's payoff, used rounded cream squares, which look like a loading spinner.
**Fix (implemented).** Each bracket is now drawn as a **bracket**: a base pad, the wire seated in the slot, and four steel tie-wings lit from above, sized by tooth from molar to incisor. The same glyph is used on every page hero. (`scenes/arch.js`, `Debond.astro`)

### 7 · The results index looks unfinished (High)
**Why it hurts.** The page that should prove the agency's work showed one 420px card with a flat blue-and-green split thumbnail, then empty space.
**Fix (implemented).** The lead case is now a **full-width feature case file**:
- **A miniature before/after:** the template site against the practice brand, with type that scales to its container.
- **All three results,** set as a measured list.
- **A clear read link** and a hover state.
- **Additional cases** fall back to the grid automatically. (`CaseCard.astro`, `cases.js`, `pages.css`)

### 8 · End credits everywhere (Medium)
**Why it hurts.** The credits roll ("Starring: your practice…") is the homepage's closing scene. Repeated under every page, it adds about 700px of scroll and turns a cinematic moment into boilerplate.
**Fix (implemented).** The **roll appears on the homepage only**. Every other page signs off with a compact line: the logo, "We move markets the way *you move teeth*", then navigation and legal. (`Footer.astro`, `BaseLayout.astro`)

### 9 · Act I opens illegibly (Medium)
**Why it hurts.** Crowding is the point, but claims stacked so tightly that words were sliced ("S…", "…day!") read as a layout glitch rather than intent.
**Fix (implemented).** Claims now **start crowded but legible**. Each one tries a few positions in the cluster and keeps the one it overlaps least, and the starting tilt is calmer. The market still reads as noise, and every claim can still be read as a cliché. (`scenes/crowd.js`)

### 10–11 · Typographic rag (Medium / Low)
**Why it hurts.** Headlines like "What happens *when you* / *reach out*." split the italic emphasis. A single orphaned word undoes the precision the display face is meant to signal. The hero kicker on phones wrapped to one long line plus an orphan.
**Fix (implemented).** Balanced wrapping on all display headings, the footer motto and the hero kicker.

### 12 · Stand-in typefaces (P3, licenses)
Fraunces and Hanken Grotesk are good open-source stand-ins, but the art direction specifies **GT Sectra Display** (sharper, more surgical serifs) and **Söhne**. The display face carries most of the brand's character, and the licensed face is the single largest remaining upgrade. Swap the families in `fonts.css` (see BUILD.md).

### 13 · No real photography (P3, shoot)
The site is deliberately image-light, which helps performance and is honest. But a family studio needs real faces, and case files need real screens. Shoot list:
- **The President's portrait,** using Plate 07's plan.
- **Team portraits,** with the same light.
- **Macro bracket stills** for the Alignment craft plate.
- **Real before/after screen captures** for each case file.

### 14 · Mobile hero framing (P3)
At 390px the 3D arch is solved for a landscape frame and ends up as a thin strip under the copy. Recommendation: on portrait screens, add a camera preset that lifts and crops the arch (fewer brackets, larger, rising behind the headline), so the first screen reads as cinematic on phones too.

### 15 · Episode playback (P3)
Embed the Apple Podcasts player on episode pages. Add `https://embed.podcasts.apple.com` to `frame-src` in `scripts/headers.mjs`, and keep the external link as a fallback.

### 16–17 · Repetition and rhythm (P3)
- **CTA band:** give each page's closing band its own line, tied to what the page just argued.
- **Case file:** tighten the row gaps (`--s-9` → `--s-8`) and add the full comparison earlier in the page.

---

## Verification

After the changes:
- **Tests:** html-validate 0 errors · axe-core 0 violations on every page at both widths, plus menu and overlay · 330/330 site checks · 20/20 motion checks · 12/12 function checks.
- **Performance** (slow 4G, 4× CPU, phone): LCP = FCP ≈ 1.0 s on every page, CLS ≤ 0.018, homepage TBT ≈ 190–205 ms.

One regression was caught and fixed during the pass. Capping the hero headline width had also squeezed it on phones, so it changed line count when the web font loaded (CLS 0.088). The cap now applies only where the arch is shown.
