import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPillar, getService } from "@/content/services";

export function RelatedServices({ slugs }: { slugs: string[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-[var(--line)] md:grid-cols-3">
      {slugs.map((slug) => {
        const service = getService(slug);
        const pillar = getPillar(service.pillar);
        return (
          <li key={slug} className="bg-bg">
            <Link href={`/${slug}/`} className="group flex h-full flex-col p-7 transition-colors hover:bg-bg-raised">
              <span className="eyebrow eyebrow-plain">
                {pillar.number} / {pillar.name}
              </span>
              <span className="mt-3 text-title font-semibold group-hover:text-accent">{service.name}</span>
              <span className="mt-2 flex-1 text-fg-muted">{service.summary}</span>
              <ArrowRight aria-hidden="true" className="icon-arrow mt-5 size-5 text-ornament" strokeWidth={1.5} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
