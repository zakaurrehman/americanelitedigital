import { packagesEnabled } from "./packages";
import { visibleProjects } from "./projects";
import { servicesInPillarOrder } from "./services";

export type NavLink = { label: string; href: string };

export const serviceLinks: NavLink[] = servicesInPillarOrder.map((s) => ({ label: s.name, href: `/${s.slug}/` }));

// Pricing and Work appear only when there is something real to show (see packages.ts, projects.ts).
const optional = () => [
  ...(visibleProjects().length ? [{ label: "Work", href: "/work/" }] : []),
  ...(packagesEnabled() ? [{ label: "Pricing", href: "/pricing/" }] : []),
];

export function primaryNav(): NavLink[] {
  return [...optional(), { label: "About", href: "/about-us/" }, { label: "Why us", href: "/why-choose-us/" }, { label: "Insights", href: "/blogs/" }];
}

export function companyLinks(): NavLink[] {
  return [
    { label: "About us", href: "/about-us/" },
    { label: "Why choose us", href: "/why-choose-us/" },
    ...optional(),
    { label: "Insights", href: "/blogs/" },
    { label: "Contact", href: "/contact-us/" },
  ];
}

export const legalLinks: NavLink[] = [
  { label: "Privacy policy", href: "/privacy-policy/" },
  { label: "Terms & conditions", href: "/terms-conditions/" },
];
