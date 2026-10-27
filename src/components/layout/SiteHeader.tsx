import Link from "next/link";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import { offer } from "@/content/company";
import { primaryNav } from "@/content/navigation";
import { servicesInPillarOrder } from "@/content/services";
import { site } from "@/content/site";
import { BrandMark } from "./BrandMark";
import { HeaderNav, type ServiceNavItem } from "./HeaderNav";

export function SiteHeader() {
  // Only the fields the client menu renders are passed down, keeping service content out of the client bundle.
  const services: ServiceNavItem[] = servicesInPillarOrder.map((s) => ({
    label: s.name,
    href: `/${s.slug}/`,
    summary: s.summary,
    pillar: s.pillar,
  }));

  // The navy utility bar scrolls away (negative sticky offset of its own height) while the main
  // bar stays pinned. The main bar is solid white by default; where scroll-driven animations are
  // supported it starts transparent over the hero and fills in during the first 120px of scroll.
  return (
    <header className="site-header no-print sticky top-0 z-40 border-b border-line bg-white/95 md:top-[-2.5rem]">
      <div className="surface-navy hidden md:block">
        <div className="container-site flex h-10 items-center justify-between gap-6 text-[0.8125rem]">
          <Link href="/contact-us/" className="group inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-fg">
            <Star aria-hidden="true" className="size-3.5 fill-gold text-gold" strokeWidth={1.5} />
            <span>
              <span className="font-semibold text-fg">{offer.short}</span>
              <span className="hidden lg:inline"> — tell us what you’re planning</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 text-fg-muted">
            <span className="hidden items-center gap-2 xl:inline-flex">
              <MapPin aria-hidden="true" className="size-3.5 text-gold" strokeWidth={1.75} />
              Los Angeles, California
            </span>
            <a href={`mailto:${site.email}`} className="hidden items-center gap-2 transition-colors hover:text-fg lg:inline-flex">
              <Mail aria-hidden="true" className="size-3.5 text-gold" strokeWidth={1.75} />
              {site.email}
            </a>
            <a href={site.phone.href} className="inline-flex items-center gap-2 font-semibold text-fg tabular">
              <Phone aria-hidden="true" className="size-3.5 text-gold" strokeWidth={1.75} />
              {site.phone.display}
            </a>
          </div>
        </div>
      </div>
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-4">
        <BrandMark eager />
        <HeaderNav services={services} links={primaryNav()} phone={site.phone} email={site.email} />
      </div>
    </header>
  );
}
