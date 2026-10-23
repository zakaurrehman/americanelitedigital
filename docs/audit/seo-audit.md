# SEO audit — before redesign, and the migration plan

**Captured:** 2026-10-23, by crawling every sitemap URL and discovered internal link (34 URLs).
**Limitation:** with no Search Console or analytics access, I can't see current rankings, impressions or backlinks. The redirect plan below therefore preserves **every** indexed URL rather than only the ones known to perform.

## Findings

| # | Issue | Evidence | Impact | Severity | Fix in the redesign |
|---|---|---|---|---|---|
| S1 | **No meta descriptions** | `<meta name="description">` absent on all 26 HTML pages | Google writes its own snippets, often from navigation text | High | A unique description per page (`src/lib/seo.ts`) |
| S2 | **Weak, domain-style titles** | The site title is "americanelitedigital.com"; titles read "About Us – americanelitedigital.com" | No brand or service keywords; poor click-through | High | "{Page topic} \| American Elite Digital", with service keywords |
| S3 | **No H1 on any core page** | 0 H1s on home, about, why, services, contact and all 5 service pages; 3 H1s on each article | Weak topical signal; poor document outline for assistive technology | High | Exactly one H1 per page, enforced by an e2e test |
| S4 | **No structured data** | 0 JSON-LD blocks site-wide | No eligibility for organization, breadcrumb or article enhancements | Medium | Organization/ProfessionalService, WebSite, BreadcrumbList, Service, BlogPosting and FAQPage — **only verified facts**, no ratings or reviews |
| S5 | **No Open Graph or Twitter metadata** | `og:*` absent | Shared links render without title or image | Medium | Per-page Open Graph data plus a generated branded OG image |
| S6 | **Thin and duplicate indexable pages** | Empty shop/cart/checkout/my-account, a 2-word under-construction page, category/author/date archives duplicating the blog list without canonicals | Wasted crawl budget; low-quality signals | Medium | 308 redirects to the closest relevant page (map below) |
| S7 | **Orphaned important pages** | The 5 service pages are linked only from homepage "Read More" buttons; legal pages from nowhere | Little internal link equity reaches the money pages | High | Services in the primary nav, footer and contextual cross-links; legal links in the footer |
| S8 | **Non-descriptive link text** | "Learn More", "Read More", "Read Full Story..." | Weak anchor-text signals; accessibility issue | Medium | Descriptive CTAs ("Start a project", "Explore website design & development") |
| S9 | **Images without alt text** | 18 of 23 homepage images and every service-page image have empty `alt` | Lost image-search relevance; accessibility failure | Medium | Meaningful alt on content images; decorative images marked `alt=""` deliberately |
| S10 | **Off-site links mid-copy** | HBR and HubSpot links inside homepage paragraphs | Sends visitors and link equity away from conversion paths | Low | Internal links instead |
| S11 | **Sitemap includes non-content URLs** | Elementor header/footer templates (301s), cart, checkout, account and under-construction pages | Mixed-quality sitemap | Low | A generated `sitemap.xml` with only canonical, indexable 200 URLs |
| S12 | **Content duplication across pages** | The same "Why Choose Us" paragraphs on the homepage and `/why-choose-us/`; the same service blurbs on the homepage and `/services/` | Pages compete with each other | Medium | Distinct roles: the homepage summarises, service pages go deep, Why Choose Us expands differentiators |
| S13 | **Blog index incomplete** | `/blogs/` lists 3 of 4 posts and shows "Waiting for Content" | One article is under-linked; looks unfinished | Medium | All articles listed and linked from related service pages |
| S14 | **NAP consistency** | Phone, email and address are identical on every page | Good for local search | ✅ keep | NAP is in the footer site-wide and in Organization JSON-LD |

## What the redesign preserves

- **Every existing indexable content URL keeps its exact path, including the trailing slash** (`trailingSlash: true`): `/`, `/about-us/`, `/why-choose-us/`, `/services/`, `/contact-us/`, `/blogs/`, the five service URLs, the four article URLs, `/privacy-policy/` and `/terms-conditions/`.
- Each article keeps its title, wording, publication date, author and featured image.
- `/feed/` still serves RSS 2.0 for the articles.

## Redirect map

The new pages are:

- `/pricing/`: switched off until package prices are confirmed. While off it returns 404 and is excluded from the sitemap.
- `/work/`: returns 404 until a real case study exists. Preview placeholders are always `noindex` and never listed in the sitemap.
- `/contact-us/thank-you/`: `noindex`.

All redirects are permanent. Next.js issues **308**, which search engines treat like a 301.

| Old URL (pattern) | New destination | Reason |
|---|---|---|
| `/category/blog/` and `/category/blog/page/*` | `/blogs/` | Duplicate listing |
| `/author/:slug/` | `/blogs/` | Duplicate listing |
| `/:yyyy/:mm/` and `/:yyyy/:mm/:dd/` | `/blogs/` | Date archives |
| `/under-construction/` | `/` | Placeholder page |
| `/shop/` | `/branding-and-design-consulting-services/` | Store was for design packages; the branding page is the closest live offer |
| `/cart/`, `/checkout/`, `/my-account/` | `/` | Empty commerce utilities |
| `/elementor-hf/:path*` | `/` | Builder templates |
| `/home/`, `/index.php` | `/` | WordPress aliases |
| `/comments/feed/`, `/blogs/feed/`, `/category/blog/feed/`, `/:slug/feed/` | `/feed/` | Consolidated RSS |
| `/wp-sitemap.xml`, `/wp-sitemap-*.xml` | `/sitemap.xml` | The old sitemap location may be registered in Search Console |
| `/?p=1`, `/?p=146`, `/?p=147`, `/?p=148` | The matching article URL | WordPress shortlinks |

The redirect map is implemented in `next.config.ts` and verified in `tests/e2e/routes.spec.ts`.

## Metadata as built

Values are taken from the production build; descriptions are 82–170 characters.

| Route | Title | H1 |
|---|---|---|
| `/` | Branding, Web Design & App Development \| American Elite Digital | Brand, website and software — built by one accountable team. |
| `/services/` | Digital Services: Brand, Build, Grow & Advise \| American Elite Digital | Our services, end to end. |
| `/branding-and-design-consulting-services/` | Branding & Logo Design Consulting \| American Elite Digital | Branding and Design Consulting |
| `/web-development-consulting-services/` | Website Design & Development Consulting \| American Elite Digital | Web Development Consulting |
| `/application-development-consulting-services/` | Web & Mobile App Development Consulting \| American Elite Digital | Application Development Consulting |
| `/digital-marketing-consulting-services/` | Digital Marketing & SEO Consulting \| American Elite Digital | Digital Marketing Consulting |
| `/digital-strategy-consulting-services/` | Digital Strategy & Consulting Services \| American Elite Digital | Digital Strategy & Consulting |
| `/about-us/` | About Us — Los Angeles Digital Partner \| American Elite Digital | About American Elite Digital |
| `/why-choose-us/` | Why Choose Us \| American Elite Digital | Why choose American Elite Digital |
| `/contact-us/` | Contact Us — Start a Project \| American Elite Digital | Start a project, or just ask. |
| `/blogs/` | Insights on Digital Strategy & Marketing \| American Elite Digital | Insights |
| article | {Article title} \| American Elite Digital | {Article title} |

- The service H1s keep the keyword phrase each URL was built around; the benefit statement sits directly beneath.
- `tests/e2e/routes.spec.ts` enforces one H1 per page, a 50–170 character description, a correct canonical, an Open Graph image, and unique titles and descriptions.

## Structured data policy

- **Included, with sources:**
  - name, URL, logo, telephone, email and postal address, from the live footer and contact page
  - the parent network (American Elite Enterprises), from the live navigation
  - service names and descriptions, from the service pages
  - article headline, dates, author and image, from the WordPress REST API
  - FAQ questions and answers that are visible on the page
  - package offers with price and USD currency, emitted only while packages are published
- **Never included:** `aggregateRating`, `review`, `award`, opening hours, geo coordinates, `areaServed` claims, founding date or employee counts. None of these is verified.
