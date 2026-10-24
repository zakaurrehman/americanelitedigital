import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
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

  const contacts = [
    { label: "Call", value: site.phone.display, href: site.phone.href, Icon: Phone, tabular: true },
    { label: "Email", value: site.email, href: `mailto:${site.email}`, Icon: Mail, tabular: false },
  ];

  return (
    <section id="inquiry" aria-labelledby="inquiry-title" className="section relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute left-[-10%] top-1/3 -z-10 h-[70%] w-[60%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(4_172_236/0.12),transparent_65%)]" />
      <div aria-hidden="true" className="absolute bottom-0 right-[-10%] -z-10 h-[60%] w-[50%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(244_172_52/0.14),transparent_65%)]" />
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <p className="eyebrow mb-6">Start a project</p>
          <Heading id="inquiry-title" className="text-display-l">
            {title}
          </Heading>
          <p className="mt-6 max-w-md text-lead text-fg-muted">{intro}</p>

          <dl data-spotlight className="mt-12 grid gap-3">
            {contacts.map(({ label, value, href, Icon, tabular }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <a href={href} className="card spot lift group flex items-center justify-between gap-4 p-5">
                    <span className="flex min-w-0 items-center gap-4">
                      <span className="icon-tile size-11 rounded-full">
                        <Icon aria-hidden="true" className="size-[1.1rem]" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span aria-hidden="true" className="block text-[0.75rem] uppercase tracking-[0.16em] text-fg-subtle">
                          {label}
                        </span>
                        <span className={`block break-all text-[1.0625rem] font-semibold text-brand ${tabular ? "tabular" : ""}`}>{value}</span>
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="icon-arrow size-5 shrink-0 text-fg-subtle transition-colors group-hover:text-accent" strokeWidth={1.5} />
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="sr-only">Visit</dt>
              <dd className="flex gap-4 px-5 pt-3 text-fg-muted">
                <MapPin aria-hidden="true" className="mt-1 size-[1.1rem] shrink-0 text-accent" strokeWidth={1.75} />
                <span>{formattedAddress}</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          {/* Gradient hairline frame around the form */}
          <div className="rounded-[calc(var(--radius-xl)+2px)] bg-[linear-gradient(140deg,var(--gold-500),var(--gold-300)_25%,var(--slate-200)_45%,var(--slate-200)_70%,var(--blue-500))] p-[2px] shadow-[var(--shadow-lg)]">
            <div className="rounded-[var(--radius-xl)] bg-white p-6 sm:p-9 lg:p-11">
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
      </div>
    </section>
  );
}
