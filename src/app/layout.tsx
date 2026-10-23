import type { Metadata, Viewport } from "next";
import { Libre_Caslon_Display, Libre_Caslon_Text, Public_Sans } from "next/font/google";
import { RevealOnScroll } from "@/components/layout/RevealOnScroll";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE_URL, site } from "@/content/site";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

// Caslon (early American printing) for display, Public Sans (Franklin Gothic lineage) for text.
//
// Loading strategy (measured, see docs/testing/verification-report.md):
// - Caslon faces set the large headlines, where a late swap re-wraps lines and shifts the page
//   (CLS 0.06 on desktop). They are preloaded with display: optional — used when they arrive in
//   time, otherwise the fallback stays for that page view and nothing moves. Cached afterwards.
// - Public Sans (body) swaps without a preload: its fallback is metric-matched, so the swap
//   doesn't shift layout, and skipping the preload leaves bandwidth for the stylesheet.
// (next/font requires literal options, so they are repeated rather than shared.)
const caslonDisplay = Libre_Caslon_Display({ weight: "400", subsets: ["latin"], display: "optional", preload: true, variable: "--font-caslon-display" });
const caslonText = Libre_Caslon_Text({ weight: "400", style: "italic", subsets: ["latin"], display: "optional", preload: true, variable: "--font-caslon-text" });
const publicSans = Public_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-public-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} — Branding, Websites & Apps`, template: `%s | ${site.name}` },
  description: site.shortDescription,
  applicationName: site.name,
  formatDetection: { telephone: false },
  openGraph: { siteName: site.name, locale: "en_US", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#f6f2ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${caslonDisplay.variable} ${caslonText.variable} ${publicSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-sm bg-[var(--aed-navy)] px-4 py-3 font-semibold text-[var(--aed-paper)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <RevealOnScroll />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
