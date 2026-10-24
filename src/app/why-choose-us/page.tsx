import type { Metadata } from "next";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators, processSteps } from "@/content/company";
import { photos } from "@/content/media";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Why Choose Us",
  description:
    "Expertise and innovation, tailored strategies, a results-driven approach, a true partnership and one accountable team for brand, web, apps and marketing.",
  path: "/why-choose-us/",
});

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Why choose us", path: "/why-choose-us/" }]}
        eyebrow="Why choose us"
        title={
          <>
            Why choose <span className="em-accent">American Elite Digital</span>
          </>
        }
        lead="No two businesses are alike, so we don’t sell one-size-fits-all solutions. Here’s what working with us is built on."
        image={photos.pairReview}
        actions={
          <ButtonLink href="#inquiry" arrow magnetic>
            Start a project
          </ButtonLink>
        }
      />

      <section aria-label="Our differentiators" className="section">
        <div className="container-site">
          <ol className="border-t border-line">
            {differentiators.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                className="group grid gap-5 border-b border-line py-12 transition-colors duration-500 hover:bg-bg-raised md:grid-cols-12 md:gap-8 md:px-4 md:py-16"
              >
                <p className="index-num text-[clamp(3rem,6vw,5.5rem)] leading-[0.85] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:col-span-2" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="text-display-m md:col-span-4">{item.title}</h2>
                <p className="text-lead text-fg-muted md:col-span-6 md:pt-2">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="process-title" className="surface-raised section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <SectionHeading id="process-title" eyebrow="How we work" title="A collaborative process, start to finish" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <InquirySection />
    </>
  );
}
