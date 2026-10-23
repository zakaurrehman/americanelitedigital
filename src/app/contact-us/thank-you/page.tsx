import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

// Destination for the no-JavaScript form fallback after a successful submission.
export const metadata: Metadata = pageMetadata({
  title: "Thank You",
  description: "Your message has been sent to American Elite Digital.",
  path: "/contact-us/thank-you/",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="container-site max-w-3xl">
        <CheckCircle2 aria-hidden="true" className="size-10 text-ornament" strokeWidth={1.5} />
        <h1 className="mt-6 font-display text-display-l">Thank you — your message is on its way.</h1>
        <p className="mt-6 text-lead text-fg-muted">
          We’ll reply to the email address you gave us. If it’s urgent, call{" "}
          <a href={site.phone.href} className="link font-semibold text-fg tabular">
            {site.phone.display}
          </a>
          .
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/services/" arrow>
            Explore services
          </ButtonLink>
          <ButtonLink href="/blogs/" variant="secondary">
            Read our insights
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
