import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { FaqList } from "@/components/sections/FaqList";
import { InsightList } from "@/components/sections/InsightList";
import { PackageCards } from "@/components/sections/Packages";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { WorkList } from "@/components/sections/WorkList";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { Star } from "@/components/ui/Ornament";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators, generalFaqs, offer, processSteps } from "@/content/company";
import { insightsByDate } from "@/content/insights";
import { packageIntro, packagesEnabled } from "@/content/packages";
import { visibleProjects } from "@/content/projects";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Branding, Web Design & App Development",
    description:
      "Brand identity, websites, custom apps and digital marketing for business owners, startups and growing companies. Los Angeles based — get free initial project ideas.",
    path: "/",
  }),
  title: { absolute: `Branding, Web Design & App Development | ${site.name}` },
};

const facts = [
  { label: "Based in", value: "Los Angeles", detail: "1270 South Alfred St." },
  { label: "Under one roof", value: "Brand, web, apps & marketing", detail: "Use one service or all of them." },
  { label: "To start", value: offer.short, detail: "Describe your requirements; we reply with ideas." },
  { label: "Part of", value: site.parentOrganization, detail: "A network of sister companies." },
];

export default function HomePage() {
  const work = visibleProjects();
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
        <div className="container-site grid gap-14 pb-16 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7 lg:pr-6">
            <p className="eyebrow motion-rise mb-7">Digital partner · Los Angeles</p>
            <h1 id="hero-title" className="font-display text-display-xl">
              Brand, website and software — built by <span className="em-accent">one accountable team.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lead text-fg-muted">
              We help business owners, startups and growing companies look credible, get found and run better online — with brand identity,
              websites, custom applications and digital marketing under one roof.
            </p>
            <div className="motion-rise mt-10 flex flex-wrap items-center gap-3 [--delay:160ms]">
              <ButtonLink href="/contact-us/" arrow>
                Start a project
              </ButtonLink>
              <ButtonLink href="/services/" variant="secondary">
                Explore services
              </ButtonLink>
            </div>
            <p className="motion-rise mt-6 flex flex-wrap items-center gap-x-2 text-small text-fg-subtle [--delay:200ms]">
              <span>{offer.short}.</span>
              <span>Prefer to talk?</span>
              <a href={site.phone.href} className="link inline-flex min-h-6 items-center gap-1.5 font-semibold text-fg tabular">
                <Phone aria-hidden="true" className="size-3.5 text-ornament" strokeWidth={2} />
                {site.phone.display}
              </a>
            </p>
          </div>

          <div className="motion-rise lg:col-span-5 [--delay:240ms]">
            <div className="rounded-md border border-line bg-bg-raised p-6 shadow-[0_1px_0_rgb(14_26_43/0.04)] sm:p-8">
              <div className="mb-2 flex items-center justify-between gap-4">
                <h2 className="eyebrow">What we do</h2>
                <Star className="size-4 text-ornament" />
              </div>
              <ServiceIndex variant="compact" headingLevel="h3" />
              <ArrowLink href="/services/" className="mt-4">
                Compare all services
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* Facts — only things the business already publishes */}
      <section aria-label="At a glance" className="border-b border-line">
        <div className="container-site overflow-hidden">
          <dl className="grid gap-px bg-[var(--line)] sm:-mx-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-bg py-7 sm:px-8 sm:py-9">
                <dt className="eyebrow eyebrow-plain">{fact.label}</dt>
                <dd className="mt-2 text-title font-semibold">{fact.value}</dd>
                <dd className="mt-1 text-small text-fg-muted">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services-title" className="section">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-12">
            <SectionHeading
              className="lg:col-span-7"
              id="services-title"
              eyebrow="Services"
              title={
                <>
                  Four practices. <span className="em-accent">One standard.</span>
                </>
              }
            />
            <p className="text-lead text-fg-muted lg:col-span-5 lg:pt-12">
              Start with what you need today. Every engagement is tailored to your goals, competitors and customers — never one-size-fits-all.
            </p>
          </div>
          <div className="mt-14">
            <ServiceIndex />
          </div>
        </div>
      </section>

      {work.length > 0 && (
        <section aria-labelledby="work-title" className="border-t border-line section">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading id="work-title" eyebrow="Selected work" title="Recent projects" />
              <ArrowLink href="/work/">All work</ArrowLink>
            </div>
            <div className="mt-12">
              <WorkList items={work.slice(0, 3)} />
            </div>
          </div>
        </section>
      )}

      {packagesEnabled() && (
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
      <section aria-labelledby="process-title" className={`section ${packagesEnabled() ? "" : "surface-paper-2"}`}>
        <div className="container-site">
          <SectionHeading
            id="process-title"
            eyebrow="How we work"
            title={
              <>
                From first conversation to <span className="em-accent">measurable progress.</span>
              </>
            }
            intro="We research before we recommend, plan before we build, and keep measuring after launch."
          />
          <div className="mt-14">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      {/* Why */}
      <section aria-labelledby="why-title" className="surface-navy section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="why-title"
              eyebrow="Why American Elite Digital"
              title={
                <>
                  A partner, <span className="em-accent">not a vendor.</span>
                </>
              }
              intro="Your success is our success. We take the time to understand your business, then stay with you from strategy to implementation and beyond."
            />
            <ArrowLink href="/why-choose-us/" className="mt-8">
              Why clients choose us
            </ArrowLink>
          </div>
          <ol className="grid gap-x-10 border-t border-line sm:grid-cols-2 lg:col-span-7">
            {differentiators.map((item, i) => (
              <li key={item.title} className="motion-reveal border-b border-line py-7">
                <p className="tabular text-label font-semibold tracking-[0.14em] text-ornament" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-title font-semibold">{item.title}</h3>
                <p className="mt-2 text-fg-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Insights */}
      <section aria-labelledby="insights-title" className="section">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="insights-title" eyebrow="Insights" title="Thinking on strategy, marketing and the web." />
            <ArrowLink href="/blogs/">All insights</ArrowLink>
          </div>
          <div className="mt-12">
            <InsightList items={insightsByDate} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="surface-paper-2 section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions, answered." />
            <p className="mt-6 text-fg-muted">
              Something else on your mind? Call{" "}
              <a href={site.phone.href} className="link font-semibold text-fg tabular">
                {site.phone.display}
              </a>{" "}
              or{" "}
              <a href="#inquiry" className="link font-semibold text-fg">
                send us a message
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={generalFaqs} />
          </div>
        </div>
      </section>

      <InquirySection />
    </>
  );
}
