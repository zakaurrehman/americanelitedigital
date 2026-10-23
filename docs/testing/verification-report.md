# Verification report

**Date:** 2026-10-23. All results are from the production build (`npm run build` → `next start`) on Windows 11 with Chrome 155 and Node 24.15.

## 1. Summary

| Check | Command | Result |
|---|---|---|
| Type check (strict) | `npm run typecheck` | ✅ 0 errors |
| Lint (Next core-web-vitals + TypeScript rules) | `npm run lint` | ✅ 0 problems |
| Unit tests | `npm test` | ✅ **34 / 34** passed (4 files) |
| Production build | `npm run build` | ✅ 28 routes (26 static/SSG pages, `/api/contact` dynamic, `/feed` static) |
| End-to-end, accessibility and responsive | `npm run test:e2e` | ✅ **120 passed**, 4 skipped (preview-only specs), 0 failed, 136 s |
| Unpublished features (packages, portfolio placeholders) | `npm run test:preview` | ✅ **51 passed**, 1 skipped (the "hidden in production" assertion), separate `.next-preview` build |
| Dependency audit | `npm audit` | ⚠️ 5 high, all one dev-only chain (`braces` via `eslint-config-next`); no fix exists; no runtime exposure. See `docs/architecture.md` → Security. |

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
