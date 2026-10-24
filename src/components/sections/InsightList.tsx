import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Insight } from "@/content/insights";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

function Meta({ insight }: { insight: Insight }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-fg-subtle">
      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-accent-strong">{insight.topic}</span>
      <time dateTime={insight.published}>{formatDate(insight.published)}</time>
    </p>
  );
}

/** One featured article (image reveals with a mask, then drifts with scroll) and a ruled list of the rest. */
export function InsightList({ items, headingLevel = "h3", featureFirst = true }: { items: Insight[]; headingLevel?: "h2" | "h3"; featureFirst?: boolean }) {
  const Heading = headingLevel;
  const [lead, ...rest] = featureFirst ? items : [undefined, ...items];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      {lead && (
        <article className="group relative lg:col-span-7">
          <div data-reveal="mask" className="zoom-frame photo relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
            <Image
              src={lead.image.src}
              alt={lead.image.alt}
              width={lead.image.width}
              height={lead.image.height}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="parallax-img absolute inset-0 size-full object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(6_18_58/0.35)] to-transparent" />
          </div>
          <div className="mt-7">
            <Meta insight={lead} />
            <Heading className="mt-4 text-display-s">
              <Link href={`/${lead.slug}/`} className="after:absolute after:inset-0 transition-colors hover:text-accent-strong">
                {lead.title}
              </Link>
            </Heading>
            <p className="mt-3 max-w-xl text-fg-muted">{lead.summary}</p>
          </div>
        </article>
      )}
      <ul data-spotlight className={`grid content-start gap-3 ${lead ? "lg:col-span-5" : "lg:col-span-12 lg:grid-cols-2"}`}>
        {rest.map(
          (item, i) =>
            item && (
              <li key={item.slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <article className="card spot lift group relative flex items-start justify-between gap-6 p-6">
                  <div>
                    <Meta insight={item} />
                    <Heading className="mt-3 text-title font-semibold">
                      <Link href={`/${item.slug}/`} className="after:absolute after:inset-0">
                        {item.title}
                      </Link>
                    </Heading>
                  </div>
                  <span className="arrow-disc mt-1">
                    <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  </span>
                </article>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
