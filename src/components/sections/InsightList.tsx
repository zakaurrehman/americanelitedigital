import Image from "next/image";
import Link from "next/link";
import type { Insight } from "@/content/insights";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

function Meta({ insight }: { insight: Insight }) {
  return (
    <p className="text-small text-fg-subtle">
      <span className="font-semibold uppercase tracking-[0.12em] text-[0.75rem] text-ornament">{insight.topic}</span>
      <span aria-hidden="true" className="mx-2">
        ·
      </span>
      <time dateTime={insight.published}>{formatDate(insight.published)}</time>
    </p>
  );
}

/** One featured article with image, followed by a ruled list of the rest. */
export function InsightList({ items, headingLevel = "h3", featureFirst = true }: { items: Insight[]; headingLevel?: "h2" | "h3"; featureFirst?: boolean }) {
  const Heading = headingLevel;
  const [lead, ...rest] = featureFirst ? items : [undefined, ...items];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      {lead && (
        <article className="group relative lg:col-span-7">
          <div className="overflow-hidden rounded-sm border border-line">
            <Image
              src={lead.image.src}
              alt={lead.image.alt}
              width={lead.image.width}
              height={lead.image.height}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </div>
          <div className="mt-6">
            <Meta insight={lead} />
            <Heading className="mt-3 font-display text-display-s">
              <Link href={`/${lead.slug}/`} className="after:absolute after:inset-0 hover:text-accent">
                {lead.title}
              </Link>
            </Heading>
            <p className="mt-3 max-w-xl text-fg-muted">{lead.summary}</p>
          </div>
        </article>
      )}
      <ul className={`border-t border-line ${lead ? "lg:col-span-5" : "lg:col-span-12"}`}>
        {rest.map(
          (item) =>
            item && (
              <li key={item.slug} className="border-b border-line">
                <article className="relative py-7">
                  <Meta insight={item} />
                  <Heading className="mt-2 text-title font-semibold">
                    <Link href={`/${item.slug}/`} className="after:absolute after:inset-0 hover:text-accent">
                      {item.title}
                    </Link>
                  </Heading>
                </article>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
