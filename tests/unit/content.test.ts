import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { insights } from "@/content/insights";
import { companyLinks, legalLinks, primaryNav, serviceLinks } from "@/content/navigation";
import { designPackages, PACKAGES_PUBLISHED } from "@/content/packages";
import { projects, visibleProjects } from "@/content/projects";
import { pillars, services } from "@/content/services";
import { networkSites, site } from "@/content/site";
import { articleSchema, faqSchema, organizationSchema, serviceSchema } from "@/lib/structured-data";

const appDir = path.join(process.cwd(), "src", "app");
const routeExists = (href: string) => {
  const segments = href.replace(/^\/|\/$/g, "");
  if (!segments) return existsSync(path.join(appDir, "page.tsx"));
  if (insights.some((i) => i.slug === segments)) return true;
  return existsSync(path.join(appDir, ...segments.split("/"), "page.tsx"));
};

describe("content integrity", () => {
  it("every service belongs to exactly one pillar", () => {
    const listed = pillars.flatMap((p) => p.services);
    expect(listed.sort()).toEqual(services.map((s) => s.slug).sort());
  });

  it("service cross-references point at real services and articles", () => {
    for (const s of services) {
      for (const slug of s.related) expect(services.some((x) => x.slug === slug), `${s.slug} → ${slug}`).toBe(true);
      for (const slug of s.insights) expect(insights.some((x) => x.slug === slug), `${s.slug} → ${slug}`).toBe(true);
    }
  });

  it("every article has a Markdown body, an image file and a single top-level heading level", () => {
    for (const i of insights) {
      const file = path.join(process.cwd(), "src", "content", "insights", `${i.slug}.md`);
      expect(existsSync(file), file).toBe(true);
      const body = readFileSync(file, "utf8");
      expect(body).not.toMatch(/^# /m); // the page supplies the only H1
      expect(existsSync(path.join(process.cwd(), "public", i.image.src))).toBe(true);
    }
  });

  it("every navigation link resolves to a route", () => {
    for (const link of [...serviceLinks, ...primaryNav(), ...companyLinks(), ...legalLinks]) {
      expect(routeExists(link.href), link.href).toBe(true);
    }
  });

  it("keeps the logo packages unpublished and their prices unchanged until the owner confirms", () => {
    expect(PACKAGES_PUBLISHED).toBe(false);
    expect(designPackages.map((p) => [p.id, p.price])).toEqual([
      ["logo-design", 116],
      ["logo-and-identity", 134],
      ["identity-and-social-media-kit", 116],
    ]);
  });

  it("has no invented case studies, and never shows placeholders unless explicitly previewing", () => {
    expect(projects.every((p) => p.clientApproved && !p.placeholder)).toBe(true);
    const previous = process.env.PREVIEW_PLACEHOLDER_WORK;
    delete process.env.PREVIEW_PLACEHOLDER_WORK;
    expect(visibleProjects()).toEqual(projects);
    process.env.PREVIEW_PLACEHOLDER_WORK = "true";
    expect(visibleProjects().every((p) => p.placeholder) || projects.length > 0).toBe(true);
    if (previous === undefined) delete process.env.PREVIEW_PLACEHOLDER_WORK;
    else process.env.PREVIEW_PLACEHOLDER_WORK = previous;
  });

  it("hides sister sites that were down at launch", () => {
    expect(networkSites.filter((s) => !s.live).map((s) => s.name)).toEqual([
      "Business Star Makers",
      "American Elite Global Solutions",
      "American Elite Executives",
    ]);
  });
});

describe("structured data", () => {
  const all = [organizationSchema(), ...services.map(serviceSchema), ...insights.map(articleSchema), faqSchema(services[0]!.faqs)];
  const json = JSON.stringify(all);

  it("never emits unverified claims", () => {
    for (const key of ["aggregateRating", "review", "award", "openingHours", "areaServed", "foundingDate", "numberOfEmployees"]) {
      expect(json).not.toContain(`"${key}"`);
    }
  });

  it("uses the published contact details", () => {
    expect(organizationSchema()).toMatchObject({
      telephone: site.phone.schema,
      email: site.email,
      address: { streetAddress: site.address.street, postalCode: site.address.postalCode },
    });
  });
});
