import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE_URL, site } from "@/content/site";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

// Geist (one variable file) sets everything; Instrument Serif italic is the accent voice for
// one or two words per headline.
//
// Loading strategy (measured, see docs/testing/verification-report.md):
// - Geist swaps against a metric-matched fallback and is not preloaded: preloading it competed
//   with the stylesheet and delayed first paint on slow connections. Hero lines are short,
//   explicitly broken spans, so the late swap cannot re-wrap them.
// - The serif accent is preloaded with display: optional — used when it arrives in time,
//   otherwise the fallback italic stays for that page view and nothing moves.
// (next/font requires literal options.)
const geist = Geist({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-geist" });
const instrumentSerif = Instrument_Serif({ weight: "400", style: "italic", subsets: ["latin"], display: "optional", preload: true, variable: "--font-instrument" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} — Branding, Websites & Apps`, template: `%s | ${site.name}` },
  description: site.shortDescription,
  applicationName: site.name,
  formatDetection: { telephone: false },
  openGraph: { siteName: site.name, locale: "en_US", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-brand px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <MotionRuntime />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
