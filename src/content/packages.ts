// Logo design packages, transcribed exactly from the (hidden) pricing section of the old homepage.
// The owner asked to keep them unpublished until the prices are confirmed — note the
// Identity & Social Media Kit costs the same as Logo Design despite having more inclusions.
// Flip PACKAGES_PUBLISHED to true only after the owner confirms prices and terms.

export const PACKAGES_PUBLISHED = false;

/** Preview builds can set SHOW_PACKAGES=true to review the pricing UI without publishing it. */
export function packagesEnabled(): boolean {
  return PACKAGES_PUBLISHED || process.env.SHOW_PACKAGES === "true";
}

export type DesignPackage = {
  id: string;
  name: string;
  /** Price in whole US dollars. */
  price: number;
  featured: boolean;
  included: string[];
  /** Items the old page badged "FREE". */
  free: string[];
};

export const packageIntro = "Affordable design packages for your graphic design needs.";

export const finalFormats = ["AI", "EPS", "PSD", "PDF", "JPG", "PNG"] as const;

/** "More features" listed on every package. */
export const packageGuarantees = [
  "24-hour turnaround time",
  "Money-back guarantee",
  "100% satisfaction guarantee",
  "100% ownership rights",
] as const;

export const designPackages: DesignPackage[] = [
  {
    id: "logo-design",
    name: "Logo Design",
    price: 116,
    featured: false,
    included: ["3 design concepts", "Unlimited revisions", "Free mockup", "Grayscale version"],
    free: ["Web icon (favicon)", "Live support 24/7", "Final formats"],
  },
  {
    id: "logo-and-identity",
    name: "Logo & Identity",
    price: 134,
    featured: true,
    included: ["3 design concepts", "Unlimited revisions", "Free mockup", "Grayscale version", "Business card design"],
    free: ["Logo mockup", "Web icon (favicon)", "Live support 24/7", "Final formats"],
  },
  {
    id: "identity-and-social-media-kit",
    name: "Identity & Social Media Kit",
    price: 116,
    featured: false,
    included: [
      "3 design concepts",
      "Unlimited revisions",
      "Free mockup",
      "Grayscale version",
      "Business card design",
      "Profile pictures",
      "Cover photo",
    ],
    free: ["Logo mockup", "Brand kit mockup", "Web icon (favicon)", "Live support 24/7", "Final formats"],
  },
];

export function getPackage(id: string): DesignPackage | undefined {
  return designPackages.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

/** Every distinct deliverable across packages, in first-seen order — rows of the comparison table. */
export const comparisonRows: string[] = Array.from(new Set(designPackages.flatMap((p) => [...p.included, ...p.free])));
