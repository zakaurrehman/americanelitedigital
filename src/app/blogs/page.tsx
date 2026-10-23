import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { InsightList } from "@/components/sections/InsightList";
import { PageHeader } from "@/components/sections/PageHeader";
import { insightsByDate } from "@/content/insights";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights on Digital Strategy & Marketing",
  description:
    "Articles from American Elite Digital on digital strategy, campaigns, website optimisation and the future of digital marketing.",
  path: "/blogs/",
});

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Insights", path: "/blogs/" }]}
        eyebrow="Insights"
        title="Insights"
        lead="Practical thinking on digital strategy, campaigns, websites and where marketing is heading."
      />
      <section aria-label="Articles" className="section">
        <div className="container-site">
          <InsightList items={insightsByDate} headingLevel="h2" />
        </div>
      </section>
      <CtaBand title="Want this thinking applied to your business?" />
    </>
  );
}
