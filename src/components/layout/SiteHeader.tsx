import { primaryNav } from "@/content/navigation";
import { getPillar, servicesInPillarOrder } from "@/content/services";
import { site } from "@/content/site";
import { BrandMark } from "./BrandMark";
import { HeaderNav, type ServiceNavItem } from "./HeaderNav";

export function SiteHeader() {
  // Only the fields the client menu renders are passed down, keeping service content out of the client bundle.
  const services: ServiceNavItem[] = servicesInPillarOrder.map((s) => ({
    label: s.name,
    href: `/${s.slug}/`,
    summary: s.summary,
    pillar: getPillar(s.pillar).number,
  }));

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-[var(--aed-paper)]">
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-4">
        <BrandMark />
        <HeaderNav services={services} links={primaryNav()} phone={site.phone} email={site.email} />
      </div>
    </header>
  );
}
