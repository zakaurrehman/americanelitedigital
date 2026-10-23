import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHeader } from "@/components/sections/PageHeader";
import { PackageCards } from "@/components/sections/Packages";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getInsight } from "@/content/insights";
import { packageIntro, packagesEnabled } from "@/content/packages";
import { getPillar, getService } from "@/content/services";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/structured-data";

export function serviceMetadata(slug: string): Metadata {
  const service = getService(slug);
  return pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: `/${slug}/` });
}

/** Shared template for the five service pages. Each route keeps its original WordPress URL. */
export function ServicePage({ slug }: { slug: string }) {
  const service = getService(slug);
  const pillar = getPillar(service.pillar);
  const showPackages = slug === "branding-and-design-consulting-services" && packagesEnabled();
  const relatedInsights = service.insights.map(getInsight).filter((i) => i !== undefined);

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Services", path: "/services/" },
          { name: service.name, path: `/${slug}/` },
        ]}
        eyebrow={`${pillar.number} / ${pillar.name}`}
        title={service.h1}
        lead={service.headline}
        actions={
          <>
            <ButtonLink href="#inquiry" arrow>
              Start a project
            </ButtonLink>
            <a href={site.phone.href} className="btn btn-secondary tabular">
              Call {site.phone.display}
            </a>
          </>
        }
        aside={
          <div className="rounded-md border border-line bg-bg-raised p-6">
            <h2 className="eyebrow eyebrow-plain">What’s included</h2>
            <ul className="mt-4 space-y-2">
              {service.deliverables
                .flatMap((g) => g.items)
                .slice(0, 6)
                .map((d) => (
                  <li key={d.title} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-ornament" strokeWidth={2} />
                    <a href="#deliverables" className="hover:text-accent">
                      {d.title}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        }
      />

      {/* Intro + problems */}
      <section aria-labelledby="problems-title" className="section">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 text-lead text-fg-muted lg:col-span-6">
            {service.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="lg:col-span-6">
            <h2 id="problems-title" className="eyebrow mb-6">
              Sound familiar?
            </h2>
            <ul className="border-t border-line">
              {service.problems.map((problem) => (
                <li key={problem.title} className="border-b border-line py-6">
                  <h3 className="font-display text-[1.625rem] leading-tight">{problem.title}</h3>
                  <p className="mt-2 text-fg-muted">{problem.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section aria-labelledby="outcomes-title" className="surface-navy section">
        <div className="container-site">
          <SectionHeading id="outcomes-title" eyebrow="Outcomes" title={service.outcomesTitle} />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-[var(--line)] md:grid-cols-3">
            {service.outcomes.map((o, i) => (
              <li key={o.title} className="motion-reveal bg-bg p-7 sm:p-8">
                <p className="tabular text-label font-semibold tracking-[0.14em] text-ornament" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-title font-semibold">{o.title}</h3>
                <p className="mt-2 text-fg-muted">{o.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deliverables */}
      <section id="deliverables" aria-labelledby="deliverables-title" className="section">
        <div className="container-site">
          <SectionHeading id="deliverables-title" eyebrow="Deliverables" title="What we deliver" />
          {service.deliverables.map((group) => (
            <div key={group.title ?? "main"} className="mt-12">
              {group.title && <h3 className="eyebrow eyebrow-plain mb-4">{group.title}</h3>}
              <dl className="grid border-t border-line md:grid-cols-2 md:gap-x-16">
                {group.items.map((item) => (
                  <div key={item.title} className="border-b border-line py-6">
                    <dt className="text-title font-semibold">{item.title}</dt>
                    <dd className="mt-2 text-fg-muted">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          {service.catalogue.length > 0 && (
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              {service.catalogue.map((cat) => (
                <div key={cat.title}>
                  <h3 className="eyebrow eyebrow-plain mb-4">{cat.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <li key={item} className="rounded-xs border border-line px-3 py-1.5 text-small">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showPackages && (
        <section aria-labelledby="packages-title" className="surface-paper-2 section">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading id="packages-title" eyebrow="Logo design packages" title="Start with a logo." intro={packageIntro} />
              <ArrowLink href="/pricing/">Compare packages</ArrowLink>
            </div>
            <div className="mt-12">
              <PackageCards />
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section aria-labelledby="process-title" className={`section ${showPackages ? "" : "surface-paper-2"}`}>
        <div className="container-site">
          <SectionHeading id="process-title" eyebrow="Process" title="How the work runs" />
          <div className="mt-12">
            <ProcessSteps steps={service.process} />
          </div>
        </div>
      </section>

      {/* FAQ + insights */}
      <section aria-labelledby="faq-title" className="section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Common questions" />
            {relatedInsights.length > 0 && (
              <div className="mt-10">
                <h3 className="eyebrow eyebrow-plain mb-3">Further reading</h3>
                <ul className="space-y-3">
                  {relatedInsights.map((insight) => (
                    <li key={insight.slug}>
                      <Link href={`/${insight.slug}/`} className="link font-semibold">
                        {insight.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={service.faqs} />
          </div>
        </div>
      </section>

      {/* Related */}
      <section aria-labelledby="related-title" className="border-t border-line py-16 sm:py-20">
        <div className="container-site">
          <h2 id="related-title" className="eyebrow mb-8">
            Related services
          </h2>
          <RelatedServices slugs={service.related} />
        </div>
      </section>

      <InquirySection title={`Talk to us about ${service.name.toLowerCase()}.`} defaultService={slug} />
      <JsonLd data={serviceSchema(service)} />
    </>
  );
}
