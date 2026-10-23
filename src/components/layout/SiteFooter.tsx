import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { companyLinks, legalLinks, serviceLinks } from "@/content/navigation";
import { formattedAddress, liveNetworkSites, site } from "@/content/site";
import { BrandMark } from "./BrandMark";

function FooterList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow eyebrow-plain mb-4 text-fg-muted">{title}</h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="link inline-flex min-h-10 items-center decoration-transparent hover:decoration-current">
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
    <footer className="surface-navy no-print">
      <div className="container-site pb-10 pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandMark />
            <p className="mt-6 max-w-sm text-fg-muted">{site.shortDescription}</p>
            <address className="mt-8 space-y-1 not-italic">
              <a href={site.phone.href} className="flex min-h-10 items-center gap-3 tabular">
                <Phone aria-hidden="true" className="size-4 text-ornament" strokeWidth={1.75} />
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className="flex min-h-10 items-center gap-3 break-all">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-ornament" strokeWidth={1.75} />
                {site.email}
              </a>
              <p className="flex items-start gap-3 py-2 text-fg-muted">
                <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-ornament" strokeWidth={1.75} />
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
          <h2 className="eyebrow eyebrow-plain text-fg-muted">Part of {site.parentOrganization}</h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-small text-fg-muted">
            {liveNetworkSites.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener" className="link inline-flex min-h-8 items-center decoration-transparent hover:decoration-current">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-small text-fg-muted">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
