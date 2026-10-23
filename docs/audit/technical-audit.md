# Technical audit — existing platform

**Date:** 2026-10-23.
**Scope:** everything observable from outside: HTTP headers, HTML, asset URLs, the WordPress REST index and public endpoints.
**Access limits:** there is no repository for the current site, and I had no WordPress admin, SFTP, database or Hostinger panel access. Plugin versions come from asset query strings (`?ver=`), which normally match installed versions but can't be confirmed without admin access. **No secrets were accessed or recorded.**

## 1. Repository state

The working directory `americanelitedigital/` was empty, with no git history, `package.json` or lockfile. The production site is a WordPress install managed in Hostinger's hPanel, and no export of it was provided. "Work in the existing repository" therefore means a new codebase in this directory. The old site keeps running untouched until a deliberate cut-over (see `docs/deployment.md`).

## 2. Current stack

| Layer | Observed | Evidence |
|---|---|---|
| Server | Hostinger "hcdn" edge in front of PHP 8.1.34 | `server: hcdn`, `x-powered-by: PHP/8.1.34`, `platform: hostinger` |
| CMS | WordPress 6.6.x | `wp-includes/css/buttons.min.css?ver=6.6.10` |
| Theme | OceanWP 4.2.1 | theme asset URLs |
| Page builder | Elementor 4.1.1, **Elementor Pro 3.7.1** | asset URLs |
| Add-ons | ElementsKit Lite 4.0.7, Royal Elementor Addons 1.7.1069, Essential Addons 6.8.6, Header Footer Elementor 2.9.2 | asset URLs |
| Forms | Forminator 1.58.2 (forms 1061 and 1065), AJAX submit, nonce; WPForms namespace also registered | form markup, `/wp-json/` namespaces |
| Commerce | WooCommerce, with no published products | `/shop/`, `/cart/` pages, `woocommerce-placeholder.png` |
| Other plugins (REST namespaces) | hostinger-easy-onboarding, hostinger-amplitude, elementor-ai, hub-connector, wpmudev_pcs, nps-survey | `/wp-json/` |
| Analytics | **None found in the page source** (no GA4, GTM or Meta pixel) | script inventory |
| Rendering | Fully server-rendered PHP per request; no full-page cache at the edge (`x-hcdn-cache-status: DYNAMIC`) | response headers |

## 3. Findings

| # | Finding | Evidence | Business impact | Severity | Recommended fix |
|---|---|---|---|---|---|
| T1 | **Slow, uncached server responses** | Uncached TTFB 0.8–1.3 s per page; 5.2 s on the first cold homepage hit; Lighthouse "server response time" 0.9–1.76 s | Slow first impressions; worse Core Web Vitals and crawl efficiency | High | Pre-render pages at build time and serve them from a CDN cache |
| T2 | **Plugin sprawl** | About 10 front-end plugins; 57 scripts and 72 stylesheets on the homepage; jQuery, jQuery Migrate and jQuery UI; Isotope, Slick, lightGallery, particles.js, Jarallax, parallax.js, Magnific Popup (twice) and Flickity loaded on pages that don't use them | 738 KB of JavaScript and 1.9 s total blocking time on mobile; a large attack surface | High | Replace with a purpose-built site: no jQuery, no unused libraries |
| T3 | **Elementor Pro 3.7.1 is roughly four years behind Elementor core 4.1.1** | Asset versions | Version skew between core and Pro is a known source of breakage, and old Pro releases carry published vulnerabilities | High | If WordPress stays live during transition, update or remove Elementor Pro. The new site removes the dependency |
| T4 | **WooCommerce active with no products** | Empty shop, cart, checkout and account pages are indexable | Dead pages in search results; extra code and updates to maintain | Medium | Retire the commerce routes with redirects |
| T5 | **reCAPTCHA loaded but not rendered** | `recaptcha/api.js` on every page; no CAPTCHA field in either form | About 390 KB of third-party JavaScript and 1.27 s of main-thread blocking, with no spam protection gained | High | Remove. Use server-side honeypot, timing and rate-limit checks |
| T6 | **Contact-form delivery is unverifiable** | Notification settings live in Forminator admin | Leads may be silently lost; nobody can confirm where submissions go | High | New endpoint with explicit, documented delivery (SMTP or webhook) and a production self-check that fails loudly if delivery isn't configured |
| T7 | **Commercial font possibly self-hosted without a web licence** | `/wp-content/uploads/2024/05/Californian-FB-Bold.woff2` | Licensing exposure | Medium | Use open-licence fonts (SIL OFL) |
| T8 | **4K background videos** | `1118689_4k_Astronomy_3840x2160.mp4` and similar; desktop homepage transfer 26.5 MB | Bandwidth cost; mobile data use; invalid ARIA (`role="presentation"` on video) | High | Remove video backgrounds |
| T9 | **Public login and REST user enumeration** | `/wp-login.php` → 200; `/wp-sitemap-users-1.xml` lists the author slug | A standard WordPress exposure that makes brute-force attempts easier | Medium | Not applicable to the new static front end; restrict access if WordPress is kept |
| T10 | **Few security headers** | Only `content-security-policy: upgrade-insecure-requests` and `permissions-policy`; no HSTS, `X-Content-Type-Options`, `Referrer-Policy` or `frame-ancestors` | Clickjacking and MIME-sniffing protections missing | Medium | Set a full header set at the application level (done in `next.config.ts`) |
| T11 | **No HTTP caching on static assets** | Lighthouse `uses-long-cache-ttl`: 146 resources with short TTLs | Repeat visits re-download assets | Medium | Immutable, content-hashed assets (`Cache-Control: public, max-age=31536000, immutable`) |
| T12 | **Content and layout coupled in Elementor JSON** | Page content can't be reused or versioned | Copy drift (the "Brands Design" residue, wrong card copy); hard to review changes | Medium | Typed content modules in version control |

## 4. Architecture decision for the redesign

I evaluated four options against the actual constraints: about 20 pages, 4 articles, no logged-in users, one form, low publishing frequency (last article edit 2024-10-18), and a performance and SEO mandate.

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Keep WordPress and rebuild in Elementor | Familiar admin | Keeps the plugin weight and PHP TTFB; can't meet the performance targets; no code ownership | Rejected |
| WordPress block theme (FSE) | Keeps the admin; lighter than Elementor | Still PHP-rendered per request; no access to the install to build or test it; content still trapped in the database | Rejected (no access, can't verify) |
| Headless WordPress + Next.js | Keeps the WordPress editor for posts | Two systems to host and patch for four articles; Elementor pages aren't usable headless | Deferred: worth revisiting if publishing resumes weekly |
| **Next.js (App Router) with static generation and typed content in the repo** | Pre-rendered HTML; tiny client JavaScript; full control of SEO, metadata and structured data; one deployable unit; matches the user's existing Next.js 16 / React 19 / Tailwind 4 projects | Copy edits need a code change and redeploy; no WYSIWYG | **Selected** |

**Why not Astro?** It would ship even less JavaScript, but every other project in this workspace uses Next.js 16, so maintainability for this owner favours Next.js. With server components and only two small client islands, the JavaScript cost stays low (measured in `docs/testing/verification-report.md`).

**Migration risks and mitigations:**

- **URL changes:** every existing URL is either preserved exactly (trailing slashes kept) or 301/308-redirected. See `docs/audit/seo-audit.md` §Redirect map.
- **Content loss:** all page copy, the four articles (converted to Markdown with wording preserved), FAQs, legal text, contact details and package data were migrated.
- **Form continuity:** the new endpoint must have SMTP or webhook credentials before launch, and the production build refuses to report success without them.
- **Rollback:** the WordPress site stays untouched. Rollback means pointing DNS (or the Hostinger domain binding) back to it. See `docs/deployment.md`.
