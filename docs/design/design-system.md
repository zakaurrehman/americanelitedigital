# Design system — "American Elite" (v3)

All tokens live in `src/app/globals.css`. This document explains them and when to use each.

- **Semantic tokens.** Components never use raw hex values; they use semantic tokens, exposed to Tailwind through `@theme inline` (`bg-bg`, `text-brand`, `text-fg-muted`, `border-line`, …).
- **Light by default.** The site is light (`color-scheme: light`, `themeColor #FFFFFF`). A `.surface-navy` class remaps the same tokens for navy bands, so any component placed inside one reads correctly.
- **History:** the reasoning is in `design-direction.md`; image sources and rules are in `image-credits.md`. The v2 dark system this replaces is recorded in the design direction.

## 1. Colour

### Brand palette

Every value below was sampled from the owner's logo artwork.

| Token | Hex | From the logo | Role |
|---|---|---|---|
| `--navy-800` | `#041C74` | "AMERICAN ELITE" wordmark | Headings, links, secondary buttons (`--brand`, `--heading`, `--link`) |
| `--navy-900` / `-950` | `#0A1A52` / `#06123A` | Wordmark shading | Navy bands, cards on navy |
| `--red-500` | `#E8041C` | "DIGITAL" | Primary button, serif accent phrases, small marks (`--accent`) |
| `--red-700` | `#C40318` | — | Red **text** at body sizes (`--accent-strong`), button hover |
| `--red-800` | `#A8031A` | — | Error text (`--danger-fg`) |
| `--gold-400` / `-500` / `-300` | `#F4C434` / `#F4AC34` / `#F9EB3B` | Lion and the rules either side of "DIGITAL" | Gold rules, stars, step rings, spotlight; the primary button and accents on navy |
| `--gold-700` | `#8A5A00` | — | Gold **text** on light surfaces (index numerals, `--gold-ink`) |
| `--blue-500` | `#04ACEC` | Ribbon | Background light, charts, process beam end (decorative) |
| `--blue-600` | `#0477BF` | — | Focus ring and field focus (`--focus`) |
| `--green-700` | `#2C6C1C` | Laurel | Success and check marks (`--success-fg`) |

### Neutrals

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0B1533` | Body text (`--fg`) |
| `--slate-600` | `#45506B` | Secondary text (`--fg-muted`) |
| `--slate-500` | `#5A6582` | Meta text (`--fg-subtle`) |
| `--slate-400` | `#7C869E` | Form-field borders (`--ui-line`, non-text, ≥ 3:1) |
| `--slate-300` / `-200` | `#C9D2E3` / `#E3E8F2` | Hairlines (`--line-strong` / `--line`, decorative) |
| `--paper` | `#F5F8FD` | Tinted section background (`--bg-raised`, `.surface-raised`) |
| `--mist` | `#EAF0F9` | Hover fill, image placeholder |

### Verified contrast (WCAG 2.2)

All ratios were computed from the hex values with the WCAG relative-luminance formula.

| Pair | Ratio | Use |
|---|---|---|
| ink on white / paper | 17.96 / 16.87 | Body text |
| navy-800 on white / paper | 14.75 / 13.86 | Headings, links |
| slate-600 on white / paper | 8.04 / 7.55 | Secondary text |
| slate-500 on white / paper / mist | 5.80 / 5.45 / 5.07 | Meta text |
| red-700 on white / paper | 6.23 / 5.85 | Eyebrows and small red text |
| red-700 on red-100 (topic chip) | 5.31 | Article topic chips |
| red-500 on white / paper | 4.70 / 4.42 | **Large text only** (serif accent phrases at display sizes), plus small marks |
| white on red-500 / red-700 | 4.70 / 6.23 | Primary button and its hover |
| gold-700 on white / paper | 5.93 / 5.57 | Index numerals |
| green-700 on white | 6.42 | Success |
| red-800 on white / danger-bg | 7.80 / 6.84 | Errors (always with an icon and text) |
| blue-600 on white | 4.78 | Focus ring (needs 3:1) |
| slate-400 on white | 3.65 | Field borders (needs 3:1) |
| white on navy-950 / navy-900 | 18.18 / 16.37 | Text on navy bands and cards |
| `#B9C4E0` (muted) on navy-950 / navy-900 | 10.42 / 9.38 | Secondary text on navy |
| `#93A0C4` (subtle) on navy-950 / navy-900 | 6.98 / 6.29 | Meta text on navy |
| gold-400 on navy-950 | 11.07 | Accents, eyebrows and focus on navy |
| navy-950 on gold-400 / gold-300 | 11.07 / 14.69 | Primary button on navy, and its hover |

**Rules:**

- `--accent` (red-500) is for large display text and marks. Red text below about 24 px uses `--accent-strong` (red-700).
- Gold (300/400/500) is decorative on light surfaces. Gold text on light surfaces uses `--gold-ink` (gold-700).
- Sky blue is decorative only; it is never used for text.
- The axe suite (`tests/e2e/a11y.spec.ts`) re-checks rendered contrast on every page and every state it tests.

### Surfaces

| Surface | Use | Token changes |
|---|---|---|
| Default (white) | Most sections | — |
| `.surface-raised` (paper) | Alternating sections: Under one roof, FAQ, values, catalogue | Background only |
| `.surface-navy` | Utility bar, service marquee, homepage "Why", call-to-action band, footer, and single emphasis cards (service outcome 01, About "Our mission", the navy column of the Services menu) | White text, gold accents and focus, a gold primary button with navy text, solid navy-900 cards, inverted secondary button |

**Depth** comes from white cards on tinted backgrounds, with soft navy-tinted shadows:

| Shadow | Use |
|---|---|
| `--shadow-sm` | Resting cards |
| `--shadow-md` | Hover |
| `--shadow-lg` | Photos and floating cards |

**Brand light:** `.aurora` places sky and gold radial fields behind headers, `.bg-grid` is a faint navy grid that fades out, and `.bg-stars` is a faint gold star pattern on navy.

## 2. Typography

| Role | Family | Notes |
|---|---|---|
| Display, text and UI | **Geist** (variable) | Headings are 600 weight in navy, with tight negative tracking at display sizes. Body text is 400 in ink. |
| Accent | **Instrument Serif** *italic*, via `.em-accent` and `.index-num` | One phrase per headline in red (gold on navy), e.g. "*One team.*", plus gold-700 index numerals. **Numerals only for real sequences** (process steps, next steps, legal contents) and never repeated on a page — unordered lists use icons from `src/components/ui/icons.ts` (`tests/e2e/conversion.spec.ts` enforces this) |
| Eyebrow | Geist 700 italic, uppercase, 0.2em tracking, via `.eyebrow` | Red-700 after a gold gradient rule, mirroring the logo's "— DIGITAL —" lockup. `.eyebrow-plain` is grey with no rule. |

Loading is unchanged from v2:

- **Geist:** `swap`, not preloaded.
- **Instrument Serif:** preloaded with `display: optional`.

### Scale

Sizes are fluid `clamp()` values.

| Token | Range | Use |
|---|---|---|
| `display-2xl` | 46 → 108 px | Home hero H1 |
| `display-xl` | 40 → 84 px | Page H1s |
| `display-l` | 34 → 68 px | Large section headings |
| `display-m` | 30 → 50 px | Section H2s |
| `display-s` | 23 → 33 px | Sub-sections, article H2s, overlay titles |
| `title` | 19 → 22 px | H3s and card titles |
| `lead` | 18 → 21 px | Intros |
| `body` | 17 px | Running text (`prose-editorial` is 18 px) |
| `small` / `label` | 15 / 12 px | Meta / eyebrows |

## 3. Layout

| Token | Value |
|---|---|
| Container | `.container-site`: max 82rem (1312 px); gutter `clamp(16px, 4vw, 40px)` |
| Section rhythm | `--section-y` = `clamp(72px, 9vw, 136px)` |
| Header | A 40 px navy utility bar (md and up) that scrolls away, plus a 76 px main bar (`--header-h`) that stays pinned. The header uses `top: -2.5rem` from md, so only the utility bar leaves the screen. |
| Radius | `xs` 4 · `sm` 10 · `md` 16 · `lg` 24 · `xl` 32 px. Buttons, chips and the nav pill are fully round. |

## 4. Components

| Component | File / class | Notes |
|---|---|---|
| Logo | `BrandMark` (`tone="light"` or `"dark"`) | Horizontal lockup from the official artwork; the dark tone has a white wordmark for the footer |
| Buttons | `.btn-primary`, `.btn-secondary`, `ButtonLink` (`magnetic`) | **Primary:** red pill with white text and a red glow; a light sweep crosses it on hover. On navy it becomes a gold pill with navy text. **Secondary:** navy outline that fills navy from the left on hover (white outline on navy). |
| Eyebrow | `.eyebrow`, `.eyebrow-center` | The "— DIGITAL —" motif |
| Gold rule | `.gold-rule`, `GlowRule` | A gold gradient line; `GlowRule` adds a centre star |
| Card | `.card` + `.lift` + `.spot` | White with a hairline and shadow. Lifts 6 px on hover; the cursor spotlight draws a gold-to-sky border. |
| Photo frame | `.photo` | Rounded, with an inner hairline and a mist placeholder; blur-up placeholders come from `next/image` |
| Glass card | `.glass-card` | White at 90% with blur, for floating cards over photos (hero) |
| Icon tile | `.icon-tile` | A 48 px rounded tile with a sky tint and a navy icon (gold on navy) |
| Mobile CTA bar | `.mobile-cta` (`MobileCtaBar`) | Phones only: Call + Free consultation pinned to the bottom; the body reserves its height, and it hides while a form field has focus |
| Hero collage | `HeroVisual` | Two photos, brand and growth cards (no figures), an offer pill, and the spinning emblem badge, with pointer parallax by layer |
| Marquee | `Marquee` | A navy band of service names with gold stars, edged by gold rules; scrolls continuously after the first interaction and pauses on hover; `aria-hidden` |
| Practice cards | `ServiceIndex` (`full`) | A photo header with a number badge and an overlay title, the description, and the service links; zooms and lifts on hover |
| Page header | `PageHeader` (`image`, `aside`) | Text with an optional photo that moves with the pointer. On service pages the "What's included" card overlaps the photo's lower edge. |
| Process | `ProcessSteps` | Gold-ringed step markers; the beam fills gold → red → sky as you scroll |
| FAQ | `FaqList` | White cards; an open item gets a gold border, and its plus becomes a red disc |
| Inquiry | `InquirySection` + `InquiryForm` | Contact cards plus a white form card in a gold-to-sky gradient frame |
| Call-to-action band | `CtaBand` | A navy panel with stars, light fields, an emblem watermark and a gold button |
| Navigation | `SiteHeader`, `HeaderNav` | Utility bar. The pill nav has a white "lamp" carrying a red-to-gold underline. The Services panel has a navy promo column and a white list. The mobile `<dialog>` is light. |
| Footer | `SiteFooter` | Navy, with a gold top rule, star pattern and the white-wordmark logo; ends at the copyright line |

### Form fields

- **Field:** white, 52 px tall, with a slate-400 border.
- **Focus:** a blue-600 border plus a 4 px blue halo.
- **Invalid:** a red-800 border and ring, with an icon and text message.

## 5. Motion system

The tokens, rules and reduced-motion and no-JavaScript guarantees are unchanged from v2. The full pattern list is in the v2 section of `design-direction.md` and in `docs/architecture.md` under "Motion runtime".

### Added in v3

| Pattern | How | Where |
|---|---|---|
| Photo entrance | `.motion-photo`: scale 0.92 → 1, transform only (composited), never faded | Hero and header photos |
| Pop-in | `.motion-pop`: fade, rise and scale, staggered with `--delay` | Hero collage cards, inset photo, badge |
| Layer parallax | `--tx` / `--ty` (unitless, from `data-tilt`) × depth px per layer | Hero collage, page-header photos |
| Float | `.float`: a ±6 px bob, alternating | Hero cards (after the first interaction) |
| Spin | `.spin-slow`: a 28 s rotation | Emblem badge text ring (after the first interaction) |
| Marquee | `.marquee-track`: translates −50% over 45 s; pauses on hover | Service band (after the first interaction) |
| Chart | `.chart-bar` grows from 15%; `.draw-line` draws the stroke | Hero growth card |
| Directional reveals | `data-reveal="left"` / `"right"` | Image columns |

### Performance rules (v3)

These were measured; the details are in the verification report.

1. **Below-the-fold entrances are desktop-only.** Header photos and the hero collage only animate in from `lg` (1024 px), where they share the first screen with the text. On phones they sit below the fold, and running their entrances there doubled style-recalculation work before first paint.
2. **No `clip-path` animation for photos.** The first version opened photos from a clip mask, which can't run on the compositor. They now use transform only.
3. **Continuous motion waits for interaction.** Drift, float, spin and the marquee start only after the first pointer move, scroll, key press or touch (`html.has-interacted`). Idle and background tabs do no continuous work.
4. **Header photos load eagerly, without preload.** The `<img>` is already in the server HTML, so preload adds nothing on desktop. On phones the photos are below the fold and the LCP element is the intro text. Removing preload made no measurable difference, so the simpler option was kept.
