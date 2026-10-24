import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHeader } from "@/components/sections/PageHeader";
import { PackageCards, PackageComparison, PackageGuarantees } from "@/components/sections/Packages";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { designPackages, finalFormats, packageIntro, packagesEnabled } from "@/content/packages";
import { pageMetadata } from "@/lib/seo";
import { packagesSchema } from "@/lib/structured-data";

// Built but unpublished: returns 404 (and is left out of navigation and the sitemap) until
// PACKAGES_PUBLISHED is true in src/content/packages.ts.

export function generateMetadata(): Metadata {
  if (!packagesEnabled()) return { title: "Not found", robots: { index: false } };
  return pageMetadata({
    title: "Logo Design Packages & Pricing",
    description: `Logo design packages from American Elite Digital: ${designPackages.map((p) => `${p.name} $${p.price}`).join(", ")}. Unlimited revisions and full ownership rights.`,
    path: "/pricing/",
  });
}

const pricingFaqs = [
  {
    question: "What file formats will I receive?",
    answer: `Final files are supplied in ${finalFormats.join(", ")} formats, so your logo works in print and online.`,
  },
  {
    question: "How many revisions are included?",
    answer: "Every package includes three initial design concepts and unlimited revisions.",
  },
  {
    question: "Who owns the final design?",
    answer: "You do. Every package includes 100% ownership rights to the final design.",
  },
  {
    question: "What if I’m not happy with the result?",
    answer: "Every package comes with a 100% satisfaction guarantee and a money-back guarantee.",
  },
];

export default function PricingPage() {
  if (!packagesEnabled()) notFound();

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Pricing", path: "/pricing/" }]}
        eyebrow="Pricing"
        title={
          <>
            Logo design, <span className="em-accent">priced plainly.</span>
          </>
        }
        lead={packageIntro}
      />
      <section aria-label="Packages" className="section">
        <div className="container-site space-y-10">
          <PackageCards headingLevel="h2" />
          <PackageGuarantees />
        </div>
      </section>
      <section aria-label="Package comparison" className="surface-raised section">
        <div className="container-site">
          <PackageComparison />
          <p className="mt-6 text-small text-fg-muted">
            Need more than a logo? Packages are a starting point for{" "}
            <ArrowLink href="/branding-and-design-consulting-services/">brand identity & design</ArrowLink>
          </p>
        </div>
      </section>
      <section aria-labelledby="faq-title" className="section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <SectionHeading className="lg:col-span-4" id="faq-title" eyebrow="FAQ" title="Package questions" />
          <div className="lg:col-span-8">
            <FaqList faqs={pricingFaqs} />
          </div>
        </div>
      </section>
      <InquirySection title="Order a package or ask a question." defaultService="branding-and-design-consulting-services" />
      <JsonLd data={packagesSchema(designPackages)} />
    </>
  );
}
