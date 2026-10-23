import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus matching BreadcrumbList JSON-LD. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-small text-fg-subtle">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.path} className="inline-flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-fg-muted">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="link inline-flex min-h-6 items-center">
                      {crumb.name}
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
