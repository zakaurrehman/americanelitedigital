# Verification report

## 0. v3 — "American Elite" (light, logo colours), 2026-10-24

**Environment:** the production build (`npm run build` → `next start`) on the same Windows 11 laptop (4-core i7-8565U), with Chrome 154 and Node 24.15. The machine was shared with other projects' processes, so treat timing as indicative.

### 0.1 Results

| Check | Command | Result |
|---|---|---|
| Type check | `npm run typecheck` | ✅ 0 errors |
| Lint | `npm run lint` | ✅ 0 problems |
| Unit | `npm test` | ✅ 34 / 34 |
| Build | `npm run build` | ✅ 28 routes, unchanged |
| End-to-end, accessibility, responsive, motion | `npm run test:e2e` | ✅ **125 passed**, 4 skipped (preview-only), 0 failed; axe found **0 violations** on every page at 1440 and 390 px |
| Unpublished features | `npm run test:preview` | ✅ **51 passed**, 1 skipped (the production-only assertion) |
| Dependencies | `package.json` | No packages added or removed |

### 0.2 One test changed, and why

`routes.spec.ts` required every `<img>` to have a `width` attribute, as its proxy for "space reserved, no layout shift". v3 photos use `next/image` `fill`, which has no width attribute; the space is reserved by a parent with an aspect ratio instead.

- **The new rule:** each fill image must have a parent whose computed `aspect-ratio` is not `auto`. Every other image still needs `width`.
- **Effect:** this keeps the test's intent and checks fill images more strictly than before.
- **Corroboration:** measured CLS is 0.000 on every page tested (below).

### 0.3 Performance

Method: Lighthouse 12.3, simulated throttling, localhost production build, median of 3 runs.

| Page | Form | Perf | FCP | LCP | TBT | CLS | A11y / BP / SEO |
|---|---|---|---|---|---|---|---|
| `/` | Mobile | **89** | 1.40 s | 3.62 s | 79 ms | 0.000 | 100 / 100 / 100 |
| `/web-development-consulting-services/` | Mobile | **89** | 1.39 s | 3.30 s | 107 ms | 0.000 | 100 / 100 / 100 |
| `/` | Desktop | **99** | 0.38 s | 0.74 s | 1 ms | 0.000 | 100 / 100 / 100 |
| `/about-us/` | Desktop | **100** | 0.34 s | 0.70 s | 5 ms | 0.000 | 100 / 100 / 100 |

The A11y / BP / SEO scores come from single full-category runs of `/` and the web service page, mobile and desktop: all 100.

**What was found and fixed along the way.** The first v3 build scored only 72–74 on mobile (LCP about 3.98 s, TBT about 410 ms). Investigation:

| Step | Measurement | Result |
|---|---|---|
| Remove `preload` from the header photos | 3 mobile runs | LCP unchanged (3.98 s). Not the cause. Kept as eager, no preload, for simplicity. |
| Make the hero photos lazy, with no blur placeholder | 3 mobile runs | LCP 3.93 s. Not the cause. Reverted. |
| Disable `text-wrap: pretty`/`balance`, `interpolate-size`, backdrop blur, shadows, masks or gradients | Chrome style/layout CPU counters, 5 runs each | No meaningful change |
| Disable animations | Same counters | Style recalculations during load fell from 71 to 6, and style time by about 65% |
| **Fix:** the hero collage and header-photo entrances run only from `lg`, where they're on screen at load; the photo reveal changed from `clip-path` to transform-only | Counters: style 117 → 61 ms (1× CPU), recalcs 71 → 41. Lighthouse mobile: **89**, TBT 79 ms | Kept |

**Against the targets:**

| Target | Result |
|---|---|
| Desktop ≥ 95 | ✅ 99–100 |
| Mobile ≥ 90 | ❌ 89, just short |
| A11y / BP / SEO = 100 | ✅ |
| CLS ≤ 0.1 | ✅ 0.000 |
| LCP ≤ 2.5 s | ✅ Desktop (0.7 s). ❌ Mobile lab (3.3–3.6 s). |

The mobile LCP element is the hero intro text. The page now carries real photography and about 1,600 DOM nodes. Judge real-user LCP from field data after launch.

### 0.4 Remaining issues (v3)

1. **Mobile lab LCP is above 2.5 s**, and mobile performance is 89 against the target of 90. Re-measure on an idle machine and on the real host; check field data after launch.
2. **The photography is stock.** It's licensed (Unsplash) and captioned honestly, but real photos of the team, workspace and delivered work would be more credible. See `docs/design/image-credits.md`.
3. **Owner review:** the hero cards ("Brand identity", "Search & growth") are illustrative UI with no figures. Confirm the owner is happy with them.
4. **Browser coverage:** only Chrome was tested, as for v2.

---

The sections below are the v2 report (§1) and the v1 report (§2–5), kept for history.

**Date:** 2026-10-23.

- **v2 results:** from the production build (`npm run build` → `next start`) on Windows 11, Chrome 154.0.8037.58 (installed binary) and Node 24.15. The machine is a 4-core i7-8565U laptop.
- **Machine load:** during the v2 runs it was shared with other projects' dev servers, a long-running Prisma process and another session's benchmarks. Timing-sensitive results below are flagged where that matters.
- **v1 results:** §2 onwards is the original v1 report, kept for history and still accurate for everything v2 didn't change.

## 1. Summary — v2 ("Obsidian Atelier")

| Check | Command | Result |
|---|---|---|
| Type check (strict) | `npm run typecheck` | ✅ 0 errors |
| Lint | `npm run lint` | ✅ 0 problems |
| Unit tests | `npm test` | ✅ **34 / 34** passed |
| Production build | `npm run build` | ✅ 28 routes, unchanged from v1 |
| End-to-end, accessibility, responsive, motion | `npm run test:e2e` | ✅ **125 passed**, 4 skipped (preview-only), 0 failed, 263 s |
| Unpublished features | `npm run test:preview` | ⚠️ **50 passed, 1 failed, 1 skipped** in two full runs on this machine; **51 passed, 1 skipped** in a third run of the same specs. The failure is one intermittent test, diagnosed in §1.3 as load-induced. |
| Lighthouse, Accessibility / Best Practices / SEO | Lighthouse 12.3.0, 6 pages × mobile and desktop | ✅ **100 / 100 / 100 on all 12 runs** |
| Lighthouse, Performance | same | Desktop **99–100**. Mobile: parity with v1 in interleaved A/B runs; target not met (see §1.4). |
| Dependencies | `package.json` | **No packages added or removed** in v2 |

### 1.1 e2e by file (v2)

| Spec | Tests | Notes |
|---|---|---|
| `routes.spec.ts` | 48 | Unchanged: every route, metadata, JSON-LD, 22 redirects, sitemap, robots, RSS, headers |
| `a11y.spec.ts` | 43 | axe WCAG 2.0/2.1/2.2 A + AA + best-practice on every page at 1440 and 390, plus open menus, form errors and expanded FAQs: **0 violations**. The reduced-motion test now also checks that no `[data-reveal]` is pending and that every `.motion-*` element, reveal and headline mask has opacity 1, no transform and no clip. |
| `motion.spec.ts` (**new**) | 5 | With JavaScript disabled, every reveal and heading is visible. A fast jump to the page end leaves nothing hidden. Reveals happen once and never re-hide. The H1 reads "Brand. Web. Software. One team." at full opacity. `page-enter` runs on client navigation only, never on first load. |
| `navigation.spec.ts` | 8 | The outside-click test now clicks a fixed point (12, 700), because the v2 Services panel is wide enough to cover the old click target |
| `inquiry.spec.ts` | 12 | Unchanged; the backend and spam protection are untouched |
| `responsive.spec.ts` | 7 | No horizontal scroll at 375–1920; targets ≥ 24 px; reflow at 320 |
| `links.spec.ts` | 2 | Every internal link resolves |

### 1.2 Defects found during v2 and fixed

| Defect | How it was found | Fix |
|---|---|---|
| Revealed elements stayed hidden (the pending rule still matched after reveal) | Screenshots | `[data-reveal].is-pending:not(.is-revealed)` |
| IntersectionObserver missed elements a fast jump skipped past, and never fired for fully clipped `mask` reveals | `motion.spec` (End key) | Replaced by a per-frame scroll sweep |
| Spotlight light offset inside transformed cards (`background-attachment: fixed` breaks under transforms) | Manual review | Element-local pointer coordinates |
| Nav lamp didn't animate (Tailwind translate classes vs the `transform` transition) | Manual review | Inline `transform` from CSS variables |
| Reading-progress bar conflicted with its keyframes | Manual review | Base `transform: scaleX(0)` in CSS |
| Likely-LCP text faded in from opacity 0, delaying LCP | Lighthouse | `.motion-slide` (transform-only) for leads and article figures |
| Hero slab labels hidden behind the slab above | Screenshots | Per-slab x offset |
| axe `definition-list` / `dlitem` violations on service deliverables | `a11y.spec` | Restructured `<dl>` |
| About page scrolled horizontally by 17–37 px | `responsive.spec` | `overflow-hidden` on the mark section |
| axe runs timing out on the homepage under parallel load | `a11y.spec`, `scripts/axe-timing.mjs` | Ambient drift limited to the home hero, started only after interaction; `will-change` only on the drifting layers |
| Mobile Lighthouse regression vs v1 (TBT) | Interleaved A/B with a v1 build, plus Chrome traces | See §1.4 |

### 1.3 The intermittent preview test

`preview.spec.ts › ordering a package pre-fills the inquiry form` failed once in each of two full `test:preview` runs. It passed in a third run of the same specs.

**Symptom.** The click on "Order Logo & Identity" landed on the correct, stable link (per the Playwright trace). Next.js started the client navigation, but the URL hadn't changed within the default 5 s `expect` timeout.

**Diagnosis:**

- **Network:** in the trace, the navigation's RSC request for `/contact-us/?service=…&package=…` started but never completed in the window. RSC prefetches issued at the same moment for other static pages took 4–5 s each.
- **Server, uncontended:** the same RSC request takes about 5 ms (prerendered). The server answered 56 concurrent RSC prefetches in 3–50 ms each.
- **Server inside the suite:** with a request and event-loop logger attached to the server during a real suite run, it showed **100–850 ms event-loop lag** and **0.5–2 s to serve static JS chunks** while the four workers started. This is CPU starvation on a 4-core machine that was also running other projects' servers and processes.
- **Reproduction outside the suite:** 0 failures in 39 attempts (15 sequential, plus 24 across four concurrent browsers). Inside Playwright with four workers and `--repeat-each`, it failed 2 / 8 and 2 / 20.
- **Hypothesis ruled out:** that the card's reveal transition was moving the button mid-click. A test change that waited for the reveal still failed 2 / 20, so it was reverted.

**Conclusion and status.** No application defect was found: the link, the navigation and the server response are all correct. The test is **flaky on this overloaded machine** and has **not** been changed. Neither its timeout nor its behaviour was loosened.

v2 pages likely cost the browser more to render than v1 (gradients, 3D transforms; not measured), which could raise the odds of hitting the timeout on a slow machine. **Recommended:** run `npm run test:preview` in CI (2 workers) or on an idle machine before publishing packages. If it still flakes there, investigate rather than raising the timeout.

### 1.4 Performance — v2 vs v1

**Method:**

- Lighthouse 12.3.0, simulated throttling, against localhost production builds.
- v1 was rebuilt from commit `e293845` in a separate git worktree and served alongside v2.
- A/B runs were **interleaved** (v1, v2, v1, v2) so that machine load affects both equally. Each value is the median of 3 runs.
- Absolute mobile numbers in this session are lower than v1's original quiet-machine results (92–96) because the machine was busy. **Compare v1 and v2 within a row, not against §4.**

**Homepage, mobile — the regression, the fixes, and the result:**

| Run | Build | Perf | FCP | LCP | TBT | Speed Index | Transfer |
|---|---|---|---|---|---|---|---|
| A/B 1 (first v2 build) | v1 | 94 | 1.27 s | 2.86 s | 123 ms | 2.68 s | 316 KB |
| | v2 | **86** | 1.46 s | 2.98 s | 238 ms | 4.60 s | 294 KB |
| A/B 2 (heavier load) | v1 | 83 | 1.87 s | 2.91 s | 428 ms | 2.09 s | 316 KB |
| | v2 | **73** | 2.22 s | 3.36 s | 566 ms | 5.10 s | 294 KB |
| A/B 3a (final v2) | v1 | 82 | 1.71 s | 3.16 s | 375 ms | 4.17 s | 316 KB |
| | v2 | **83** | 1.70 s | 3.16 s | 352 ms | 3.80 s | 294 KB |
| A/B 3b (final v2, repeat) | v1 | 81 | 1.77 s | 3.18 s | 385 ms | 4.21 s | 316 KB |
| | v2 | **81** | 1.72 s | 3.08 s | 439 ms | 4.68 s | 294 KB |

Contact (A/B 1): v1 93 / v2 92. Web development service (A/B 2): v1 79 / v2 81.

**What caused the early regression, and the fixes.** Found with Chrome traces of both builds:

1. The reveal runtime read each element's position after writing classes, forcing a layout per element. It now does one batched read pass in its own frame.
2. The nav lamp was measured in `useLayoutEffect` during hydration. It now uses `useEffect` and `requestAnimationFrame`.
3. Entrance durations were shortened, so the page settles sooner.
4. Geist was preloaded and competed with the stylesheet. It is no longer preloaded (`swap` with a metric-matched fallback).
5. The hero's ambient drift ran from first paint. It now starts only after the first interaction, and only on the homepage hero.

**Final full-category runs.** One run each, final build, same busy machine:

| Page | Mobile P / A11y / BP / SEO | Mobile LCP · TBT · CLS | Desktop P / A11y / BP / SEO | Desktop LCP · CLS |
|---|---|---|---|---|
| `/` | 78 / 100 / 100 / 100 | 3.43 s · 404 ms · 0 | 99 / 100 / 100 / 100 | 0.75 s · 0 |
| `/services/` | 84 / 100 / 100 / 100 | 3.06 s · 363 ms · 0 | 99 / 100 / 100 / 100 | 0.74 s · 0.001 |
| `/web-development-consulting-services/` | 80 / 100 / 100 / 100 | 3.16 s · 460 ms · 0 | 99 / 100 / 100 / 100 | 0.73 s · 0 |
| `/about-us/` | 71 / 100 / 100 / 100 | 3.43 s · 627 ms · 0 | 99 / 100 / 100 / 100 | 0.71 s · 0 |
| `/contact-us/` | 81 / 100 / 100 / 100 | 3.05 s · 482 ms · 0 | 99 / 100 / 100 / 100 | 0.71 s · 0.001 |
| `/the-future-of-digital-marketing/` | 77 / 100 / 100 / 100 | 3.36 s · 559 ms · 0.019 | 100 / 100 / 100 / 100 | 0.71 s · 0 |

Single mobile runs on this machine swing by ±10 points (see the A/B spreads above). Treat the mobile Performance column as noisy, not as a v2-vs-v1 comparison.

**Weight (homepage, production build):**

| | v1 | v2 |
|---|---|---|
| Total transfer (Lighthouse, mobile) | 316 KB | **294 KB** |
| JavaScript, gzipped | 151.4 KB | 153.3 KB (+1.9 KB: motion runtime, nav lamp, template) |
| `MotionRuntime` alone | — | 2.9 KB minified / 1.1 KB gzipped |
| CSS | 43 KB raw / 9.6 KB gzipped | 69.7 KB raw / **14.4 KB gzipped** (motion system, component classes) |
| Third-party requests | 0 | 0 |

**Against the targets:**

| Target | v2 result |
|---|---|
| Desktop Performance ≥ 95 | ✅ 99–100 on all six pages |
| Mobile Performance ≥ 90 | ❌ **Not met on this machine**: 71–84 in single runs, 81–83 in the final A/B medians. This is **parity with v1** measured alongside (81–82). v1 reached 92–96 on a quiet machine earlier the same day, so v2 should land close to that on an idle machine, but that wasn't re-measured. |
| Accessibility / Best Practices / SEO = 100 | ✅ All 12 runs |
| LCP ≤ 2.5 s | ✅ Desktop (0.71–0.75 s). ❌ Mobile lab (2.85–3.43 s); the same for v1 measured alongside. The LCP element is the H1 text; what remains is framework JavaScript under 4× CPU throttling (see §4). |
| CLS ≤ 0.1 | ✅ 0–0.019 everywhere |

### 1.5 Remaining issues and recommendations (v2)

1. **Mobile LCP and mobile Performance targets are not met in the lab**, for v1 or v2. Re-measure on an idle machine, then on the real host, and judge by field data (Search Console, about 28 days after launch).
2. **`test:preview` flakes on this machine** (§1.3). Run it in CI or on an idle machine before turning packages on.
3. **CSS grew** by 4.8 KB gzipped, an acceptable trade for the motion system. Audit unused component classes if it grows further.
4. **Browser coverage:** only Chrome was tested.
   - Scroll-driven effects need `animation-timeline`; Firefox and older Safari show the static design.
   - The FAQ height animation needs `::details-content` and `interpolate-size`; elsewhere the FAQ opens instantly.
   - Both fallbacks were designed for, but haven't been checked in those browsers.
5. **Owner review:** the hero headline "Brand. Web. Software. One team." and the hero stack visual are new. They contain no claims, but the owner should approve them.
6. **21st.dev:** no MCP server was available. Components were studied on the public site and adapted by hand; see `docs/design/component-selection.md`.

---

# v1 report (original rebuild, for history)

Sections 2–5 below describe the v1 rebuild. Test counts there are v1's (120 e2e); v2's are in §1. The v1 performance numbers were measured against the old WordPress site.

## 2. What the tests cover

### Unit tests (`tests/unit`)

- **Validation:** required fields, email and phone formats, header-injection and link-spam rejection, service and package allow-lists, the 2,000-character limit, non-string input.
- **Rate limiter:** limit, per-key isolation, window reset.
- **Delivery:**
  - HTML escaping in the email, and the review flag on fast submissions
  - SMTP config parsing
  - in production with no channel configured, an error is raised rather than a fake success
  - the development log contains no personal data
  - the webhook carries an HMAC signature
  - a failed channel is reported rather than thrown
- **Content integrity:**
  - every service sits in exactly one pillar
  - cross-links resolve; every navigation link maps to a real route
  - every article has its Markdown, its image and no H1
  - package prices are unchanged ($116 / $134 / $116) and packages remain unpublished
  - no real projects, and no placeholders unless previewing
  - down sister sites stay hidden
- **Structured data:** no rating, review, award, hours, area-served or founding-date properties; it uses the published contact details.

### End-to-end tests (`tests/e2e`, Chrome)

**`routes.spec.ts` — 48 tests.** Each of the 18 pages returns 200 with:

- exactly one H1, `lang="en-US"`, the brand in the title, and a 50–170 character description
- the correct canonical, an Open Graph image, and `noindex` only on the thank-you page
- valid JSON-LD; every `<img>` has an `alt` attribute and dimensions

Titles and descriptions are unique. Articles carry BlogPosting data with author and dates. Unknown URLs return a 404 page. `/pricing/` and `/work/` return 404 and aren't linked. All **22 redirects** (WordPress archives, commerce pages, feeds, old sitemaps, `?p=` shortlinks, trailing slash) return 308 to the right place. The sitemap equals exactly the 17 indexable URLs, each returning 200. Robots, the RSS feed and the security headers are checked too.

**`navigation.spec.ts` — 8 tests:**

- Services menu: keyboard open, Esc closes and returns focus, outside click closes, navigation closes it.
- `aria-current` marks the active page; back/forward and refresh of nested routes work.
- The skip link moves focus to `<main>`.
- Mobile dialog: focus never reaches background content, Esc closes and restores focus, links navigate and close, scroll lock is released.
- FAQ disclosures open and close.

**`inquiry.spec.ts` — 12 tests:**

- Error summary (focused, linked to fields) and inline errors that clear on correction; email format checks.
- A **real end-to-end delivery** from a service page (pre-selected service) to a local webhook sink. The payload, page and HMAC signature are verified, and focus moves to the success message.
- `?service=` pre-select.
- Delivery failure: the alert offers phone and email, and the form keeps its input.
- Honeypot submissions are silently dropped; fast submissions are delivered with a flag.
- Server-side validation, cross-site rejection, and rate limiting (the 6th request returns 429).
- The no-JavaScript POST gets a 303 to the thank-you page and is delivered; a no-JavaScript validation error returns a readable page.

**`a11y.spec.ts` — 43 tests.** axe-core with WCAG 2.0/2.1/2.2 A + AA plus best-practice rules runs on all 18 pages and the 404 page, at 1440×900 and 390×844, plus the open services menu, the open mobile menu, the form with errors and all FAQs expanded. **0 violations.** Under `prefers-reduced-motion`, nothing is left hidden or faded.

**`responsive.spec.ts` — 7 tests.** At 375, 390, 768, 1024, 1440 and 1920 px, no page scrolls horizontally, and every button, field, summary, nav link and footer link is at least 24×24 px (WCAG 2.2 target size). Text reflows at 320 px (200% zoom equivalent).

**`links.spec.ts` — 2 tests.** Every internal link on every page (17 unique destinations) returns 200. There are no `#`, empty or `javascript:` links, every external link uses HTTPS, and every in-page anchor has a target.

### Preview tests (`tests/e2e/preview.spec.ts` via `npm run test:preview`)

- The three packages and their prices match the old site, the comparison table lists final formats, and axe is clean.
- "Order Logo & Identity" pre-fills both the service and the package in the form.
- The portfolio placeholders show the "Preview placeholder" label and carry `noindex`.
- The homepage shows both sections, and the nav links to both.

## 3. Visual review

I reviewed full-page screenshots of every template at 390, 768, 1024, 1440 and 1920 px:

- home, services, a service page, about, contact, an article, privacy and 404
- in preview, pricing and work

Issues found this way and fixed:

| Issue | Fix |
|---|---|
| Hero headline ran to five lines at 1440 px and pushed the CTAs below the fold | Display size scale reduced |
| Scroll-linked reveal animations left whole sections invisible in captures and on fast scrolls | Replaced with reveal-once that never hides above-the-fold content |
| Phone number wrapped mid-number | Tabular numbers set to never wrap |
| Crest unreadable at 44 px | Tighter crop |
| Brand link failed WCAG 2.5.3 (Label in Name) | The visible wordmark is now the link's accessible name |
| Form error text failed contrast inside the navy section | Error colour is now a surface token |

Other defects caught by the automated tests and fixed:

| Defect | Fix |
|---|---|
| `/api/contact` without a trailing slash 308-redirected every submission | The form posts to `/api/contact/` |
| React re-render wiped the form's timing and page fields, silently disabling the anti-bot timing check | Values kept in refs |
| Four meta descriptions longer than 170 characters | Shortened |

## 4. Performance — before vs after

### Method and caveats (read first)

- Both sets use **Lighthouse 12.3.0** with its default **simulated throttling** (mobile: Moto G Power class, 4× CPU, slow 4G; desktop preset).
- **Before** = the live WordPress site over the internet (Hostinger), single runs. **After** = the new production build served from **localhost**, so server response time is about 10 ms instead of 0.9–1.8 s. A CDN-hosted deployment will add network TTFB, typically tens to low hundreds of milliseconds. The after-numbers are therefore **lab results for the code, not a promise of field results**.
- **No real-user (CrUX) data** was available: the PageSpeed Insights API returned a quota error. Field Core Web Vitals should be checked in Search Console about 28 days after launch.

### Lighthouse category scores

| Page | Form | Before: Perf / A11y / BP / SEO | After: Perf / A11y / BP / SEO |
|---|---|---|---|
| `/` | Mobile | 47 / 90 / 93 / 69 | **95 / 100 / 100 / 100** |
| `/` | Desktop | 52 / 90 / 93 / 69 | **100 / 100 / 100 / 100** |
| `/web-development-consulting-services/` | Mobile | 61 / 93 / 96 / 77 | **93 / 100 / 100 / 100** |
| `/contact-us/` | Mobile | 56 / 93 / 96 / 77 | **96 / 100 / 100 / 100** |
| `/the-future-of-digital-marketing/` | Mobile | — | **95 / 100 / 100 / 100** |
| `/services/`, `/about-us/` | Mobile | — | 92 and 94 / 100 / 100 / 100 |
| All six pages above | Desktop | — | **100 / 100 / 100 / 100** |

### Core metrics

The after column is the median of three runs.

| Page | Form | Before LCP | After LCP | Before TBT | After TBT | Before CLS | After CLS |
|---|---|---|---|---|---|---|---|
| `/` | Mobile | 3.8 s | **3.04 s** | 1,900 ms | **150 ms** | 0.056 | **0.000** |
| `/` | Desktop | 8.3 s | **0.57 s** | 220 ms | **3 ms** | **0.139 ❌** | **0.000** |
| Web development | Mobile | 5.6 s | **2.94 s** | 280 ms | **175 ms** | 0.003 | **0.000** |
| Contact | Mobile | 3.4 s | **2.68 s** | 1,590 ms | **161 ms** | 0.001 | **0.000** |
| Article | Mobile | — | **3.02 s** | — | **157 ms** | — | **0.000** |
| Article, service and contact pages | Desktop | — | **0.55–0.61 s** | — | ≤ 4 ms | — | ≤ 0.001 |

### Page weight (homepage)

| | Before (mobile) | After |
|---|---|---|
| Requests | 177 | ~28 |
| Total transfer | 2,945 KB mobile / **26,545 KB** desktop | ~316 KB mobile / ~352 KB desktop |
| JavaScript | 57 files, 738 KB | 7 files, ~155 KB (React and Next.js runtime plus three small islands) |
| CSS | 72 files, 334 KB | 1 file, ~10 KB |
| Fonts | 13 files, 617 KB | 3 files, ~63 KB |
| Third-party requests | 25 (484 KB) | **0** |

### Against the targets

| Target | Result |
|---|---|
| **CLS ≤ 0.1** | ✅ Met on every page and width tested (≤ 0.001). |
| **INP ≤ 200 ms** | Not measurable in the lab. The lab proxy, TBT, fell from 220–1,900 ms to 70–175 ms on mobile and ≈ 0 on desktop. |
| **LCP ≤ 2.5 s** | ✅ Desktop (≈ 0.6 s). ⚠️ The **mobile lab profile medians are 2.68–3.04 s, so the target isn't met in this test**. |

The remaining mobile LCP isn't caused by images, fonts or layout:

- The LCP element is the H1 text, which paints at first paint.
- Under 4× CPU throttling, what remains is downloading and parsing the framework JavaScript (React plus the Next.js runtime, ~150 KB). Lighthouse's simulation counts all of it because, on localhost, it loads before the LCP.

Steps tried and measured:

| Step | Result | Kept? |
|---|---|---|
| Inlining CSS | Worse: Next embedded the CSS twice and the HTML doubled | No |
| Preloading all fonts | Slower first paint | No |
| No preloads at all | Desktop CLS of 0.06 from headline re-wrap | No |
| **Preloading only the two Caslon faces with `display: optional`** | Best balance: zero CLS with near-best LCP | **Yes** |

Going further would mean shipping less framework JavaScript (for example a zero-JS framework), which wasn't justified given the owner's Next.js stack. Real-user LCP on a CDN should be judged from field data.

## 5. Not verified, and why

| Item | Reason | Who and when |
|---|---|---|
| Delivery through the real mailbox (SMTP) | No credentials provided; no data was sent to production systems. The SMTP code path is unit-tested; the webhook path is tested end to end. | Owner, on staging, before go-live (`docs/deployment.md`) |
| Real hosting (Vercel or Hostinger) | Host not chosen | At deployment |
| Firefox and Safari | Only Chrome was available on this machine. The code uses standard, widely supported features (`<dialog>`, `<details>`, CSS custom properties). | Recommended manual pass before launch |
| Screen-reader walkthrough (NVDA, VoiceOver) | Automated axe checks and keyboard tests only | Recommended before launch |
| Field Core Web Vitals | No CrUX access; the site isn't live | Search Console, about 28 days after launch |
| 21st.dev components | The 21st.dev MCP server wasn't connected in this session, so no 21st.dev components were searched or used. All components are original. | — |
| UI/UX Pro Max search script | No Python on this machine; the skill's data files were queried directly instead | — |
