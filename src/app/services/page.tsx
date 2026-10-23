import type { Metadata } from "next";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/company";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Digital Services: Brand, Build, Grow & Advise",
  description:
    "Brand identity and logo design, website and app development, digital marketing and SEO, and digital strategy consulting — on their own or as one integrated engagement.",
  path: "/services/",
});

export default function ServicesPage() {
  const catalogue = services.flatMap((s) => s.catalogue.map((c) => ({ ...c, service: s })));

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Services", path: "/services/" }]}
        eyebrow="Services"
        title={
          <>
            Our services, <span className="em-accent">end to end.</span>
          </>
        }
        lead="From brand identity to custom software and the marketing that grows them. Use one service or combine them — every engagement is tailored to your goals and audience."
        actions={
          <ButtonLink href="#inquiry" arrow>
            Start a project
          </ButtonLink>
        }
      />

      <section aria-label="Service practices" className="section">
        <div className="container-site">
          <ServiceIndex headingLevel="h2" />
        </div>
      </section>

      <section aria-labelledby="catalogue-title" className="surface-paper-2 section">
        <div className="container-site">
          <SectionHeading
            id="catalogue-title"
            eyebrow="Catalogue"
            title="Everything we design and build"
            intro="Specific deliverables you can ask for, grouped by the service that delivers them."
          />
          <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {catalogue.map((group) => (
              <div key={group.title} className="border-t border-line pt-6">
                <h3 className="text-title font-semibold">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-xs border border-line bg-bg-raised px-3 py-1.5 text-small">
                      {item}
                    </li>
                  ))}
                </ul>
                <ArrowLink href={`/${group.service.slug}/`} className="mt-4 text-[0.9375rem]">
                  {group.service.name}
                </ArrowLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="section">
        <div className="container-site">
          <SectionHeading
            id="process-title"
            eyebrow="How we work"
            title="One way of working, whatever the project"
            intro="Research before recommendations, a roadmap before production, and measurement after launch."
          />
          <div className="mt-12">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <InquirySection title="Not sure where to start?" intro="Describe what you’re trying to achieve and we’ll recommend the right mix — with initial ideas free of charge." />
    </>
  );
}
