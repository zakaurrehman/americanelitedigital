import type { Metadata } from "next";
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
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/3 -z-10 h-[60%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(44_108_28/0.1),transparent_65%)]" />
      <div className="container-site section max-w-3xl text-center">
        <svg aria-hidden="true" viewBox="0 0 48 48" className="draw-check mx-auto size-16 text-success" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
          <path d="M15 24.5l6 6 12-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="mt-8 text-display-l">
          <span className="line-mask">
            <span>
              Thank you — <span className="em-accent">your message is on its way.</span>
            </span>
          </span>
        </h1>
        <p className="motion-rise mx-auto mt-7 max-w-xl text-lead text-fg-muted [--delay:200ms]">
          We’ll reply to the email address you gave us. If it’s urgent, call{" "}
          <a href={site.phone.href} className="link font-medium text-fg tabular">
            {site.phone.display}
          </a>
          .
        </p>
        <div className="motion-rise mt-10 flex flex-wrap justify-center gap-3 [--delay:280ms]">
          <ButtonLink href="/services/" arrow magnetic>
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
