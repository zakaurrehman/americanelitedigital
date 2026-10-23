import { insightsByDate } from "@/content/insights";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

// RSS 2.0 at /feed/ — the URL WordPress used, so existing subscribers keep working.
export const dynamic = "force-static";

const xml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string);

export function GET() {
  const items = insightsByDate
    .map(
      (i) => `    <item>
      <title>${xml(i.title)}</title>
      <link>${absoluteUrl(`/${i.slug}/`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/${i.slug}/`)}</guid>
      <pubDate>${new Date(i.published).toUTCString()}</pubDate>
      <dc:creator>${xml(i.author)}</dc:creator>
      <category>${xml(i.topic)}</category>
      <description>${xml(i.summary)}</description>
    </item>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(site.name)} — Insights</title>
    <link>${absoluteUrl("/blogs/")}</link>
    <atom:link href="${absoluteUrl("/feed/")}" rel="self" type="application/rss+xml" />
    <description>${xml(site.shortDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(insightsByDate[0]?.modified ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
