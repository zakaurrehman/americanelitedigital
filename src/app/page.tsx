import type { Metadata } from "next";
import Image from "next/image";
import { Building2, CheckCircle2, Layers, Lightbulb, MapPin, Phone } from "lucide-react";
import { HeroVisual } from "@/components/home/HeroVisual";
import { Marquee } from "@/components/home/Marquee";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { FaqList } from "@/components/sections/FaqList";
import { InsightList } from "@/components/sections/InsightList";
import { PackageCards } from "@/components/sections/Packages";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { Testimonials } from "@/components/sections/Testimonials";
import { WorkList } from "@/components/sections/WorkList";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { differentiatorIcons } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators, generalFaqs, offer, processSteps } from "@/content/company";
import { insightsByDate } from "@/content/insights";
import { photos } from "@/content/media";
import { packageIntro, packagesEnabled } from "@/content/packages";
import { visibleProjects } from "@/content/projects";
import { formattedAddress, site } from "@/content/site";
import { visibleTestimonials } from "@/content/testimonials";
import { pageMetadata } from "@/lib/seo";
import emblem from "../../public/brand/emblem.png";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Branding, Web Design & App Development",
    description:
      "Brand identity, websites, custom apps and digital marketing for business owners, startups and growing companies. Los Angeles based — get free initial project ideas.",
    path: "/",
  }),
  title: { absolute: `Branding, Web Design & App Development | ${site.name}` },
};

const marqueeItems = ["Brand identity", "Logo design", "Websites", "E-commerce", "Web apps", "Mobile apps", "SEO", "Social media", "Digital strategy"];

export default function HomePage() {
  const work = visibleProjects();
  const quotes = visibleTestimonials();
  return (
    <>
      {/* ── Hero ── */}
      <section aria-labelledby="hero-title" data-spotlight data-tilt className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="aurora aurora-drift -z-10" />
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <div aria-hidden="true" className="pointer-light -z-10" />

        <div className="container-site grid items-center gap-x-10 gap-y-14 pb-20 pt-12 sm:pt-16 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:pb-24 lg:pt-10">
          <div className="relative z-10 lg:col-span-6">
            <p className="eyebrow motion-rise">Digital studio · Los Angeles</p>
            <h1 id="hero-title" className="mt-7 text-display-2xl">
              <span className="line-mask">
                <span style={{ "--i": 0 } as React.CSSProperties}>Brand. Web.</span>
              </span>{" "}
              <span className="line-mask">
                <span style={{ "--i": 1 } as React.CSSProperties}>Software.</span>
              </span>{" "}
              <span className="line-mask">
                <span style={{ "--i": 2 } as React.CSSProperties}>
                  <span className="em-accent">One team.</span>
                </span>
              </span>
            </h1>
            <p className="motion-slide mt-8 max-w-xl text-lead text-fg-muted">
              Brand identity, websites, custom applications and digital marketing for business owners, startups and growing companies — designed,
              built and grown by one accountable team.
            </p>
            <div className="motion-rise mt-10 flex flex-wrap items-center gap-3 [--delay:180ms]">
              <ButtonLink href="/contact-us/" arrow magnetic>
                Get a free consultation
              </ButtonLink>
              <ButtonLink href="/services/" variant="secondary" magnetic>
                Explore services
              </ButtonLink>
            </div>
            <ul className="motion-rise mt-10 grid gap-3 text-small text-fg-muted sm:grid-cols-2 [--delay:240ms]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 aria-hidden="true" className="size-[1.1rem] shrink-0 text-success" strokeWidth={2} />
                {offer.short}
              </li>
              <li className="flex items-center gap-2.5">
                <Layers aria-hidden="true" className="size-[1.1rem] shrink-0 text-gold-ink" strokeWidth={2} />
                Brand, web, apps & marketing
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin aria-hidden="true" className="size-[1.1rem] shrink-0 text-accent" strokeWidth={2} />
                Based in Los Angeles
              </li>
              <li>
                <a href={site.phone.href} className="link-draw inline-flex min-h-6 items-center gap-2.5 font-semibold text-brand tabular">
                  <Phone aria-hidden="true" className="size-[1.1rem] text-brand" strokeWidth={2} />
                  {site.phone.display}
                </a>
              </li>
            </ul>
          </div>

          <div className="relative lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* ── Capabilities ── */}
      <section aria-labelledby="services-title" className="section">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              className="lg:col-span-7"
              id="services-title"
              eyebrow="What we do"
              size="l"
              title={
                <>
                  Four practices. <span className="em-accent">One standard.</span>
                </>
              }
            />
            <p className="text-lead text-fg-muted lg:col-span-5" data-reveal>
              Start with what you need today. Every engagement is tailored to your goals, competitors and customers — never one-size-fits-all.
            </p>
          </div>
          <div className="mt-14">
            <ServiceIndex />
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3" data-reveal>
            <ButtonLink href="/services/#compare" variant="secondary">
              Compare services
            </ButtonLink>
            <ArrowLink href="/contact-us/">Not sure? Get a free consultation</ArrowLink>
          </div>
        </div>
      </section>

      {/* ── Under one roof (only facts the business already publishes) ── */}
      <section aria-labelledby="roof-title" className="surface-raised section overflow-hidden">
        <div className="container-site grid items-center gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-6" data-reveal="left">
            <div className="photo aspect-[5/4] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]">
              <Image src={photos.teamDesk.src} alt={photos.teamDesk.alt} fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="parallax-img object-cover" />
            </div>
            <div className="absolute -bottom-8 right-4 flex items-center gap-4 rounded-[var(--radius-lg)] bg-white p-4 pr-6 shadow-[var(--shadow-lg)] sm:right-[-1.5rem]">
              <Image src={emblem} alt="" sizes="64px" className="size-14 object-contain" />
              <div className="leading-tight">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">Part of</p>
                <p className="mt-1 font-semibold text-brand">{site.parentOrganization}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <SectionHeading
              id="roof-title"
              eyebrow="Under one roof"
              title={
                <>
                  Brand, web, apps and marketing — <span className="em-accent">designed to work together.</span>
                </>
              }
            />
            <ul className="mt-10 grid gap-4" data-reveal>
              <li className="flex gap-4">
                <span className="icon-tile">
                  <Layers aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold text-brand">One accountable team</span>
                  <span className="mt-1 block text-fg-muted">Strategy, design, development and marketing — one partner, one consistent standard.</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="icon-tile">
                  <Building2 aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold text-brand">Based in Los Angeles</span>
                  <span className="mt-1 block text-fg-muted">{formattedAddress}</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="icon-tile">
                  <Lightbulb aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold text-brand">{offer.short}</span>
                  <span className="mt-1 block text-fg-muted">Describe your requirements and we reply with ideas — free of charge.</span>
                </span>
              </li>
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3" data-reveal>
              <ButtonLink href="/contact-us/" arrow>
                Get free project ideas
              </ButtonLink>
              <ArrowLink href="/about-us/">About us</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {work.length > 0 && (
        <section aria-labelledby="work-title" className="section">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading id="work-title" eyebrow="Selected work" title="Recent projects" />
              <ArrowLink href="/work/">All work</ArrowLink>
            </div>
            <div className="mt-14">
              <WorkList items={work.slice(0, 3)} />
            </div>
          </div>
        </section>
      )}

      {packagesEnabled() && (
        <section aria-labelledby="packages-title" className="section">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading id="packages-title" eyebrow="Logo design packages" title="Start with a logo." intro={packageIntro} />
              <ArrowLink href="/pricing/">Compare packages</ArrowLink>
            </div>
            <div className="mt-14">
              <PackageCards />
            </div>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      <section aria-labelledby="process-title" className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <SectionHeading
                id="process-title"
                eyebrow="How we work"
                size="l"
                title={
                  <>
                    From first call to <span className="em-accent">measurable progress.</span>
                  </>
                }
                intro="We research before we recommend, plan before we build, and keep measuring after launch."
              />
              <div data-reveal="mask" className="photo mt-10 hidden aspect-[16/10] lg:block">
                <Image src={photos.collaborate.src} alt={photos.collaborate.alt} fill placeholder="blur" sizes="36vw" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      {/* ── Why ── */}
      <section aria-labelledby="why-title" className="surface-navy section relative isolate overflow-hidden">
        <div aria-hidden="true" className="bg-stars absolute inset-0 -z-10" />
        <div aria-hidden="true" className="aurora -z-10" />
        <div className="container-site">
          <p className="eyebrow mb-8" data-reveal>
            Why American Elite Digital
          </p>
          <h2 id="why-title" className="max-w-5xl text-display-l">
            <span className="scroll-sweep">
              A partner, not a vendor. We take the time to understand your business — then stay with you from strategy to implementation and beyond.
            </span>
          </h2>
          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="relative lg:col-span-5" data-reveal="left">
              <div className="photo aspect-[4/5] rounded-[var(--radius-xl)] lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <Image src={photos.pairReview.src} alt={photos.pairReview.alt} fill placeholder="blur" sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(6_18_58/0.55)] to-transparent" />
              </div>
            </div>
            <ol data-spotlight className="grid content-start gap-4 lg:col-span-7">
              {differentiators.map((item, i) => {
                const Icon = differentiatorIcons[i] ?? CheckCircle2;
                return (
                  <li key={item.title} data-reveal style={{ "--i": i } as React.CSSProperties} className="card spot flex gap-5 rounded-[var(--radius-lg)] p-6 sm:p-7">
                    <span className="icon-tile">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-title font-semibold">{item.title}</h3>
                      <p className="mt-2 text-fg-muted">{item.body}</p>
                    </div>
                  </li>
                );
              })}
              <li className="pt-2" data-reveal>
                <ArrowLink href="/why-choose-us/">Why clients choose us</ArrowLink>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {quotes.length > 0 && (
        <section aria-labelledby="testimonials-title" className="surface-raised section">
          <div className="container-site">
            <SectionHeading id="testimonials-title" eyebrow="Testimonials" title="What our clients say" />
            <div className="mt-14">
              <Testimonials items={quotes} />
            </div>
          </div>
        </section>
      )}

      {/* ── Insights ── */}
      <section aria-labelledby="insights-title" className="section">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="insights-title" eyebrow="Insights" title="Thinking on strategy, marketing and the web." />
            <div data-reveal>
              <ArrowLink href="/blogs/">All insights</ArrowLink>
            </div>
          </div>
          <div className="mt-14">
            <InsightList items={insightsByDate} />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section aria-labelledby="faq-title" className="surface-raised section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions, answered." />
            <p className="mt-6 text-fg-muted" data-reveal>
              Something else on your mind? Call{" "}
              <a href={site.phone.href} className="link font-semibold text-brand tabular">
                {site.phone.display}
              </a>{" "}
              or{" "}
              <a href="#inquiry" className="link font-semibold text-brand">
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
