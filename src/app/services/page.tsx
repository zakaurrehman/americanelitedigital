import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServicePackages } from "@/components/sections/ServicePackages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/company";
import { services } from "@/content/services";
import { photos } from "@/content/media";
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
        image={photos.workshop}
        actions={
          <ButtonLink href="#inquiry" arrow magnetic>
            Get a free consultation
          </ButtonLink>
        }
      />

      <section id="compare" aria-labelledby="compare-title" className="section scroll-mt-[calc(var(--header-h)+1rem)]">
        <div className="container-site">
          <SectionHeading
            id="compare-title"
            eyebrow="Compare services"
            size="l"
            title={
              <>
                Choose the service <span className="em-accent">you need.</span>
              </>
            }
            intro="What each service is for, what’s included, and how to start. Not sure which fits? Book a free consultation and we’ll recommend the right mix."
          />
          <div className="mt-14">
            <ServicePackages />
          </div>
        </div>
      </section>

      <section aria-labelledby="catalogue-title" className="surface-raised section">
        <div className="container-site">
          <SectionHeading
            id="catalogue-title"
            eyebrow="Catalogue"
            size="l"
            title={
              <>
                Everything we <span className="em-accent">design and build.</span>
              </>
            }
            intro="Specific deliverables you can ask for, grouped by the service that delivers them."
          />
          <div data-spotlight className="mt-16 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {catalogue.map((group, i) => (
              <Link
                key={group.title}
                href={`/${group.service.slug}/`}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
                className="card spot lift group flex flex-col p-7"
              >
                <span className="text-title font-semibold text-brand">{group.title}</span>
                <span className="mt-1 text-small text-fg-subtle">{group.service.name}</span>
                <span className="mt-6 flex flex-1 flex-wrap content-start gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </span>
                <span className="mt-8 flex items-center justify-between text-fg-muted">
                  <span className="text-small">View service</span>
                  <span className="arrow-disc">
                    <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <SectionHeading
                id="process-title"
                eyebrow="How we work"
                title="One way of working, whatever the project"
                intro="Research before recommendations, a roadmap before production, and measurement after launch."
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <InquirySection title="Not sure where to start?" intro="Describe what you’re trying to achieve and we’ll recommend the right mix — with initial ideas free of charge." />
    </>
  );
}
