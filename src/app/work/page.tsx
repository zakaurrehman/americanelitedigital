import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { WorkList } from "@/components/sections/WorkList";
import { projects, visibleProjects } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

// Returns 404 until a real case study is added to src/content/projects.ts.

export function generateMetadata(): Metadata {
  if (!visibleProjects().length) return { title: "Not found", robots: { index: false } };
  return pageMetadata({
    title: "Selected Work",
    description: "Selected brand, website, software and marketing projects by American Elite Digital.",
    path: "/work/",
    noindex: projects.length === 0, // placeholder previews must never be indexed
  });
}

export default function WorkPage() {
  const items = visibleProjects();
  if (!items.length) notFound();

  return (
    <>
      <PageHeader crumbs={[{ name: "Work", path: "/work/" }]} eyebrow="Work" title="Selected work" lead="A selection of recent projects across brand, web, software and marketing." />
      <section aria-label="Projects" className="section">
        <div className="container-site">
          <WorkList items={items} headingLevel="h2" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
