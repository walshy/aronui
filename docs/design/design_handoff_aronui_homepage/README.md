# Handoff: Aronui Homepage (Concept A v2 — Product-first + NZ motif system)

## Overview
Aronui is a curriculum-aware planning platform for New Zealand English teachers, built on **Te Mātaiaho — the 2025 NZ English Curriculum**. This handoff covers the public marketing homepage: a product-first SaaS page (Linear/Vercel/Stripe register) whose hero is a live, interactive "Curriculum Planner" demo, with a switchable NZ-grounded motif system layered across the page.

Primary CTA: **Start Planning**. Secondary: **Explore Curriculum**.

## About the Design Files
The files in `design-files/` are **design references created in HTML** — a high-fidelity prototype showing intended look and behaviour, **not production code to copy directly**. The prototype uses React 18 UMD + Babel-in-browser for convenience; your task is to **recreate this design in the target codebase's existing environment** (Next.js/React, Vue, etc.) using its established patterns, build pipeline and component library. If no environment exists yet, a React + TypeScript + CSS-modules (or Tailwind with the tokens below) setup is the natural fit.

Open `design-files/concept-a-v2.html` in a browser to see the working reference (needs network access for Google Fonts + unpkg CDN).

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, iconography and interactions are final design intent. Recreate the UI pixel-faithfully. The only "dev-only" element is the floating Tweaks panel (see below) — do NOT ship it; it exists so stakeholders can switch motif directions while reviewing.

## The Motif System (the page's key differentiator)
Three switchable visual-identity directions, all implemented as inline SVG line-work (`design-files/assets/motifs.jsx`). The shipped site will use **one** direction (decision pending — build it so the direction is a single constant/config value):

| Direction key | Name | Visual language |
|---|---|---|
| `pathways` | Knowledge pathways | Flowing bezier paths + connected node circles (curriculum as progression) |
| `woven` | Modern woven knowledge | Horizontal strands crossed by verticals with over/under breaks (whatu/raranga abstracted to a lattice) |
| `journey` | Learning journeys | Dashed route + milestone rings + 4-point navigation stars + faint compass arcs |

The chosen direction drives ALL of:
1. **Hero backdrop** — `MotifHero`: absolutely-positioned 620px-tall layer at top of hero, SVG `viewBox="0 0 1440 560"` with `preserveAspectRatio="none"`, faded out with CSS mask `linear-gradient(180deg, #000 0%, #000 62%, transparent 96%)`, layer opacity 0.6.
2. **Logo mark** — `MotifMark`: 34×34 (40 viewBox) navy rounded square (rx 10) with direction-specific inner line-work. Wordmark "Aronui" in Spectral 700, 23px.
3. **Eyebrow ticks** — `MotifTick`: 30×12 SVG in `currentColor` preceding every section eyebrow label.
4. **Section dividers** — `MotifDivider`: centred 320×36 SVG; appears after the strand-chip trust strip and above the Tools and Library section heads.
5. **Planner empty state** — `MotifEmpty`: 150×64 illustration inside the hero product demo before generation.
6. **Dark-section backdrops** — `MotifDark`: white line-work at 0.07–0.26 stroke opacity inside `viewBox="0 0 1440 700"`, `preserveAspectRatio="none"`, used on the curriculum (navy-900) section, the "Built for Aotearoa" navy section, the navy quote card (clip to its border-radius) and the final CTA.

Cultural intent: weaving / wayfinding / progression expressed structurally, never decoratively. **No koru clipart, no tribal patterns, no tourism imagery.** All motif geometry is in `motifs.jsx` — port the SVGs verbatim.

## Screens / Views
One page, eight sections, top to bottom. Page max-width 1200px (`--maxw`), nav/footer 1320px, side padding 32px. Section vertical padding 104px (72px ≤900px).

### 1. Nav (sticky)
- 68px tall, `rgba(251,252,253,.82)` + `backdrop-filter: blur(14px) saturate(140%)`, 1px bottom border `#eef2f6`.
- Left: logo (motif mark + "Aronui"). Centre: links Product / Curriculum / How it works / For schools (14.5px, 500, `#3d4f63`). Right: "Sign in" text link + pill button "Start Planning" (navy `#16263d`, white text, 9px 15px, radius 999px).
- ≤900px: centre links and Sign in hidden (mobile menu out of scope).

### 2. Hero (centred)
- Top padding 72px. Motif backdrop behind everything (see above).
- Pill chip: teal tint `#e3f2f0`, text `#0b5e57` 12.5px 600 — "✦ Built on Te Mātaiaho · the 2025 NZ English Curriculum".
- H1: Spectral 700, `clamp(40px, 6vw, 68px)`, line-height 1.03, letter-spacing -0.018em, color `#16263d`: "Teach the new NZ English Curriculum with confidence" (manual break after "English").
- Sub: 20px/1.6 `#566678`, max-width 660px.
- CTAs (gap 14px): primary "✦ Start Planning" — teal `#0e7c72` pill, 16px 28px, shadow `0 6px 18px -6px rgba(14,124,114,.55)`, hover lift -1px + `#13988c`; secondary "Explore Curriculum" — white pill, 1px `#e4e9ef` border.
- Meta row: three 13.5px 600 `#6c7c8e` items with teal check icons: "No credit card / Aligned to every strand / Made in Aotearoa".
- Below: the **Planner demo window** (max-width 980px, centred, shadow `0 40px 90px -20px rgba(12,23,38,.34)`).

### 3. Planner demo (interactive product mock — the hero object)
Window chrome: 12px 16px bar, three 11px dots (#e5707a #e6b450 #5bb98c), title "NZ English Curriculum Planner", right-aligned live-dot + "Te Mātaiaho 2025" in teal.
Body grid `230px 1fr`, min-height 392px:
- **Left rail** (bg `#f7f9fb`, right border): five fake selects (label 11.5px 700 uppercase `#6c7c8e`; value 14px 600 navy in white 10px-radius bordered box): Subject=English, Year=Year 9, Strand=Language Studies, Element=Crafting Texts, Focus=Persuasive texts. Then full-width teal **Generate** button.
- **Right pane**: empty state (motif illustration + "Your curriculum-aligned plan will appear here." + smaller grey line) → on Generate: 950ms loading state (spinner + "Reading the Year 9 teaching sequence…") → six accordion rows stagger in (55ms delay each, 420ms popIn: translateY(8px) scale(.98)→none).
- Rows: 30×30 tinted icon chip + 14px 600 title + teal check + caret. First row open by default; clicking toggles (one open at a time). Open row: border `#7fc8c0`, soft teal shadow. Body text 13.2px/1.6 `#566678`, padded 0 14px 14px 54px.
- Row content (exact copy in `shared-product.jsx` → `PLANNER_OUTPUT`): Curriculum Links / Learning Intentions / Success Criteria / Lesson Activities / Assessment Ideas / Differentiation Support.

### 4. Trust strip
46px top padding. Label 13px uppercase `#93a1b0`: "Aligned to the full English teaching sequence, Years 0–10". Centred wrapped chips (12.5px 600, `#f0f4f8` bg, `#e4e9ef` border): Oral Language, Reading, Writing, Text Studies, Language Studies, Textual & Critical Analysis, Crafting Texts, Oral Communication. Then a motif divider.

### 5. Problem section ("The challenge")
Section head (eyebrow 12.5px 700 uppercase teal w/ motif tick; H2 Spectral `clamp(30px,4vw,44px)`): "A rich curriculum. Not enough hours to unpack it." + sub.
Three cards (grid 3×, gap 22px; white, 1px `#e4e9ef`, radius 18px, padding 28px; 46px tinted icon chip): "Dense by design" / "Planning eats your week" / "Alignment is high-stakes" (copy in `concept-a-v2.jsx`).
Below: navy quote card (radius 26px, padding 44px 54px, max-width 920px) with gold quote icon, Spectral 24px/1.45 text, contained motif backdrop.

### 6. How it works (bg `#f7f9fb`)
Centred head, gold eyebrow. Four steps (grid 4×, gap 30px): big ghost serif number (34px, 18% opacity) + 42px teal icon chip + 16.5px 700 title + 14px desc. Steps: Choose year & strand / Generate lesson or unit / Adapt for your class / Save & reuse.

### 7. Curriculum browser (bg navy-900 `#0c1726`, white text)
Head + right-aligned ghost-light button "Open full browser →". Below: the **Curriculum Browser** product window (white, height 460px) — a miller-column UI:
- 4 columns `.95fr .95fr 1fr 1.5fr`: Strand → Element → Sub-element → Detail. First two columns bg `#f7f9fb`.
- Rows: 13.2px 500, 9px radius; selected = navy bg, white text. Strand rows carry an 8px color dot (Text Studies teal, Language Studies gold). Footnote in col 1: "Years 0–8 use Oral Language · Reading · Writing."
- Detail pane (bg `#fbfcfd`): breadcrumb; **Knowledge** block (teal heading, italic explainer "The facts, concepts, principles and theories to teach.", bullet list with teal markers) and **Practices** block (gold heading, "The skills, strategies and applications to teach."); button "✦ Plan a lesson from this".
- Full curriculum data (real Te Mātaiaho wording) is in `shared-product.jsx` → `CURRICULUM`. Treat it as content fixtures.

### 8. AI teaching tools (white)
Centred head, gold eyebrow: "One workspace for every planning job". Grid 3×2 of tool cards (padding 24px, hover: lift -3px + shadow): Lesson Planner / Unit Planner / Assessment Builder / Rubric Generator / Differentiation Assistant, each with 46px tinted icon chip, 17px 700 name, 14px desc, teal "Open tool →" link (gap widens 6→10px on hover). 6th cell: gradient teal CTA card "Everything links back." + "See a sample plan" button.

### 9. Built for Aotearoa (bg navy `#16263d`)
Two columns (1fr 1fr, gap 60px). Left: gold eyebrow, white Spectral H2 "Made for New Zealand English teachers", gold italic Spectral line "Whaowhia te kete mātauranga — fill the basket of knowledge.", then four icon list items (38px translucent-white chip, teal-300 icon; bold 15.5px white title + 14px `#a9b8c9` desc).
Right: white card (radius 18px, padding 24px, XL shadow): chip "Curriculum link verified", breadcrumb "English › Year 9 › Text Studies › **Features of text**", Knowledge + Practices excerpt blocks, teal tag row "✓ Generated plan references this sub-element".

### 10. Resource library (white)
Head + 4 resource cards (grid 4×): tinted 150px thumbnail (kind badge top-left, 5 grey placeholder bars bottom) + 14.5px 700 title + 12.5px meta. Items: Persuasive writing for a real audience / Deconstructing features of a short story / Literary essay: thesis & evidence / Spotting misinformation in media texts.

### 11. Final CTA (bg navy-900, 96px padding)
Centred: teal-300 eyebrow "Start free", white Spectral H2 `clamp(30px,4.4vw,50px)` "Turn the curriculum into lessons, units and assessments in minutes", grey sub, gold button "✦ Start Planning free" + ghost-light "Book a department demo". Contained motif backdrop.

### 12. Footer (bg `#0c1726`)
5-column grid (1.4fr + 4×1fr): brand block (light logo, 14.5px `#8b9bad` blurb, gold italic Spectral whakataukī) + link columns Product / Curriculum / School / Company (uppercase 12.5px headers `#6f8095`, 14px links `#aebccd`, hover white). Bottom bar after 1px `rgba(255,255,255,.09)` rule: "© 2026 Aronui. Made in Aotearoa New Zealand." + Terms/Privacy/Security.

## Interactions & Behavior
- **Scroll reveal**: elements with `.reveal` fade/translate in (opacity 0, translateY 14px → none; 600ms `cubic-bezier(.2,.7,.3,1)`) via IntersectionObserver (threshold 0.12, rootMargin -8% bottom), once each. Must respect `prefers-reduced-motion` (base styles are the visible end-state).
- **Planner demo**: see §3. State machine: idle → generating (950ms timeout) → done; "Generate" relabels to "Regenerate"; accordion single-open.
- **Curriculum browser**: selecting a strand resets element + sub-element to first child; selecting an element resets sub-element.
- **Buttons**: hover translateY(-1px) + deeper shadow; active translateY(1px). Cards: hover translateY(-3px) + md shadow.
- **Nav**: sticky, blur. All marketing links/CTAs are placeholder `#` anchors — wire to real routes.
- **Motif direction**: single config value; intensity = opacity multiplier on motif layers (default 0.6).
- **Responsive**: breakpoints at 980/900px (grids → 2-col; hero/NZ sections stack; planner rail moves above output; browser → 2 cols with detail full-width) and 620/560px (1-col). No horizontal overflow at 700px.

## State Management
Marketing page — local component state only:
- Planner demo: `{ busy: bool, done: bool, openRow: number }`.
- Browser: `{ strand, element, subElement }` with reset-on-parent-change.
- No data fetching; curriculum content is a static fixture (`CURRICULUM` object).

## Design Tokens
Fonts (Google Fonts): **Spectral** (400–800, italic 400) for display/serif moments; **Hanken Grotesk** (400–800) for UI/body. Body 16px/1.55, antialiased.

Colors:
- Navy 900 `#0c1726` · 800 `#10223a` · primary navy `#16263d`
- Teal 700 `#0b5e57` · primary `#0e7c72` · 500 `#13988c` · 300 `#7fc8c0` · 100 `#e3f2f0`
- Gold 700 `#a8761f` · primary `#c8922a` · 400 `#dcab55` · 100 `#f6ecd6`
- Slate text: 800 `#2c3e52` · 700 `#3d4f63` · 600 `#566678` · 500 `#6c7c8e` · 400 `#93a1b0` · 300 `#c3ccd6`
- Lines `#e4e9ef` / soft `#eef2f6` · Surfaces: white, `#f7f9fb`, `#f0f4f8`, paper `#fbfcfd`

Radii: 8 / 12 / 18 / 26 / 999(pill). Shadows: xs `0 1px 2px rgba(16,34,58,.06)`; sm `0 2px 8px …06, 0 1px 2px …05`; md `0 8px 24px …08, 0 2px 6px …05`; lg `0 24px 60px -12px rgba(12,23,38,.20), 0 8px 24px …08`; xl `0 40px 90px -20px rgba(12,23,38,.34), 0 12px 30px …12`.

Selection: bg `#e3f2f0`, text `#0b5e57`. Eyebrow: 12.5px 700, letter-spacing .14em, uppercase.

## Assets
- **No raster assets.** Logo mark, all icons (custom 24px stroke set, 1.7px stroke, round caps — see `Icon` in `shared-ui.jsx`) and all motifs are inline SVG. Port them as your icon/graphic components.
- Fonts from Google Fonts (self-host in production if preferred).

## Dev-only elements — do not ship
- The floating **Tweaks panel** (`tweaks-panel.jsx` + the `<TweaksPanel>` block and `window.__setDir` hook in `concept-a-v2.jsx`) is a design-review control. Exclude it; keep the direction as a config constant.

## Files
- `design-files/concept-a-v2.html` — entry point (loads React/Babel from CDN)
- `design-files/assets/aronui.css` — design tokens + global primitives (buttons, chips, cards, nav, footer, window chrome)
- `design-files/assets/components.css` — planner, browser, tool/step/resource card styles
- `design-files/assets/concept-a.css` — section layouts for this page
- `design-files/assets/concept-a-v2.css` — motif layer positioning/masks
- `design-files/assets/shared-ui.jsx` — Logo, Icon set, Nav, Footer, reveal hook
- `design-files/assets/shared-product.jsx` — CURRICULUM fixture, PlannerGenerator, CurriculumBrowser, cards
- `design-files/assets/motifs.jsx` — the three motif systems (hero, dividers, logo marks, ticks, empty states, dark backdrops)
- `design-files/assets/concept-a-v2.jsx` — page composition + copy
- `design-files/assets/tweaks-panel.jsx` — dev-only review panel (do not ship)
