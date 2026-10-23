# Design system — "American Editorial"

The tokens live in `src/app/globals.css`. This document explains them and when to use each. Components never use raw hex values; they use **semantic tokens**, which each **surface** remaps.

## 1. Colour

### Palette (raw tokens)

| Token | Hex | Role |
|---|---|---|
| `--aed-paper` | `#F6F2EA` | Default page background (warm ivory, from the crest's gold field) |
| `--aed-paper-2` | `#EDE6D8` | Alternating section background |
| `--aed-white` | `#FFFFFF` | Raised surfaces: cards, menus, form fields |
| `--aed-ink` | `#0E1A2B` | Primary text (navy-black) |
| `--aed-ink-2` | `#3A4657` | Secondary text |
| `--aed-ink-3` | `#566173` | Tertiary text and meta |
| `--aed-rule` | `#DCD3C3` | Hairlines (decorative only) |
| `--aed-rule-strong` | `#8C8172` | Form borders and outline buttons (non-text UI, ≥ 3:1) |
| `--aed-navy` | `#12284A` | Emphasis surface, from the crest ribbon |
| `--aed-navy-2` | `#0B1A33` | Deeper navy |
| `--aed-gold` | `#C9A24B` | Gold on navy: accents, links, focus |
| `--aed-gold-ink` | `#80601A` | Gold on paper: ornaments and small labels |
| `--aed-crimson` | `#A3192F` | Primary action and italic emphasis on paper, from the crest banner |
| `--aed-crimson-hover` | `#86132A` | Primary action hover |
| `--aed-danger` / `--aed-danger-bg` | `#B42318` / `#FBEAE7` | Errors (always paired with an icon and text) |
| `--aed-success` | `#1E6B47` | Success and included ticks |

### Verified contrast (WCAG 2.2)

All pairs below meet AA; most meet AAA.

| Foreground | Background | Ratio |
|---|---|---|
| ink | paper | 15.66:1 |
| ink-2 | paper / paper-2 | 8.57 / 7.71 |
| ink-3 | paper / paper-2 | 5.61 / 5.04 |
| gold-ink | paper / paper-2 | 5.22 / 4.69 |
| crimson (text) | paper | 6.87 |
| white | crimson / crimson-hover | 7.67 / 9.81 |
| paper | navy | 13.17 |
| gold | navy | 6.13 |
| on-navy muted `#B9C3D3` | navy | 8.27 |
| rule-strong (UI) | paper / white | 3.42 / 3.82 |
| danger | paper / white | 5.89 / 6.57 |

The automated axe suite (`tests/e2e/a11y.spec.ts`) re-checks contrast on every page, in every state it tests.

### Semantic tokens and surfaces

Components use `bg-bg`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-line`, `border-line-strong`, `bg-accent`, `text-ornament`, and the focus ring `--focus`.

| Surface class | Use | What changes |
|---|---|---|
| (default) / `.surface-paper` | Most sections | Ink on paper; crimson actions; gold-ink ornaments |
| `.surface-paper-2` | Alternating sections (process, FAQ, catalogue) | Background only |
| `.surface-navy` | One emphasis band per page (why us, outcomes, values, inquiry), plus the footer | Paper text; gold accent, ornaments and focus ring; gold primary button with navy text |

**Rules:**

- Navy is never decorative. It marks the section that carries the page's argument or action.
- Nesting `.surface-paper` inside navy, as the inquiry form card does, restores paper tokens, including the error colour.
- No gradients, apart from the gold hairline fade (`.rule-gold`). No glass, blur or glow.

## 2. Typography

| Role | Family | Notes |
|---|---|---|
| Display (H1, H2, large numerals) | **Libre Caslon Display** 400 | Caslon was the face of early American printing. Use only at 26px and above. |
| Emphasis inside headlines | **Libre Caslon Text Italic** 400, via `.em-accent` | One or two words per headline, crimson on paper and gold on navy |
| Text and UI | **Public Sans** (variable) | The US government's open-source face, in the Franklin Gothic lineage |

All three are SIL OFL, self-hosted via `next/font`, and subset to Latin. They replace the old site's six Google families plus an unlicensed commercial face.

**Loading.** Caslon is preloaded with `display: optional`, so a late swap can never re-wrap a headline. Public Sans uses `swap` with a metric-matched fallback. The measurements behind this are in `docs/testing/verification-report.md`.

### Scale

Sizes are fluid `clamp()` values; Tailwind exposes them as `text-display-xl` and so on.

| Token | Range | Line height | Use |
|---|---|---|---|
| `display-xl` | 42 → 78 px | 1.0 | Home hero H1 only |
| `display-l` | 40 → 76 px | 1.04 | Page H1s |
| `display-m` | 32 → 52 px | 1.1 | Section H2s |
| `display-s` | 26 → 36 px | 1.15 | Sub-section headings, article H2s, pull statements |
| `title` | 19 → 22 px | 1.35 | H3s, card titles (Public Sans 600) |
| `lead` | 18 → 21 px | 1.6 | Intros |
| `body` | 17 px | 1.7 | Running text (`prose-editorial` uses 18 px) |
| `small` | 15 px | 1.55 | Meta, hints |
| `label` | 13 px, 0.14em tracking, uppercase, 600 | 1.3 | Eyebrows (`.eyebrow`), step numerals |

**Rules:**

- One H1 per page; a strict H2 → H3 order (enforced by tests).
- `text-wrap: balance` on headings, `pretty` on paragraphs.
- Body measure stays at 60–75 characters (`max-w-2xl` or `--container-prose` 42rem).
- Numbers (phone numbers, prices, step numerals) use `.tabular` (tabular figures, never split).

## 3. Layout

| Token | Value |
|---|---|
| Container | `.container-site`: max 1320 px; gutter `clamp(16px, 4vw, 40px)` (16px minimum on phones) |
| Grid | 12 columns from `lg`; content blocks use 4 / 5 / 6 / 7 / 8-column spans for asymmetric editorial balance |
| Section rhythm | `.section`: block padding `clamp(72px, 9vw, 136px)` |
| Header height | `--header-h`: 72 px, sticky |
| Breakpoints | Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. The desktop nav appears at `lg`; the phone number in the header at `xl`. |

Tested widths are 320 (reflow), 375, 390, 768, 1024, 1440 and 1920, with no horizontal scrolling.

## 4. Shape, depth and icons

- **Radius:** `xs` 2 px (chips, badges), `sm` 4 px (buttons, inputs), `md` 6 px (cards, panels). Nothing is pill-shaped or heavily rounded.
- **Borders:** 1 px hairlines in `--line` structure the page; cards are mostly hairline-ruled lists rather than boxes.
- **Shadow:** the single token `--shadow-pop`, used for floating UI (the services menu, the featured package) and the logo image.
- **Icons:** Lucide only, stroke 1.5–2, sized in `em` or `size-*` to match the text. Decorative icons are `aria-hidden`; icon-only controls don't exist. Every button has a text label.
- **Ornament:** the five-point star from the crest ribbon (`<Star>`, `<StarRule>`). Use it at most once per section, as a terminator.

## 5. Components

| Component | File | Variants and states |
|---|---|---|
| Button | `.btn` + `.btn-primary` / `.btn-secondary`, `.btn-sm`; `ButtonLink` | 48 px minimum height (44 px small). Hover darkens, active presses 1 px, focus shows a 2 px ring at 3 px offset, disabled is 60% opacity with `aria-disabled`. Arrow icons nudge 3 px on hover. |
| Text link | `.link`, `.link-arrow`, `ArrowLink` | Underline thickens on hover. Arrow links are at least 44 px tall. |
| Eyebrow | `.eyebrow` (gold rule prefix), `.eyebrow-plain` | — |
| Section heading | `SectionHeading` | Size `m` or `l`; heading level `h2` or `h3` |
| Page header | `PageHeader` | Breadcrumb, eyebrow, H1, lead, optional actions and aside |
| Services index | `ServiceIndex` | `full` (services page, home) or `compact` (hero panel, 404, about) |
| Process | `ProcessSteps` | Horizontal from `lg`, vertical rule below |
| FAQ | `FaqList` | Native `<details>`; the plus icon rotates 45° when open; optional FAQPage JSON-LD |
| Insights | `InsightList` | Featured lead plus ruled list; whole-card link via `::after` |
| Packages | `PackageCards`, `PackageComparison`, `PackageGuarantees` | Featured card has a navy border and "Best choice" tag. The table scrolls inside its own focusable region on narrow screens. |
| Work | `WorkList` | Real projects, or clearly labelled preview placeholders |
| Inquiry | `InquirySection` + `InquiryForm` | Idle, field errors (summary plus inline), submitting, success (focus moves to the heading), delivery error (form keeps input) |
| Navigation | `SiteHeader` + `HeaderNav` | Services disclosure (Esc, outside click and focus-out close it); mobile `<dialog>` (inert background, Esc, focus restored); `aria-current` on the active route |
| Footer | `SiteFooter` | Navy; contact, services, company, legal, network, copyright |

### Form fields

- **Field:** `.field-input`, 48 px tall, white, `rule-strong` border. Hover darkens the border; focus adds a 2 px crimson ring.
- **Invalid:** `aria-invalid="true"` gives a 2 px danger border, with `.field-error` (icon plus text) linked by `aria-describedby`.
- **Labels:** always visible (`.field-label`). Required fields carry an asterisk explained in a note above the form.

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `--dur-1` | 120 ms | Press feedback |
| `--dur-2` | 200 ms | Hover and colour transitions |
| `--dur-3` | 320 ms | Menu dialog entrance |
| `--dur-4` | 560 ms | Hero entrance; reveal-once |
| `--ease-out` | `cubic-bezier(.2,.7,.2,1)` | Entrances |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Reserved for reversible state changes |

**Rules:**

1. Content is visible without motion. `.motion-rise` (the hero) animates from a slight offset on load, and the H1 itself is never animated, because it's the LCP element.
2. `.motion-reveal` is reveal-once. `RevealOnScroll` hides only elements that are still below the fold *after* JavaScript runs, and never re-hides them. There's no scroll hijacking and no scroll-linked opacity.
3. Under `prefers-reduced-motion: reduce`, every animation and transition is neutralised, and a test asserts nothing is left hidden.
4. Only `opacity` and `transform` are animated; nothing animates continuously.
