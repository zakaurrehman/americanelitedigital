import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getService, pillars } from "@/content/services";

/**
 * The four pillars as an indexed list. Every row shows its services at rest (nothing is hidden
 * behind hover); hover and focus only add emphasis.
 */
export function ServiceIndex({ variant = "full", headingLevel = "h3" }: { variant?: "full" | "compact"; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ol className="border-t border-line">
      {pillars.map((pillar) => (
        <li key={pillar.id} className="border-b border-line">
          <div className={`grid gap-x-6 ${variant === "full" ? "gap-y-3 py-8 sm:py-10 md:grid-cols-12" : "gap-y-1 py-4 sm:grid-cols-[3rem_1fr]"}`}>
            <div className={variant === "full" ? "flex items-baseline gap-5 md:col-span-5" : "contents"}>
              <span className="tabular text-label font-semibold tracking-[0.14em] text-ornament" aria-hidden="true">
                {pillar.number}
              </span>
              <div>
                <Heading className={`font-display ${variant === "full" ? "text-display-s" : "text-[1.5rem] leading-tight"}`}>
                  <span className="sr-only">{pillar.number}. </span>
                  {pillar.name}
                </Heading>
                {variant === "full" && <p className="mt-1 text-fg-muted">{pillar.tagline}</p>}
              </div>
            </div>
            <ul className={variant === "full" ? "grid gap-2 md:col-span-7 md:pt-1" : "grid gap-1 sm:col-start-2"}>
              {pillar.services.map((slug) => {
                const service = getService(slug);
                return (
                  <li key={slug}>
                    <Link
                      href={`/${slug}/`}
                      className="group flex min-h-11 items-start justify-between gap-4 rounded-sm py-1.5 transition-colors hover:text-accent"
                    >
                      <span>
                        <span className="font-semibold">{service.name}</span>
                        {variant === "full" && <span className="mt-0.5 block text-fg-muted">{service.summary}</span>}
                      </span>
                      <ArrowRight aria-hidden="true" className="icon-arrow mt-1 size-5 shrink-0 text-ornament" strokeWidth={1.5} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
