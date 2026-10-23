import type { NextConfig } from "next";

// Security headers. The CSP allows inline scripts/styles because statically generated Next.js
// pages inline their hydration data; no third-party script origins are allowed.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

// WordPress post IDs → article paths, for old /?p=<id> shortlinks.
const shortlinks: Record<string, string> = {
  "1": "/website-optimization-techniques-to-improve-user-experience-and-drive-conversions/",
  "146": "/how-to-create-a-unified-digital-strategy-that-aligns-with-your-business-goals/",
  "147": "/from-brand-awareness-to-conversion-the-power-of-effective-digital-campaigns/",
  "148": "/the-future-of-digital-marketing/",
};

const nextConfig: NextConfig = {
  // Matches the WordPress URL style so every existing URL keeps its exact path.
  trailingSlash: true,
  poweredByHeader: false,
  // Preview builds (npm run test:preview) go to a separate folder so they can never be deployed by accident.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    // Only local images are used; never optimise remote or SVG sources.
    remotePatterns: [],
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
  async redirects() {
    const permanent = true;
    return [
      // Retired WordPress archives and utilities (see docs/audit/seo-audit.md → Redirect map).
      { source: "/category/blog/:rest*", destination: "/blogs/", permanent },
      { source: "/author/:slug/:rest*", destination: "/blogs/", permanent },
      { source: "/:year(\\d{4})/:month(\\d{2})/:rest*", destination: "/blogs/", permanent },
      { source: "/under-construction/", destination: "/", permanent },
      { source: "/shop/", destination: "/branding-and-design-consulting-services/", permanent },
      { source: "/cart/", destination: "/", permanent },
      { source: "/checkout/", destination: "/", permanent },
      { source: "/my-account/", destination: "/", permanent },
      { source: "/elementor-hf/:rest*", destination: "/", permanent },
      { source: "/home/", destination: "/", permanent },
      { source: "/index.php", destination: "/", permanent },
      // Feeds consolidate on /feed/.
      { source: "/comments/feed/", destination: "/feed/", permanent },
      { source: "/:slug/feed/", destination: "/feed/", permanent },
      // Old sitemap locations.
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent },
      { source: "/wp-sitemap-:name.xml", destination: "/sitemap.xml", permanent },
      // WordPress shortlinks.
      ...Object.entries(shortlinks).map(([id, destination]) => ({
        source: "/",
        has: [{ type: "query" as const, key: "p", value: id }],
        destination,
        permanent,
      })),
    ];
  },
};

export default nextConfig;
