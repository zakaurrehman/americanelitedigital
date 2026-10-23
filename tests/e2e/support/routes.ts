// Every public route of the site. Kept explicit (not derived from app code) so a route that
// disappears or is renamed fails the suite.
export const SERVICE_ROUTES = [
  "/branding-and-design-consulting-services/",
  "/web-development-consulting-services/",
  "/application-development-consulting-services/",
  "/digital-marketing-consulting-services/",
  "/digital-strategy-consulting-services/",
];

export const ARTICLE_ROUTES = [
  "/the-future-of-digital-marketing/",
  "/from-brand-awareness-to-conversion-the-power-of-effective-digital-campaigns/",
  "/how-to-create-a-unified-digital-strategy-that-aligns-with-your-business-goals/",
  "/website-optimization-techniques-to-improve-user-experience-and-drive-conversions/",
];

export const INDEXABLE_ROUTES = [
  "/",
  "/services/",
  ...SERVICE_ROUTES,
  "/about-us/",
  "/why-choose-us/",
  "/contact-us/",
  "/blogs/",
  ...ARTICLE_ROUTES,
  "/privacy-policy/",
  "/terms-conditions/",
];

/** Rendered but not indexed. */
export const UTILITY_ROUTES = ["/contact-us/thank-you/"];

export const ALL_PAGES = [...INDEXABLE_ROUTES, ...UTILITY_ROUTES];

export const CANONICAL_ORIGIN = "https://americanelitedigital.com";

/** Old WordPress URL → expected destination (see docs/audit/seo-audit.md). */
export const REDIRECTS: [string, string][] = [
  ["/about-us", "/about-us/"],
  ["/category/blog/", "/blogs/"],
  ["/category/blog/page/2/", "/blogs/"],
  ["/author/americanelitedigital-com/", "/blogs/"],
  ["/2024/05/19/", "/blogs/"],
  ["/2024/05/24/", "/blogs/"],
  ["/under-construction/", "/"],
  ["/shop/", "/branding-and-design-consulting-services/"],
  ["/cart/", "/"],
  ["/checkout/", "/"],
  ["/my-account/", "/"],
  ["/elementor-hf/header/", "/"],
  ["/elementor-hf/footer/", "/"],
  ["/home/", "/"],
  ["/index.php", "/"],
  ["/comments/feed/", "/feed/"],
  ["/blogs/feed/", "/feed/"],
  ["/the-future-of-digital-marketing/feed/", "/feed/"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/wp-sitemap-posts-page-1.xml", "/sitemap.xml"],
  ["/?p=148", "/the-future-of-digital-marketing/"],
  ["/?p=146", "/how-to-create-a-unified-digital-strategy-that-aligns-with-your-business-goals/"],
];
