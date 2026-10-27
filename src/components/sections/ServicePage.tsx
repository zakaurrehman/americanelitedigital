import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, CircleAlert } from "lucide-react";
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
import { servicePhotos } from "@/content/media";
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
        eyebrow={pillar.name}
        title={service.h1}
        lead={service.headline}
        image={servicePhotos[slug]}
        actions={
          <>
            <ButtonLink href="#inquiry" arrow magnetic>
              Get a free consultation
            </ButtonLink>
            <a href={site.phone.href} className="btn btn-secondary tabular">
              Call {site.phone.display}
            </a>
          </>
        }
        aside={
          <div data-spotlight>
            <div className="card spot rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-lg)] sm:p-7">
              <h2 className="eyebrow">What’s included</h2>
              <ul className="mt-5 space-y-1">
                {service.deliverables
                  .flatMap((g) => g.items)
                  .slice(0, 6)
                  .map((d) => (
                    <li key={d.title}>
                      <a href="#deliverables" className="group flex min-h-10 items-center gap-3 font-medium text-fg-muted transition-colors hover:text-brand">
                        <Check aria-hidden="true" className="size-4 shrink-0 text-success" strokeWidth={2} />
                        <span className="link-draw">{d.title}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        }
      />

      {/* The challenge */}
      <section aria-labelledby="problems-title" className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" data-reveal>
            <p className="eyebrow mb-6">The challenge</p>
            <div className="space-y-6">
              {service.intro.map((p, i) => (
                <p key={p.slice(0, 24)} className={i === 0 ? "scroll-sweep text-display-s text-fg" : "text-lead text-fg-muted"}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 id="problems-title" className="text-display-m" data-reveal>
              Sound <span className="em-accent">familiar?</span>
            </h2>
            <ul data-spotlight className="mt-10 grid gap-3">
              {service.problems.map((problem, i) => (
                <li key={problem.title} data-reveal style={{ "--i": i } as React.CSSProperties} className="card spot grid gap-4 p-6 sm:grid-cols-[3rem_1fr] sm:p-8">
                  <span className="icon-tile bg-[var(--accent-soft)] text-accent-strong" aria-hidden="true">
                    <CircleAlert className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-title font-semibold">{problem.title}</h3>
                    <p className="mt-2 text-fg-muted">{problem.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Outcomes — asymmetric bento */}
      <section aria-labelledby="outcomes-title" className="surface-raised section border-y border-line">
        <div className="container-site">
          <SectionHeading id="outcomes-title" eyebrow="Outcomes" title={service.outcomesTitle} />
          <ol data-spotlight className="mt-14 grid gap-3 md:grid-cols-6">
            {service.outcomes.map((o, i) => (
              <li
                key={o.title}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
                className={`card spot lift flex flex-col justify-between gap-10 p-7 sm:p-9 ${i === 0 ? "surface-navy border-transparent md:col-span-6 lg:col-span-3 lg:row-span-2" : "md:col-span-3"}`}
              >
                <span className="icon-tile" aria-hidden="true">
                  <BadgeCheck className="size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className={i === 0 ? "text-display-s" : "text-title font-semibold"}>{o.title}</h3>
                  <p className="mt-3 max-w-md text-fg-muted">{o.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deliverables */}
      <section id="deliverables" aria-labelledby="deliverables-title" className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <SectionHeading id="deliverables-title" eyebrow="Deliverables" title="What we deliver" />
              {service.catalogue.length > 0 && (
                <div className="mt-10 space-y-8" data-reveal>
                  {service.catalogue.map((cat) => (
                    <div key={cat.title}>
                      <h3 className="eyebrow eyebrow-plain mb-3">{cat.title}</h3>
                      <ul className="flex flex-wrap gap-2">
                        {cat.items.map((item) => (
                          <li key={item} className="chip">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-8">
            {service.deliverables.map((group) => (
              <div key={group.title ?? "main"} className="mb-12 last:mb-0">
                {group.title && <h3 className="eyebrow mb-5">{group.title}</h3>}
                <dl className="border-t border-line">
                  {group.items.map((item) => (
                    <div key={item.title} data-reveal className="group border-b border-line py-7 transition-colors duration-300 hover:bg-bg-raised sm:px-3">
                      <dt className="flex items-center gap-x-4 sm:gap-x-6">
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-full bg-[rgb(44_108_28/0.1)] text-success transition-transform duration-500 group-hover:translate-x-1"
                          aria-hidden="true"
                        >
                          <Check className="size-4" strokeWidth={2.25} />
                        </span>
                        <span className="text-display-s font-medium text-brand">{item.title}</span>
                      </dt>
                      <dd className="mt-3 max-w-2xl pl-12 text-fg-muted sm:pl-14">{item.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showPackages && (
        <section aria-labelledby="packages-title" className="surface-raised section border-y border-line">
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
      <section aria-labelledby="process-title" className={`section ${showPackages ? "" : "surface-raised border-y border-line"}`}>
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <SectionHeading id="process-title" eyebrow="Process" title="How the work runs" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ProcessSteps steps={service.process} />
          </div>
        </div>
      </section>

      {/* FAQ + insights */}
      <section aria-labelledby="faq-title" className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Common questions" />
            {relatedInsights.length > 0 && (
              <div className="mt-12" data-reveal>
                <h3 className="eyebrow eyebrow-plain mb-4">Further reading</h3>
                <ul className="space-y-2">
                  {relatedInsights.map((insight) => (
                    <li key={insight.slug}>
                      <Link href={`/${insight.slug}/`} className="group flex items-start gap-3 font-medium text-fg-muted transition-colors hover:text-brand">
                        <ArrowRight aria-hidden="true" className="icon-arrow mt-1 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                        <span className="link-draw">{insight.title}</span>
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
      <section aria-labelledby="related-title" className="border-t border-line py-20 sm:py-24">
        <div className="container-site">
          <h2 id="related-title" className="eyebrow mb-10">
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
