# Website inventory — americanelitedigital.com (pre-redesign)

**Captured:** 2026-10-23, from the live production site.
**Method:** the WordPress sitemap index (`/wp-sitemap.xml` and its five child sitemaps), `robots.txt`, a crawler that followed every internal link, the WordPress REST API (`/wp-json/wp/v2/posts`, `/media`), and headless Chrome screenshots at 390px, 768px and 1440px.
**Limitations:** I had no WordPress admin, database or theme-file access, so drafts, private pages, plugin settings and form-notification settings could not be inspected. Some 1440px captures failed because a background-video page navigated mid-capture; the 390px and 768px captures cover every key page.

## Platform at a glance

| Item | Finding |
|---|---|
| CMS | WordPress 6.6.x (from `wp-includes` asset versions), PHP 8.1.34 |
| Theme / builder | OceanWP 4.2.1 + Elementor 4.1.1 + Elementor Pro 3.7.1 |
| Add-ons | ElementsKit Lite, Royal Elementor Addons, Essential Addons, Header Footer Elementor, Forminator, WooCommerce, WPForms (REST namespace only) |
| Host | Hostinger (`platform: hostinger`, hcdn edge). Pages are not cached at the edge (`x-hcdn-cache-status: DYNAMIC`) |
| Site title | "americanelitedigital.com", which is a domain, not the brand name; the tagline is empty |

## Route inventory

TTFB was measured from a single uncached request on 2026-10-23. All routes use HTTPS; `www` and `http` both 301 to `https://americanelitedigital.com/`.

### Primary pages (in navigation)

| URL | Status | TTFB | HTML | Purpose / notes |
|---|---|---|---|---|
| `/` | 200 | 1,197 ms (5.2 s on first cold hit) | 309 KB | Homepage. No H1. Hero uses white on salmon (2.19:1). Contains a hidden pricing block |
| `/about-us/` | 200 | 821 ms | 164 KB | Who we are, goal, mission (heading duplicated), values, methodology. "Start A Project With Brands Design!" template residue |
| `/why-choose-us/` | 200 | 820 ms | 160 KB | Five differentiators; two headings duplicated; "Brands Design" residue |
| `/services/` | 200 | 873 ms | 174 KB | Eight services, three of which have no detail page (Business Consulting, Analytics & Reporting, Content Creation) |
| `/contact-us/` | 200 | 781 ms | 145 KB | Phone, email and address set as H2s; a Forminator form (first name, email, phone, message) |

### Service detail pages (reachable only from homepage "Read More" links)

| URL | Status | Notes |
|---|---|---|
| `/digital-marketing-consulting-services/` | 200 | PPC, social, content, email, CRO, plus a full SEO sub-section |
| `/digital-strategy-consulting-services/` | 200 | Audits, roadmaps, technology integration |
| `/application-development-consulting-services/` | 200 | Custom web apps, mobile (iOS/Android), enterprise software |
| `/web-development-consulting-services/` | 200 | UX/UI, sites, e-commerce, CMS, mobile-first, maintenance |
| `/branding-and-design-consulting-services/` | 200 | Strategy, logo/identity, voice, digital design, collateral, rebranding |

On every service page the whole intro is one H2 of 80–150 words. None of these pages is linked from the main navigation or the `/services/` page.

### Content (articles)

| URL | Published | Modified | Notes |
|---|---|---|---|
| `/website-optimization-techniques-to-improve-user-experience-and-drive-conversions/` | 2024-05-19 | 2024-10-18 | Three H1s; author byline marked up as an H2 |
| `/how-to-create-a-unified-digital-strategy-that-aligns-with-your-business-goals/` | 2024-05-24 | 2024-10-18 | Same structure |
| `/from-brand-awareness-to-conversion-the-power-of-effective-digital-campaigns/` | 2024-05-24 | 2024-10-18 | Same structure |
| `/the-future-of-digital-marketing/` | 2024-05-24 | 2024-10-18 | Same structure |
| `/blogs/` | 200 | — | Lists only 3 of 4 posts and shows a "Waiting for Content" placeholder |

Byline on all four articles: Daniel Shane Sheibani Davidson, MD, MBA, DBA, PHD.

### Legal

| URL | Status | Notes |
|---|---|---|
| `/privacy-policy/` | 200 | Not linked from header or footer; reachable only via the sitemap. Mentions a "Last Updated" date that is never displayed |
| `/terms-conditions/` | 200 | Not linked from header or footer. "Governing Law" doesn't name a state |

### Low-value or accidental routes (indexable)

| URL | Status | Problem |
|---|---|---|
| `/shop/`, `/cart/`, `/checkout/`, `/my-account/` | 200 | Empty WooCommerce pages with no products ("Your cart is currently empty!") |
| `/under-construction/` | 200 | Indexable two-word page, listed in the sitemap |
| `/category/blog/`, `/author/americanelitedigital-com/` | 200 | Duplicate post listings with no canonical tag |
| `/2024/05/19/`, `/2024/05/24/` | 200 | Date archives, duplicate listings with no canonical tag |
| `/elementor-hf/header/`, `/elementor-hf/footer/` | 301 → `/` | Builder templates exposed in the sitemap |
| `/feed/`, `/comments/feed/`, `/blogs/feed/`, `/category/blog/feed/`, `/<post>/feed/` | 200 | RSS feeds (worth preserving at least `/feed/`) |
| `/?p=1`, `/?p=146`–`148` | 301 | WordPress shortlinks to the four posts |
| `/wp-login.php` | 200 | Public login screen (standard WordPress, but exposed) |

### Routes that do not exist (verified 404)

`/pricing/`, `/portfolio/`, `/faq/`, `/sitemap_index.xml`. **The site has no portfolio, case studies, testimonials, team page or pricing page.** Unknown URLs return a themed 404 (correct status).

## Navigation

- **Header:** Home, About Us, Why Choose Us, Services, Contact Us, and a "Visit Other American Elite Enterprises Sites" dropdown with 19 entries.
  - The dropdown includes American Elite Digital itself, plus an "Under Construction" item linking to `#`.
  - Three sister sites failed when checked on 2026-10-23: `businessstarmakers.com` (500), `americaneliteglobalsolutions.com` (404), `americaneliteexecutives.com` (500). The other 14 returned 200.
- **Footer:** phone, email, address, an "About" blurb, a second copy of the contact form, and Facebook / Twitter / YouTube icons with **no `href`**. There are no legal links. Copyright text reads "All Right Reserved www.americaneliteDigital.com".
- **Service detail pages and legal pages are not in any menu.**

## Calls to action

| CTA | Destination | Status |
|---|---|---|
| Hero "Learn More" | `/contact-us/` | Works, but the label doesn't describe the destination |
| Package "Order Now" (×3) | `#` | **Dead link** (the section is hidden, see below) |
| "Contact Us" (Innovative Solutions) | `/contact-us/` | Works |
| "Read More" (Client-Centric) | `/about-us/` | Works |
| Second "Read More" (Consulting Services card) | `#` | **Dead link** |
| "Get Started" (Brands Design band) | `/contact-us/` | Works, but the band names another brand |
| Social icons | none | **No destination** |

## Hidden pricing

The homepage contains three logo-design packages inside an Elementor section hidden on desktop, tablet and mobile, so visitors never see them. Their CTAs link to `#`.

| Package | Price | Inclusions |
|---|---|---|
| Logo Design | $116 | 3 concepts, unlimited revisions, free mockup, grayscale version, free favicon, free 24/7 live support |
| Logo & Identity ("Best Choice") | $134 | Logo Design inclusions + business card design and logo mockup |
| Identity & Social Media Kit | $116 | Identity inclusions + profile pictures, cover photo, brand kit mockup |

- **All packages:** final formats .ai, .eps, .psd, .pdf, .jpg and .png; 24-hour turnaround; money-back guarantee; 100% satisfaction guarantee; 100% ownership rights.
- **Possible price error:** the Social Media Kit costs the same as Logo Design despite having the most inclusions.
- **Owner decision (2026-10-23):** keep the packages unpublished until prices are confirmed. The redesign builds them behind a switch (see `docs/architecture.md`).

## Media library

76 items. There are no portfolio or project images. Usable items:

- the brand logo (`AmericanEliteBilling-logo-design.png`; despite the filename, it is the American Elite **Digital** crest)
- four article featured images (stock photography)

Everything else is generic stock: video backgrounds of up to 3840×2160, images with baked-in text ("DIGITAL MARKETING", "CORE VALUES"), and a sister-brand promotional banner ("Optimized by Business Star Makers as Endorsed by Dr. Dan Davidson").

## Content facts carried into the redesign (verified on the live site)

- **Name:** American Elite Digital
- **Phone:** (310) 766-6600
- **Email:** Info@americanelitedigital.com
- **Address:** 1270 South Alfred St. #1064, Los Angeles, CA 90035
- **Network:** part of American Elite Enterprises; the 14 sister sites that resolved on 2026-10-23 are listed in `src/content/site.ts`
- **Offer:** "Describe your requirements & we shall provide you with ideas free of cost."
- **Service catalogue:** taken from the homepage "Browse All Services" list and the five service pages
- **FAQs:** six homepage FAQs
- **Legal:** the privacy policy and terms, kept verbatim
