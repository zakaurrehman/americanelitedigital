import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPillar, getService } from "@/content/services";

export function RelatedServices({ slugs }: { slugs: string[] }) {
  return (
    <ul data-spotlight className="grid gap-3 md:grid-cols-3">
      {slugs.map((slug, i) => {
        const service = getService(slug);
        const pillar = getPillar(service.pillar);
        return (
          <li key={slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
            <Link href={`/${slug}/`} className="card spot lift group flex h-full flex-col p-7">
              <span className="flex items-baseline gap-2.5 text-small text-fg-subtle">
                <span className="index-num text-[1.15rem]">{pillar.number}</span>
                {pillar.name}
              </span>
              <span className="mt-5 text-title font-semibold text-brand">{service.name}</span>
              <span className="mt-2 flex-1 text-fg-muted">{service.summary}</span>
              <span className="arrow-disc mt-8">
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
