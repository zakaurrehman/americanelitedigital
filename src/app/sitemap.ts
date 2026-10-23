import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { packagesEnabled } from "@/content/packages";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

/** Only canonical, indexable 200 URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${site.contentUpdated}T00:00:00Z`);
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: absoluteUrl(path), lastModified: updated, priority });

  return [
    page("/", 1),
    page("/services/", 0.9),
    ...services.map((s) => page(`/${s.slug}/`, 0.9)),
    ...(packagesEnabled() ? [page("/pricing/", 0.8)] : []),
    // Real case studies only — preview placeholders are never listed.
    ...(projects.length ? [page("/work/", 0.8)] : []),
    page("/about-us/", 0.7),
    page("/why-choose-us/", 0.7),
    page("/contact-us/", 0.8),
    page("/blogs/", 0.6),
    ...insights.map((i) => ({ url: absoluteUrl(`/${i.slug}/`), lastModified: new Date(i.modified), priority: 0.5 })),
    page("/privacy-policy/", 0.2),
    page("/terms-conditions/", 0.2),
  ];
}
