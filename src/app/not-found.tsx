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
    <section className="section">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-6">Error 404</p>
          <h1 className="font-display text-display-l">
            This page has <span className="em-accent">moved on.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lead text-fg-muted">
            The link may be out of date, or the page may have been retired with our old website. These will get you back on track — or call{" "}
            <a href={site.phone.href} className="link font-semibold text-fg tabular">
              {site.phone.display}
            </a>
            .
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/" arrow>
              Go to the homepage
            </ButtonLink>
            <ButtonLink href="/contact-us/" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-6">
          <h2 className="eyebrow mb-4">Our services</h2>
          <ServiceIndex variant="compact" />
        </div>
      </div>
    </section>
  );
}
