import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { companyLinks, legalLinks, serviceLinks } from "@/content/navigation";
import { formattedAddress, liveNetworkSites, site } from "@/content/site";
import { BrandMark } from "./BrandMark";

function FooterList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow eyebrow-plain mb-5">{title}</h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="link-draw inline-flex min-h-10 items-center text-fg-muted transition-colors hover:text-fg">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-navy no-print relative isolate overflow-hidden">
      <div aria-hidden="true" className="gold-rule absolute inset-x-0 top-0" />
      <div aria-hidden="true" className="bg-stars absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="aurora -z-10 opacity-60" />
      <div className="container-site pb-10 pt-20 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandMark tone="dark" />
            <p className="mt-6 max-w-sm text-fg-muted">{site.shortDescription}</p>
            <address className="mt-8 space-y-1 not-italic">
              <a href={site.phone.href} className="link-draw flex min-h-10 w-fit items-center gap-3 text-fg tabular">
                <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={1.75} />
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className="link-draw flex min-h-10 w-fit items-center gap-3 break-all text-fg">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
                {site.email}
              </a>
              <p className="flex items-start gap-3 py-2 text-fg-muted">
                <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.75} />
                <span>
                  {site.name}
                  <br />
                  {formattedAddress}
                </span>
              </p>
            </address>
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <FooterList title="Services" links={[...serviceLinks, { label: "All services", href: "/services/" }]} />
            <FooterList title="Company" links={companyLinks()} />
            <FooterList title="Legal" links={legalLinks} />
          </nav>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <h2 className="eyebrow eyebrow-plain">Part of {site.parentOrganization}</h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-small text-fg-subtle">
            {liveNetworkSites.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener" className="link-draw inline-flex min-h-8 items-center transition-colors hover:text-fg">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-small text-fg-subtle">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <a href="#main" className="group inline-flex min-h-10 items-center gap-2 text-fg-muted transition-colors hover:text-fg">
            Back to top
            <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
