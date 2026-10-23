import { Mail, MapPin, Phone } from "lucide-react";
import { offer } from "@/content/company";
import { designPackages, packagesEnabled } from "@/content/packages";
import { servicesInPillarOrder } from "@/content/services";
import { formattedAddress, site } from "@/content/site";
import { InquiryForm } from "./InquiryForm";

type Props = {
  title?: string;
  intro?: string;
  /** Use "h1" only on the contact page, where this section is the page's main content. */
  headingLevel?: "h1" | "h2";
  defaultService?: string;
};

export function inquiryOptions() {
  return {
    services: servicesInPillarOrder.map((s) => ({ value: s.slug, label: s.name })),
    packages: packagesEnabled() ? designPackages.map((p) => ({ value: p.id, label: `${p.name} — $${p.price}` })) : [],
  };
}

export function InquirySection({ title = "Tell us what you’re planning.", intro = offer.long, headingLevel = "h2", defaultService }: Props) {
  const Heading = headingLevel;
  const { services, packages } = inquiryOptions();

  return (
    <section id="inquiry" aria-labelledby="inquiry-title" className="surface-navy section">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5">Start a project</p>
          <Heading id="inquiry-title" className="font-display text-display-m">
            {title}
          </Heading>
          <p className="mt-5 max-w-md text-lead text-fg-muted">{intro}</p>

          <dl className="mt-10 space-y-5 border-t border-line pt-8">
            <div>
              <dt className="eyebrow eyebrow-plain mb-1">Call</dt>
              <dd>
                <a href={site.phone.href} className="inline-flex min-h-11 items-center gap-3 text-[1.25rem] tabular">
                  <Phone aria-hidden="true" className="size-5 text-ornament" strokeWidth={1.5} />
                  {site.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow eyebrow-plain mb-1">Email</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-3 break-all text-[1.125rem]">
                  <Mail aria-hidden="true" className="size-5 shrink-0 text-ornament" strokeWidth={1.5} />
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow eyebrow-plain mb-1">Visit</dt>
              <dd className="flex gap-3 text-fg-muted">
                <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-ornament" strokeWidth={1.5} />
                <span>{formattedAddress}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="surface-paper rounded-md p-6 sm:p-8 lg:p-10">
            <InquiryForm
              services={services}
              packages={packages}
              phone={site.phone}
              email={site.email}
              successHeadingLevel={headingLevel === "h1" ? "h2" : "h3"}
              defaultService={defaultService}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
