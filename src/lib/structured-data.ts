// JSON-LD builders. Only facts published by the business are emitted — no ratings, reviews,
// awards, opening hours or service-area claims (see docs/audit/seo-audit.md).

import type { Faq, Service } from "@/content/services";
import type { Insight } from "@/content/insights";
import type { DesignPackage } from "@/content/packages";
import { site } from "@/content/site";
import { absoluteUrl } from "./seo";

const ORG_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/american-elite-digital-logo.png"),
    image: absoluteUrl("/brand/american-elite-digital-logo.png"),
    description: site.shortDescription,
    telephone: site.phone.schema,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    parentOrganization: { "@type": "Organization", name: site.parentOrganization },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: site.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    serviceType: service.name,
    description: service.metaDescription,
    url: absoluteUrl(`/${service.slug}/`),
    provider: { "@id": ORG_ID },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.name,
      itemListElement: service.deliverables
        .flatMap((g) => g.items)
        .map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d.title, description: d.body } })),
    },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleSchema(insight: Insight) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: insight.title,
    description: insight.summary,
    datePublished: insight.published,
    dateModified: insight.modified,
    image: absoluteUrl(insight.image.src),
    url: absoluteUrl(`/${insight.slug}/`),
    mainEntityOfPage: absoluteUrl(`/${insight.slug}/`),
    author: { "@type": "Person", name: insight.author },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function packagesSchema(packages: DesignPackage[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Logo design packages",
    itemListElement: packages.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price.toFixed(2),
      priceCurrency: "USD",
      url: absoluteUrl(`/pricing/#${p.id}`),
      seller: { "@id": ORG_ID },
    })),
  };
}
