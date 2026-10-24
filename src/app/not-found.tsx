import type { Metadata } from "next";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section data-spotlight className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="aurora -z-10 opacity-60" />
      <div aria-hidden="true" className="pointer-light -z-10" />
      <div className="container-site section grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p
            aria-hidden="true"
            className="motion-fade select-none text-[clamp(7rem,22vw,16rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-transparent [-webkit-text-stroke:2px_var(--gold-500)]"
          >
            404
          </p>
          <p className="eyebrow mt-10">Error 404</p>
          <h1 className="mt-6 text-display-l">
            <span className="line-mask">
              <span>
                This page has <span className="em-accent">moved on.</span>
              </span>
            </span>
          </h1>
          <p className="motion-rise mt-7 max-w-lg text-lead text-fg-muted [--delay:200ms]">
            The link may be out of date, or the page may have been retired with our old website. These will get you back on track — or call{" "}
            <a href={site.phone.href} className="link font-medium text-fg tabular">
              {site.phone.display}
            </a>
            .
          </p>
          <div className="motion-rise mt-10 flex flex-wrap gap-3 [--delay:280ms]">
            <ButtonLink href="/" arrow magnetic>
              Go to the homepage
            </ButtonLink>
            <ButtonLink href="/contact-us/" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-5 lg:pt-8">
          <h2 className="eyebrow mb-5">Our services</h2>
          <ServiceIndex variant="compact" />
        </div>
      </div>
    </section>
  );
}
