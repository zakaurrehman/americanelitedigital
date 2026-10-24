import type { Metadata } from "next";
import { SITE_URL, site } from "@/content/site";

type PageMeta = {
  /** Page topic; the brand suffix is added by the root layout's title template. */
  title: string;
  description: string;
  /** Path with leading and trailing slash, e.g. "/about-us/". */
  path: string;
  type?: "website" | "article";
  image?: { url: string; width: number; height: number; alt: string };
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

const DEFAULT_IMAGE = { url: "/og/default.png", width: 1200, height: 630, alt: `${site.name} — Brand. Web. Software. One team.` };

export function pageMetadata({ title, description, path, type = "website", image = DEFAULT_IMAGE, publishedTime, modifiedTime, noindex }: PageMeta): Metadata {
  const images = [image];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      title,
      description,
      locale: "en_US",
      images,
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
