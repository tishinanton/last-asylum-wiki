---
name: "Last Asylum: Plague — Полевой узел"
description: "A live refuge-operations command wall that puts today's verified decision before any guide."
colors:
  ink: "#e9e6dc"
  ink-strong: "#fffdf4"
  muted: "#aaa99f"
  muted-warm: "#c3b9a6"
  void: "#0b0d0c"
  ground: "#101210"
  surface: "#171a17"
  surface-raised: "#1d211d"
  surface-worn: "#252720"
  rule: "#40443d"
  rule-soft: "#2c302b"
  amber: "#e2a14a"
  amber-pale: "#f0c67d"
  amber-dark: "#6f4a21"
  rust: "#b96042"
  danger: "#e57a61"
  safe: "#a9c29f"
  steel: "#8b9a99"
  focus: "#ffd38c"
typography:
  display:
    fontFamily: "Bahnschrift, \"Arial Narrow\", \"Segoe UI\", sans-serif"
    fontSize: "clamp(2.6rem, 6.3vw, 5.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bahnschrift, \"Arial Narrow\", \"Segoe UI\", sans-serif"
    fontSize: "clamp(1.75rem, 3.3vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.04
  title:
    fontFamily: "Bahnschrift, \"Arial Narrow\", \"Segoe UI\", sans-serif"
    fontSize: "clamp(1.4rem, 2.4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.04
  body:
    fontFamily: "\"Segoe UI Variable\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  none: "0"
  full: "50%"
spacing:
  xs: "0.35rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  page: "clamp(1.5rem, 3.3vw, 3.5rem)"
  section: "clamp(4rem, 9vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#17120c"
    rounded: "{rounded.none}"
    padding: "0.68rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.amber-pale}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.68rem 1rem"
  button-danger:
    backgroundColor: "transparent"
    textColor: "#f0aa98"
    rounded: "{rounded.none}"
    padding: "0.68rem 1rem"
  input-field:
    backgroundColor: "#0f110f"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.65rem"
    height: "2.7rem"
---

# Design System: Last Asylum: Plague — Полевой узел

## Overview

**Creative North Star: "The Failing Refuge Console"**

The product reads as a wall-mounted operations terminal inside a refuge that is losing the fight against the plague, kept alive by whoever is still monitoring it. It refuses the generic marketing hero: the first thing the visitor sees is not a pitch but a live status — which windows are open right now, what still needs doing before the reset. Every surface below that first read (evidence, planning, sources) stays reachable without breaking the sense that the console is still watching two clocks at once.

The material language is charcoal steel plate, oxidized copper rivets, and stenciled paper labels lit by a single hazard-amber signal. Structure is asserted with hard 1px rules and hairline dividers instead of soft cards; depth comes from stamped, hard-offset shadows rather than blur. Data (IDs, timers, confidence, source refs) is always set in monospace, as if printed by the terminal itself, while prose stays in a plain system body face. Motion is restrained to signal only: a slow pulse on the live dot, a scroll-into-view on the active round, hard-edged transform transitions — nothing decorative, and everything collapses to near-zero duration under reduced motion.

**Key Characteristics:**
- Live-status-first hierarchy: two event rails and the active checklist outrank any narrative copy.
- Zero border-radius everywhere except literal telemetry dots (live pulse, confidence markers, round-trace nodes).
- Hard, directional "stamped plate" shadows instead of soft ambient elevation.
- Monospace (Consolas) exclusively for IDs, timers, and confidence/priority stamps; condensed display face (Bahnschrift) exclusively for uppercase headings and labels.
- Hairline-ruled "ledger row" lists (sources, requirements, overlaps) used in place of individual cards.

## Colors

The palette is a near-monochrome charcoal-and-bone base with a single hazard-amber signal and an oxidized-copper secondary; status color (green/red) is reserved strictly for verification confidence, never decoration.

### Primary
- **Hazard Amber** (`#e2a14a`): the one live-signal color — active nav tick, countdown digits, current round-trace node, primary button, section rules. Reserved for the single most urgent thing in a view.
- **Pale Signal Amber** (`#f0c67d`): hover state for the primary button, progress-readout numerals, source IDs, "verified" stamp emphasis.
- **Scorched Amber** (`#6f4a21`): the stamped drop-shadow color under the primary button (`4px 5px 0 #5f3d1d`-family offsets), never used as a fill.

### Secondary
- **Oxidized Copper** (`#b96042`, `--rust`): brand-mark rivet accents, evidence-queue "not yet verified" numeral badge, overlap/warning glyphs, the diagonal hazard-stripe fill behind the "facts don't mix with guesses" band.

### Tertiary
- **Cold Steel** (`#8b9a99`, `--steel`): the idle sidebar signal-strength bars, P2 (low-priority) verification-queue stamps — the "system nominal, low attention" register.

### Neutral
- **Bone Paper** (`#e9e6dc`, `--ink`): default body text on dark ground.
- **Flare White** (`#fffdf4`, `--ink-strong`): headings, strong emphasis, focus-trap text on light chips.
- **Ash Grey** (`#aaa99f`, `--muted`): secondary labels, muted captions, disabled/idle copy.
- **Warm Ash** (`#c3b9a6`, `--muted-warm`): page-lead paragraphs and descriptive body copy that needs slightly more warmth than `--muted`.
- **Charcoal Ground** (`#101210`, `--ground`) / **Blackout** (`#0b0d0c`, `--void`): page background and the deepest recesses (input fills, brand-mark interior).
- **Steel Plate** (`#171a17`, `--surface`) / **Raised Plate** (`#1d211d`) / **Worn Plate** (`#252720`): panel backgrounds, from resting to lightly worn.
- **Structural Rule** (`#40443d`, `--rule`) / **Soft Rule** (`#2c302b`, `--rule-soft`): every hairline border and ledger-row divider in the system.

### Status
- **Verified Green** (`#a9c29f`, `--safe`): confidence-high dot/stamp, "verified" live-indicator, checked checkbox fill.
- **Warning Red** (`#e57a61`, `--danger`): confidence-low dot/stamp, unverified badge, destructive button border/text, P0 verification-queue severity.
- **Focus Glow** (`#ffd38c`, `--focus`): the sole focus-visible outline color, system-wide.

### Named Rules
**The One Signal Rule.** Hazard amber marks exactly one live/urgent thing per view — the active nav tick, the current countdown, the current round node, the primary CTA. It is never used decoratively or for a second element at once.

**The Confidence Never Rides on Hue Alone Rule.** Every safe/danger/amber status color is always paired with an explicit uppercase text label ("ПРОВЕРЕНО"/"НЕ ПРОВЕРЕНО", "ВЫСОКАЯ/СРЕДНЯЯ/НИЗКАЯ УВЕРЕННОСТЬ") and, where relevant, an icon — color alone never carries the meaning.

## Typography

**Display / Headline / Title Font:** Bahnschrift (`font-stretch: condensed`), falling back to Arial Narrow, then Segoe UI.
**Body Font:** Segoe UI Variable, falling back to Segoe UI, then system-ui.
**Label / Data Font:** Consolas, monospace.

**Character:** Compressed, stenciled, all-caps placard type for anything structural (headings, labels, nav), set against a plain system body face for reading copy, with monospace standing in for printed terminal data (IDs, timers, stamps). The pairing reads as "field manual meets hardware console," never editorial or soft.

### Hierarchy
- **Display** (700, `clamp(2.6rem, 6.3vw, 5.75rem)`, line-height 1.04, letter-spacing -0.035em, uppercase): page `h1` / home hero headline ("СМЕНА УЖЕ ИДЁТ").
- **Headline** (700, `clamp(1.75rem, 3.3vw, 3rem)`, uppercase): section headings ("НЕДЕЛЯ В ОДНОМ КОНТУРЕ", score-table phase titles).
- **Title** (700, `clamp(1.4rem, 2.5vw, 2.25rem)`, uppercase): rail/panel headings (current phase name, checklist panel title).
- **Body** (400, 0.86–1.24rem, line-height 1.65, up to ~62ch max width): lead paragraphs, task copy, descriptive text.
- **Label** (650–800, 0.58–0.78rem, uppercase, letter-spacing 0.03–0.08em, Consolas for data / Bahnschrift for short UI labels): nav items, group labels, IDs, timers, confidence and priority stamps.

### Named Rules
**The Uppercase Placard Rule.** Every display, headline, title, and label string renders uppercase and condensed; body prose is the only sentence-case register in the whole system — the contrast is what marks "structure" versus "reading."

## Layout

Fixed topbar (`--topbar: 4.5rem`, 4.15rem below 820px) plus a fixed left sidebar (`--sidebar: 15rem`, 12.5rem below 1120px) that becomes an off-canvas drawer below 820px, translated off-screen (`translateX(-104%)`) and slid in via `.sidebar-open` with a 220ms cubic-bezier transition; the hamburger `.menu-button` only appears at that breakpoint. Main content is offset by both fixed rails (`margin-left: var(--sidebar)`, `padding-top: var(--topbar)`) and centers a `min(100%, 88rem)` page column with `clamp(1.5rem, 3.3vw, 3.5rem)` padding (down to `1.35rem 1rem 3.5rem` on mobile).

The home overview's `.operations-deck` is a two-column grid (`1.12fr` status board / `0.88fr` checklist, ≥1120px) that collapses to a single stacked column below that breakpoint. Section rhythm across the home and guide pages uses large `clamp(4rem, 8–9vw, 7–8rem)` vertical gaps between bands — the page reads as distinct plated sections, not a continuous scroll. Repeating record grids reflow by column count as space shrinks: the week strip (7 → 2 columns), phase tape (6 → 2), survival-rules (3 → 2 → 1), field-procedure (4 → 2 → 1), and the two-column verification queue (→ 1 column) all step down at 1120px/820px/560px. Tables scroll horizontally inside a bordered `.table-scroll` region rather than reflowing, with a mobile-only hint line telling the visitor to swipe.

## Elevation & Depth

The system is flat by default — hairline `1px` structural rules do almost all of the separating work, not shadows. Where shadows do appear, they are hard directional offsets that read like a stamped or riveted metal plate, never soft ambient glow: `var(--shadow)` (`0 18px 48px rgba(0,0,0,.34), 5px 7px 0 rgba(0,0,0,.16)`) grounds the operations deck and checklist panel, and small stamped offsets (`3px 4px 0` / `4px 5px 0`) mark the brand mark, the current round-trace node, and the primary button. Modal dialogs are the one place depth gets heavier and softer — a layered `12px 16px 0 rgba(0,0,0,.35), 0 28px 70px rgba(0,0,0,.48)` shadow plus a 160ms backdrop blur-in — because they are meant to feel like they've physically lifted off the console.

### Shadow Vocabulary
- **Deck shadow** (`box-shadow: 0 18px 48px rgba(0,0,0,.34), 5px 7px 0 rgba(0,0,0,.16)`): the operations deck and checklist panel.
- **Stamp offset** (`box-shadow: 3px 4px 0 rgba(0,0,0,.28)`): brand mark, current round-trace node.
- **Primary button stamp** (`box-shadow: 4px 5px 0 #5f3d1d`): the amber primary CTA only.
- **Dialog lift** (`box-shadow: 12px 16px 0 rgba(0,0,0,.35), 0 28px 70px rgba(0,0,0,.48)`): settings and confirm dialogs, with a `backdrop-filter: blur(3px)` scrim.

### Named Rules
**The Stamped Plate Rule.** Shadows are hard-edged directional offsets, as if a metal plate were riveted onto the surface, never a soft blurred glow — the sole exception is the backdrop blur behind a modal dialog.

## Shapes

Border-radius is `0` on every rectangular surface — buttons, inputs, panels, tables, badges, chips — by explicit rule (`.settings-grid input { border-radius: 0; }` restates it even where `0` was already the default). The only circular forms in the system are literal live-telemetry points: the live-indicator pulse dot, confidence/status dots, and round-trace nodes, all `border-radius: 50%`. Borders are uniformly `1px solid var(--rule)` (or `--rule-soft` for secondary dividers); the brand mark is the one intentionally skewed element, rotated `-2deg` to read as a physically mounted plate rather than a perfectly aligned icon.

### Named Rules
**The Hard Edge Rule.** Every rectangular surface has `border-radius: 0`; the sole exception is a circular dot or node standing in for a live signal, never a stylistic choice.

## Components

### Buttons
- **Shape:** square, `1px solid var(--rule)` border, `0.68rem 1rem` padding, uppercase 0.76rem/780-weight label.
- **Primary:** amber fill, `#17120c` text, stamped `4px 5px 0 #5f3d1d` shadow; hover fills pale amber. Used once per view for the single most important action (e.g. "ОТКРЫТЬ ПОЛНЫЙ ЧЕК-ЛИСТ").
- **Secondary:** transparent fill, same border/label treatment, hover darkens border to amber.
- **Quiet:** text-only in `--muted-warm`, no visual weight, used for low-stakes actions like "clear today."
- **Danger:** transparent fill with a rust border and salmon (`#f0aa98`) text; hover fills a dark rust wash. Used for destructive confirms (clear all progress).
- All buttons go full-width and stack vertically inside `.checklist-actions`/`.dialog-actions` below 560px.

### Chips / Stamps
- **Confidence dot** (inline, 6px circle): high = safe green, medium = amber, low = danger red — always beside a text label, never alone.
- **Confidence stamp** (bordered text badge, top+bottom rule in `currentColor`): the sources page's ВЫСОКАЯ/СРЕДНЯЯ/НИЗКАЯ УВЕРЕННОСТЬ tags.
- **Priority stamp** (`.priority-p0/p1/p2`): solid-fill 2.2rem blocks — danger red (P0), amber (P1), steel (P2) — marking verification-queue severity.
- **Overlap badge:** amber double-rule (top+bottom border) tag marking a checklist task that counts toward two independent events at once.
- **Source chip / page meta / data-id:** bordered, monospace, used for reference IDs and access-date readouts.

### Cards / Containers
- **Operations deck / checklist panel:** the only true "cards" — `1px` bordered dark panels with the deck shadow, split status-board + checklist side by side.
- **Ledger rows (signature pattern):** most list data (sources, requirements, overlaps, week strip, phase tape) is not cards at all but a "record" grid with a top/bottom rule and per-row hairline dividers — background stays flat, the rule does the separating.
- **Internal Padding:** `clamp(1.25rem, 2.8vw, 2.4rem)` for the checklist panel; `1rem` for tighter record rows.

### Inputs / Fields (Settings dialog)
- **Style:** `1px solid var(--rule)` border, explicit `border-radius: 0`, `#0f110f` fill, `2.7rem` min-height, two-column grid that collapses to one column below 560px.
- **Focus:** the global 3px `--focus` outline with 3px offset — no glow, no border-color shift.
- **Verified state:** a small `--safe`-colored note line appears beneath a field once its value is confirmed by an in-game source.

### Navigation
- **Sidebar nav-link:** muted icon + label at rest; hover tints background and brightens text; the active route gets a soft amber-tinted background wash, an amber-tinted icon, and a 5px solid amber bar that scales in on the trailing edge (`scaleY(0 → 1)`, 180ms).
- **Mobile:** the sidebar becomes a `min(19rem, 88vw)` off-canvas drawer behind a hamburger button; the topbar itself shrinks and hides text labels on utility buttons progressively down to 560px.

### Round Trace (signature component)
The six-node horizontal timeline for Survival Battle rounds: hollow rule-colored nodes fill solid safe-green once past and solid amber (with the stamp shadow) for the current round, which also auto-scrolls into view on change (`scrollIntoView`, instant under reduced motion). Below 820px it becomes a horizontally scrollable strip with a sticky "↔" scroll-cue in the corner, signaling more content off-screen without adding visible chrome.

## Do's and Don'ts

### Do:
- **Do** reserve hazard amber for exactly one live/urgent signal per view — active nav tick, live countdown, current round node, or primary CTA.
- **Do** set every ID, timer, source reference, and confidence/priority stamp in Consolas monospace; never use it for prose.
- **Do** pair every status color (safe/amber/danger) with an explicit uppercase text label and icon — color alone must never carry meaning.
- **Do** keep border-radius at `0` on every rectangular surface; circles are reserved for literal live-telemetry dots.
- **Do** express list data as hairline-ruled ledger rows rather than introducing new card containers.
- **Do** route every animation and transition through the global `prefers-reduced-motion: reduce` override, which collapses durations to near-zero.

### Don't:
- **Don't** add soft, blurred ambient shadows to cards, panels, or buttons — use the flat "stamped" hard offset, or no shadow at all; blur is reserved for the modal backdrop.
- **Don't** introduce a generic marketing hero, gradient mesh, glow, or stock/game photography — the console shows today's status first, by design.
- **Don't** round the corners of buttons, inputs, tables, chips, or panels.
- **Don't** let a second amber-accented element compete with the view's one live signal.
- **Don't** collapse the two live event rails or the active checklist below the fold on first viewport, on any breakpoint.
