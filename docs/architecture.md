# Architecture

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.4.2** (App Router), React 19.3, TypeScript 5.9 (strict, `noUncheckedIndexedAccess`) | Matches the owner's other projects. Every page is pre-rendered at build time; one small API route. 16.4.2 patches a critical image-optimiser RCE in 16.0–16.4.0. |
| Styling | **Tailwind CSS 4.3**, with tokens in `src/app/globals.css` | Utility classes on top of semantic design tokens; shared component classes (`.btn`, `.card`, `.spot`, `.field-input`, `.prose-editorial`) and the motion system (keyframes, reveal rules, scroll-driven animations). See `docs/design/design-system.md`. |
| Fonts | `next/font/google` (Geist, Instrument Serif italic), self-hosted at build time | No requests to third-party font services at runtime. |
| Motion | CSS plus one small client component (`MotionRuntime`, ~1 KB gzipped) | No animation library. See "Motion runtime" below. |
| Icons | `lucide-react` | One consistent SVG family, tree-shaken. |
| Markdown | `react-markdown` (server-rendered only) | Articles stay editable as Markdown and ship no client JavaScript. |
| Email | `nodemailer` (server only) | SMTP through the existing mailbox, so no new vendor. |
| Tests | Vitest 5 (unit), Playwright 1.63 + axe-core (e2e and accessibility) | — |

There is no database, CMS, state library, animation library or UI kit. Native `<details>` and `<dialog>` replace accordion and modal libraries. The site's own client JavaScript is four small islands: `HeaderNav`, `InquiryForm`, `MotionRuntime` and the route `template.tsx`. v2 added no dependencies.

## Directory map

```
src/
  app/                         Routes (App Router). Every page is static except /api/contact.
    page.tsx                   Home
    services/                  Services overview
    <five service slugs>/      One-line route files; all render components/sections/ServicePage
    [slug]/                    Articles at the site root (WordPress URLs preserved; dynamicParams=false)
    about-us/ why-choose-us/ contact-us/ contact-us/thank-you/ blogs/ privacy-policy/ terms-conditions/
    pricing/                   Built, returns 404 until packages are published
    work/                      Built, returns 404 until a real case study exists
    api/contact/route.ts       Inquiry endpoint (Node runtime)
    feed/route.ts              RSS 2.0 at /feed/
    sitemap.ts robots.ts not-found.tsx layout.tsx globals.css icon.png apple-icon.png
    template.tsx               Client; adds the page-enter animation on client navigations only
  components/
    layout/                    SiteHeader, HeaderNav (client), SiteFooter, BrandMark, MobileCtaBar (phones only)
    motion/                    MotionRuntime (client): reveals, spotlight, magnetic, tilt, has-interacted
    home/                      HeroVisual (hero photo collage), Marquee (service band)
    sections/                  Page sections and templates (ServicePage, ServicePackages, Testimonials, LegalPage, PageHeader, …)
    inquiry/                   InquirySection (server), InquiryForm (client)
    ui/                        ButtonLink, SectionHeading, Breadcrumbs, JsonLd, Ornament (GlowRule), icons (pillar/value icons)
  content/                     All copy and business facts, typed — edit here, not in components
    site.ts services.ts company.ts packages.ts projects.ts testimonials.ts insights.ts legal.ts navigation.ts
    media.ts                   Photo registry (static imports, alt text); sources in docs/design/image-credits.md
    insights/*.md              Article bodies
  lib/
    seo.ts                     Per-page metadata helper (canonical, Open Graph, Twitter)
    structured-data.ts         JSON-LD builders (verified facts only)
    insights.server.ts         Reads article Markdown (server-only)
    inquiry/validate.ts        Shared client and server validation (no dependencies)
    inquiry/rate-limit.ts      In-memory fixed-window limiter
    inquiry/deliver.ts         SMTP and webhook delivery (server-only)
  instrumentation.ts           Logs a startup error if production has no delivery channel
public/brand/                  Logo assets made from the owner's artwork by scripts/build-logo-assets.mjs (lockups, emblem)
public/images/photos/          Licensed Unsplash photography (see docs/design/image-credits.md)
public/images/insights/        Article images (resized from the WordPress originals)
public/og/default.png          Branded social card
tests/unit/                    Vitest
tests/e2e/                     Playwright (+ support/webhook-sink.mjs, support/routes.ts)
scripts/test-preview.mjs       Builds with unpublished features to .next-preview/ and tests them
scripts/build-logo-assets.mjs  Rebuilds public/brand/ from a new logo JPEG (see docs/design/image-credits.md)
scripts/axe-timing.mjs         Diagnostic, not part of the suite: times axe rule groups on one page
```

## Rendering and data flow

- **Pages** are server components rendered once at build time (`○`/`●` in the build output) into static HTML. Content comes from typed modules in `src/content/` at build time, with no runtime data fetching.
- **Client components** receive plain props only. For example, `SiteHeader` passes just labels, links and summaries to `HeaderNav`, so the service copy never ships to the browser.
- **Inquiry flow:**
  1. `InquiryForm` validates in the browser.
  2. It POSTs JSON to `/api/contact/`.
  3. The route runs, in order: same-origin check, 16 KB body limit, honeypot (silently dropped), timing check (flags submissions under 2 s, doesn't drop them), per-IP rate limit (5 per 10 minutes), and server validation with the same module the browser used.
  4. It delivers via SMTP and/or webhook (`Promise.allSettled`). The inquiry counts as delivered if any channel succeeds; otherwise the visitor gets a 503 with the phone number and email.
  5. Without JavaScript, the same route accepts a form POST and redirects to `/contact-us/thank-you/`, or returns a minimal error page.

## Motion runtime

Server components opt in to motion with data attributes, so they stay server components. `MotionRuntime`, mounted once in `layout.tsx`, is the only script that reads them.

| Attribute / class | Effect |
|---|---|
| `data-reveal[="fade"\|"scale"\|"mask"]` | Reveal-once. Stagger with `style={{ "--i": n }}`. |
| `data-spotlight` + `.spot` children | Shared cursor light |
| `data-magnetic` | Element drifts toward the pointer |
| `data-tilt` | Exposes `--tilt-x` / `--tilt-y` |
| `html.has-interacted` | Set on the first pointer move, scroll, key or touch; starts the homepage hero drift |

How the runtime behaves:

- **Reveals are scanned on every route change** (the effect depends on `pathname`).
  - The first pass runs in its own animation frame and reads every position before writing any class (one layout).
  - Elements already above the 90% line are marked `.is-revealed` at once. Only those below it get `.is-pending`, the only class the CSS hides.
  - A passive scroll and resize sweep (one per frame) reveals the rest, and detaches when nothing is pending.
- **Pointer effects** share one `pointermove` listener and one write pass per frame, for mouse and pen only.
- **Failure-safe by construction.** Without JavaScript, nothing is `.is-pending`, so nothing is hidden. Headline masks and entrances are pure CSS. Under reduced motion the runtime does nothing.
- **Page transitions:** `template.tsx` remounts on each navigation. A module-level flag skips the first mount, so the entrance animation never delays the initial paint or LCP.

Scroll-linked effects (ticker, process beam, statement sweep, parallax, reading progress, header) are pure CSS `animation-timeline`. They sit behind `@supports`, so browsers without scroll timelines show the static design.

## Feature switches

| Switch | Where | Effect |
|---|---|---|
| `PACKAGES_PUBLISHED` | `src/content/packages.ts` | `false` (owner decision, 2026-10-23). When `true`: `/pricing/`, the package sections on the homepage and branding page, the nav link, the package select in the form, and the OfferCatalog JSON-LD all appear. |
| `SHOW_PACKAGES=true` | env, preview only | The same, without editing code. Used by `npm run test:preview`. |
| `projects` array | `src/content/projects.ts` | Adding one real, client-approved project turns on `/work/`, the homepage "Selected work" section, the nav link and the sitemap entry. |
| `testimonials` array | `src/content/testimonials.ts` | Adding one real, client-approved quote turns on the homepage "What our clients say" section. No star ratings and no Review schema. |
| `PREVIEW_PLACEHOLDER_WORK=true` | env, preview only | Renders three clearly labelled placeholder case studies (always `noindex`, never in the sitemap) and three placeholder testimonials. **Never set it in production.** |

## Editing content

| Task | Steps |
|---|---|
| Change copy | Edit the relevant file in `src/content/`. Types catch missing fields. |
| Add an article | Add `src/content/insights/<slug>.md` (no `#` H1; start with the intro paragraph), add an entry to `insights.ts` with an image in `public/images/insights/`, and optionally reference the slug from a service's `insights` list. The route, sitemap, RSS and JSON-LD update automatically. |
| Change a photo | Add the image to `public/images/photos/`, register it with descriptive alt text in `src/content/media.ts`, and point `pillarPhotos`, `servicePhotos` or a page at it. Record the source in `docs/design/image-credits.md`. Prefer real photos of the team and delivered work over stock. |
| Add a testimonial | Add a `Testimonial` to `testimonials` in `src/content/testimonials.ts` with `clientApproved: true`. Use the client's own words and the name and role they agreed to show. |
| Add a case study | Add a `Project` to `projects` in `src/content/projects.ts` with `clientApproved: true`, plus an image in `public/`. Only add measured, client-approved results. |
| Publish packages | Confirm prices and guarantees, set `PACKAGES_PUBLISHED = true`, and update the price assertion in `tests/unit/content.test.ts` if prices change. |
| Bring back a sister site | Set `live: true` in `src/content/site.ts`. |

## Content provenance

- Business facts (phone, email, address, network), service copy, FAQ answers, values, methodology, package terms, legal text and the four articles all come from the live WordPress site, captured 2026-10-23.
- The articles were converted to Markdown with the wording kept. Two typos were fixed: a doubled "in in" and a missing full stop. Lists flattened into paragraphs were restored, and title case was normalised in two titles.
- **Written for the redesign** (the owner should review): the hero, section headings and intros, each service's "Sound familiar?" problems, and the process steps. The process copy condenses the methodology the old About and Why Choose Us pages already describe.
- **Not carried over:** stock images with baked-in text, the Business Star Makers endorsement banner, off-site HubSpot and HBR links, the "Brands Design" CTA band, and the empty WooCommerce pages.

## Security

- Security headers are set in `next.config.ts`: CSP with no third-party origins and `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer-Policy, Permissions-Policy and `X-Frame-Options`. `x-powered-by` is removed. A test asserts these.
- Secrets exist only in environment variables (`.env.example` lists them, with no values). Nothing secret reaches the client bundle; delivery code imports `server-only`.
- User input is escaped in the HTML email. Line breaks are rejected in single-line fields, preventing header injection. JSON-LD escapes `<`.
- Images: local sources only, no SVG optimisation (`dangerouslyAllowSVG: false`), and the patched Next.js version.
- `npm audit`: the remaining 5 "high" advisories are one chain (`braces` ≤ 3.0.3 via `eslint-config-next` → `fast-glob` → `micromatch`). It runs only in ESLint over our own files. No patched `braces` exists; there is no runtime exposure.

## Known limitations

- The rate limiter is per process and in memory. On serverless or multi-instance hosts each instance counts separately, and it keys on `X-Forwarded-For`, which some proxies let clients influence. Treat it as a first layer; add Cloudflare Turnstile or an edge rate limit if spam appears.
- Next.js carries query strings through redirects, so `/?p=146` lands on the article with `?p=146` appended. The canonical tag points to the clean URL.
- Copy changes require a deploy. If the owner starts publishing weekly, revisit a headless CMS (see `docs/audit/technical-audit.md` §4).
