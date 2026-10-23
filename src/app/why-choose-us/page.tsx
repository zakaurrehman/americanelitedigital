import type { Metadata } from "next";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators, processSteps } from "@/content/company";
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
        actions={
          <ButtonLink href="#inquiry" arrow>
            Start a project
          </ButtonLink>
        }
      />

      <section aria-label="Our differentiators" className="section">
        <div className="container-site">
          <ol className="border-t border-line">
            {differentiators.map((item, i) => (
              <li key={item.title} className="motion-reveal grid gap-4 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-14">
                <p className="tabular font-display text-display-m text-ornament md:col-span-2" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display text-display-s md:col-span-4">{item.title}</h2>
                <p className="text-lead text-fg-muted md:col-span-6">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="process-title" className="surface-paper-2 section">
        <div className="container-site">
          <SectionHeading id="process-title" eyebrow="How we work" title="A collaborative process, start to finish" />
          <div className="mt-12">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <InquirySection />
    </>
  );
}
