import type { Metadata } from "next";
import { InquirySection } from "@/components/inquiry/InquirySection";
import { PageHeader } from "@/components/sections/PageHeader";
import { offer } from "@/content/company";
import { site } from "@/content/site";
import { photos } from "@/content/media";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Start a Project",
  description: `Tell American Elite Digital about your project and get initial ideas free of charge. Call ${site.phone.display}, email ${site.email} or send a message.`,
  path: "/contact-us/",
});

// What happens after a message is sent — restates the published offer and the process steps.
const nextSteps = [
  { title: "Tell us about your project", body: "Goals, timing and budget all help — share as much or as little as you like." },
  { title: "We reply with initial ideas", body: "We review your requirements and come back with ideas, free of charge." },
  { title: "We agree a plan together", body: "If it’s a fit, we agree the strategy, timeline and next steps with you." },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", path: "/contact-us/" }]}
        eyebrow="Contact"
        title={
          <>
            Start a project, <span className="em-accent">or just ask.</span>
          </>
        }
        lead={`${offer.long} Prefer to talk? Call ${site.phone.display}.`}
        image={photos.sketchDesk}
      />

      <section aria-labelledby="next-title" className="surface-raised py-14 sm:py-16">
        <div className="container-site">
          <h2 id="next-title" className="eyebrow mb-8">
            What happens next
          </h2>
          <ol data-spotlight className="grid gap-3 md:grid-cols-3">
            {nextSteps.map((step, i) => (
              <li key={step.title} data-reveal style={{ "--i": i } as React.CSSProperties} className="card spot lift p-6 sm:p-7">
                <span className="index-num text-[1.75rem] leading-none" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-title font-semibold">{step.title}</h3>
                <p className="mt-2 text-fg-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <InquirySection title="Send us a message." intro="We use your details only to reply." />
    </>
  );
}
