// Verified business facts. Every value here was taken from the live WordPress site
// (header, footer, contact page) on 2026-10-23 — do not add facts that aren't published.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://americanelitedigital.com").replace(/\/$/, "");

export const site = {
  name: "American Elite Digital",
  shortDescription:
    "Brand identity, websites, custom applications and digital marketing for business owners, startups and growing companies.",
  phone: {
    display: "(310) 766-6600",
    href: "tel:+13107666600",
    schema: "+1-310-766-6600",
  },
  email: "info@americanelitedigital.com",
  address: {
    street: "1270 South Alfred St. #1064",
    locality: "Los Angeles",
    region: "CA",
    postalCode: "90035",
    country: "US",
  },
  parentOrganization: "American Elite Enterprises",
  /** Date the site content was last reviewed; used for sitemap lastModified on static pages. */
  contentUpdated: "2026-10-23",
} as const;

export const formattedAddress = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

export type NetworkSite = { name: string; url: string; live: boolean };

/**
 * American Elite Enterprises sister sites, from the old header menu.
 * `live: false` marks sites that failed when checked on 2026-10-23 (HTTP 500/404);
 * they are hidden until the owner confirms they're back.
 */
export const networkSites: NetworkSite[] = [
  { name: "Business Star Makers", url: "https://businessstarmakers.com/", live: false },
  { name: "Global Star Makers", url: "https://globalstarmakers.com/", live: true },
  { name: "American Elite Global Solutions", url: "https://americaneliteglobalsolutions.com/", live: false },
  { name: "American Elite Consultants", url: "https://americaneliteconsultants.com/", live: true },
  { name: "American Elite Accountants", url: "https://americaneliteaccountants.com/", live: true },
  { name: "American Elite Lawyers", url: "https://americanelitelawyers.com/", live: true },
  { name: "American Elite Expert Witnesses", url: "https://americaneliteexpertwitnesses.com/", live: true },
  { name: "American Elite Billing", url: "https://americanelitebilling.com/", live: true },
  { name: "American Elite Executives", url: "https://americaneliteexecutives.com/", live: false },
  { name: "Mobile Caring Docs", url: "https://mobilecaringdocs.com/", live: true },
  { name: "Tech Art Digital", url: "https://techartdigital.com/", live: true },
  { name: "All Dig Tech", url: "https://alldigtech.com/", live: true },
  { name: "Proven Dig Marketers", url: "https://provendigmarketers.com/", live: true },
  { name: "American Elite Foundation", url: "https://americanelitefoundation.org/", live: true },
  { name: "Messiah International Foundation", url: "https://messiahinternationalfoundation.org/", live: true },
  { name: "American Elite Training", url: "https://americanelitetraining.com/", live: true },
  { name: "American Elite Institute", url: "https://americaneliteinstitute.com/", live: true },
];

export const liveNetworkSites = networkSites.filter((s) => s.live);
