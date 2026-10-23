import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/content/company";
import { liveNetworkSites, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import logo from "../../../public/brand/american-elite-digital-logo.png";

export const metadata: Metadata = pageMetadata({
  title: "About Us — Los Angeles Digital Partner",
  description:
    "Meet American Elite Digital: a Los Angeles team of digital strategists, designers and developers. Our goal, mission, values and the way we work.",
  path: "/about-us/",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "About us", path: "/about-us/" }]}
        eyebrow="About us"
        title="About American Elite Digital"
        lead={about.whoWeAre}
      />

      <section aria-labelledby="purpose-title" className="section">
        <div className="container-site">
          <h2 id="purpose-title" className="sr-only">
            Our goal and mission
          </h2>
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-[var(--line)] md:grid-cols-2">
            <div className="bg-bg p-8 sm:p-10">
              <p className="eyebrow">Our goal</p>
              <p className="mt-5 font-display text-display-s">{about.goal}</p>
            </div>
            <div className="bg-bg p-8 sm:p-10">
              <p className="eyebrow">Our mission</p>
              <p className="mt-5 font-display text-display-s">{about.mission}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="surface-navy section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <SectionHeading className="lg:col-span-4" id="values-title" eyebrow="Values" title="What we hold ourselves to" />
          <ol className="grid gap-x-10 border-t border-line sm:grid-cols-2 lg:col-span-8">
            {about.values.map((value, i) => (
              <li key={value.title} className="motion-reveal border-b border-line py-7">
                <p className="tabular text-label font-semibold tracking-[0.14em] text-ornament" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-title font-semibold">{value.title}</h3>
                <p className="mt-2 text-fg-muted">{value.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="method-title" className="section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="method-title" eyebrow="Methodology" title="How we approach the work" />
            <p className="mt-6 text-lead text-fg-muted">{about.methodology}</p>
            <ArrowLink href="/why-choose-us/" className="mt-8">
              Why clients choose us
            </ArrowLink>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">What we do</p>
            <ServiceIndex variant="compact" />
          </div>
        </div>
      </section>

      <section aria-labelledby="mark-title" className="surface-paper-2 section">
        <div className="container-site grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Image
              src={logo}
              alt="The American Elite Digital crest: a gold lion within a green laurel wreath above a blue star-and-stripe ribbon, framed by red banners reading “American Elite” and “Digital”."
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full rounded-sm shadow-pop"
            />
          </div>
          <div className="lg:col-span-6">
            <SectionHeading
              id="mark-title"
              eyebrow="Our mark"
              title={`Part of ${site.parentOrganization}`}
              intro={`The lion, the laurel and the star-spangled ribbon: our crest. ${site.name} is one of the companies in the ${site.parentOrganization} network.`}
            />
            <ul className="mt-8 grid gap-x-6 gap-y-1 text-small sm:grid-cols-2">
              {liveNetworkSites.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="noopener" className="link inline-flex min-h-9 items-center">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
