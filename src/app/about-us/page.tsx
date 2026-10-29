import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { valueIcons } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/content/company";
import { liveNetworkSites, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { photos } from "@/content/media";
import logo from "../../../public/brand/lockup-full.png";

export const metadata: Metadata = pageMetadata({
  title: "About Us — Los Angeles Digital Partner",
  description:
    "Meet American Elite Digital: a Los Angeles team of digital strategists, designers and developers. Our goal, mission, values and the way we work.",
  path: "/about-us/",
});

function ValueIcon({ index }: { index: number }) {
  const Icon = valueIcons[index] ?? Lightbulb;
  return <Icon className="size-5" strokeWidth={1.75} />;
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "About us", path: "/about-us/" }]}
        eyebrow="About us"
        title={
          <>
            About American Elite <span className="em-accent">Digital</span>
          </>
        }
        lead={about.whoWeAre}
        image={photos.collaborate}
      />

      <section aria-labelledby="purpose-title" className="section">
        <div className="container-site">
          <h2 id="purpose-title" className="sr-only">
            Our goal and mission
          </h2>
          <div data-spotlight className="grid gap-3 md:grid-cols-2">
            {[
              { label: "Our goal", text: about.goal },
              { label: "Our mission", text: about.mission },
            ].map((block, i) => (
              <div key={block.label} data-reveal style={{ "--i": i } as React.CSSProperties} className={`card spot lift flex flex-col justify-between gap-14 rounded-[var(--radius-lg)] p-8 sm:p-11 ${i === 1 ? "surface-navy border-transparent" : ""}`}>
                <p className="eyebrow">{block.label}</p>
                <p className="text-display-s">{block.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="surface-raised section">
        <div className="container-site">
          <SectionHeading id="values-title" eyebrow="Values" size="l" title="What we hold ourselves to" />
          <ol data-spotlight className="mt-16 grid gap-3 md:grid-cols-6">
            {about.values.map((value, i) => (
              <li
                key={value.title}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
                className={`card spot lift flex flex-col gap-10 p-7 sm:p-8 ${i < 2 ? "md:col-span-3" : "md:col-span-2"}`}
              >
                <span className="icon-tile" aria-hidden="true">
                  <ValueIcon index={i} />
                </span>
                <div>
                  <h3 className="text-title font-semibold">{value.title}</h3>
                  <p className="mt-2 text-fg-muted">{value.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="method-title" className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="method-title" eyebrow="Methodology" title="How we approach the work" />
            <p className="scroll-sweep mt-8 text-display-s text-fg">{about.methodology}</p>
            <div className="mt-10" data-reveal>
              <ArrowLink href="/why-choose-us/">Why clients choose us</ArrowLink>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8" data-reveal>
            <div className="photo mb-10 aspect-[16/10] shadow-[var(--shadow-md)]">
              <Image src={photos.teamDesk.src} alt={photos.teamDesk.alt} fill placeholder="blur" sizes="(min-width: 1024px) 34vw, 100vw" className="parallax-img object-cover" />
            </div>
            <p className="eyebrow mb-5">What we do</p>
            <ServiceIndex variant="compact" />
          </div>
        </div>
      </section>

      <section aria-labelledby="mark-title" className="surface-raised section overflow-hidden">
        <div className="container-site grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal="scale">
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-[-12%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(229_176_48/0.22),transparent_65%)]" />
              <div className="relative rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-lg)] sm:p-12">
                <Image
                  src={logo}
                  alt="The American Elite Digital logo: a metallic gold lion within a green laurel wreath above a royal-blue ribbon with five gold stars and red stripes, over the words “American Elite” in blue and “Digital” in red."
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <SectionHeading
              id="mark-title"
              eyebrow="Our mark"
              title={`Part of ${site.parentOrganization}`}
              intro={`The lion, the laurel and the star-spangled ribbon: our mark. ${site.name} is one of the companies in the ${site.parentOrganization} network.`}
            />
            <ul className="mt-10 grid gap-x-6 sm:grid-cols-2" data-reveal>
              {liveNetworkSites.map((s) => (
                <li key={s.url} className="border-b border-line">
                  <a href={s.url} rel="noopener" className="group flex min-h-11 items-center justify-between gap-3 text-small text-fg-muted transition-colors hover:text-fg">
                    {s.name}
                    <ArrowUpRight aria-hidden="true" className="icon-arrow size-3.5 shrink-0 text-fg-subtle group-hover:text-accent" strokeWidth={1.75} />
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
