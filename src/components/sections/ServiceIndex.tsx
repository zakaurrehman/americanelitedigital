import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pillarPhotos } from "@/content/media";
import { getService, pillars } from "@/content/services";

/**
 * The four practices. Every card shows its services at rest — hover and focus only add motion
 * (the photo zooms, the card lifts, the cursor spotlight lights its border).
 */
export function ServiceIndex({ variant = "full", headingLevel = "h3" }: { variant?: "full" | "compact"; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;

  if (variant === "compact") {
    return (
      <ol className="border-t border-line">
        {pillars.map((pillar) => (
          <li key={pillar.id} className="grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[3rem_1fr]">
            <span className="index-num text-[1.35rem] leading-none" aria-hidden="true">
              {pillar.number}
            </span>
            <div>
              <Heading className="text-[1.375rem] font-semibold leading-tight tracking-[-0.025em]">
                <span className="sr-only">{pillar.number}. </span>
                {pillar.name}
              </Heading>
              <ul className="mt-1.5 grid gap-0.5">
                {pillar.services.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${slug}/`} className="group flex min-h-11 items-center justify-between gap-4 text-fg-muted transition-colors hover:text-brand">
                      <span className="font-medium">{getService(slug).name}</span>
                      <ArrowRight aria-hidden="true" className="icon-arrow size-4 shrink-0 text-accent" strokeWidth={1.75} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol data-spotlight className="grid gap-5 md:grid-cols-2">
      {pillars.map((pillar, i) => {
        const photo = pillarPhotos[pillar.id];
        return (
          <li
            key={pillar.id}
            data-reveal
            style={{ "--i": i } as React.CSSProperties}
            className="card spot lift group flex flex-col overflow-hidden rounded-[var(--radius-lg)]"
          >
            <div className="zoom-frame relative aspect-[16/9] overflow-hidden">
              <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(6_18_58/0.7)] via-[rgb(6_18_58/0.1)] to-transparent" />
              <span aria-hidden="true" className="absolute left-5 top-5 grid size-12 place-items-center rounded-full bg-white font-serif text-[1.35rem] italic text-[var(--gold-700)] shadow-[var(--shadow-sm)]">
                {pillar.number}
              </span>
              <Heading className="absolute bottom-5 left-6 right-6 text-display-s text-white">
                <span className="sr-only">{pillar.number}. </span>
                {pillar.name}
              </Heading>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <p className="text-fg-muted">{pillar.description}</p>
              <ul className="mt-5 grid gap-2">
                {pillar.services.map((slug) => {
                  const service = getService(slug);
                  return (
                    <li key={slug}>
                      <Link
                        href={`/${slug}/`}
                        className="group/link flex items-center justify-between gap-5 rounded-[var(--radius-sm)] border border-line bg-bg-raised px-4 py-3.5 transition-colors hover:border-[var(--gold-500)] hover:bg-white"
                      >
                        <span>
                          <span className="block font-semibold text-brand">{service.name}</span>
                          <span className="mt-0.5 block text-small text-fg-subtle">{service.summary}</span>
                        </span>
                        <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-accent transition-transform duration-300 group-hover/link:translate-x-1" strokeWidth={1.75} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
