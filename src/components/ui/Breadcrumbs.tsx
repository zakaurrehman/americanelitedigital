import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus matching BreadcrumbList JSON-LD. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-small text-fg-subtle">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.path} className="inline-flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-fg-muted">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="link-draw inline-flex min-h-6 items-center transition-colors hover:text-fg">
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true" className="text-line-strong">
                      /
                    </span>
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
