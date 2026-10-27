import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { pillarIcons } from "@/components/ui/icons";
import { getPillar, servicesInPillarOrder } from "@/content/services";

/**
 * Side-by-side service offerings: who each is for, what it includes and how to start. Built only
 * from the service content — no prices until the owner confirms them (see src/content/packages.ts).
 */
export function ServicePackages({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;

  return (
    <ul data-spotlight className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {servicesInPillarOrder.map((service, i) => {
        const pillar = getPillar(service.pillar);
        const Icon = pillarIcons[pillar.id];
        const included = service.deliverables.flatMap((g) => g.items).slice(0, 5);
        return (
          <li
            key={service.slug}
            data-reveal
            style={{ "--i": i } as React.CSSProperties}
            className="card spot lift flex flex-col rounded-[var(--radius-lg)] p-7 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="icon-tile size-11" aria-hidden="true">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">{pillar.name}</span>
            </div>
            <Heading className="mt-6 text-title font-semibold text-brand">{service.name}</Heading>
            <p className="mt-2 text-fg-muted">{service.summary}</p>

            <p className="mt-7 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-fg-subtle">What’s included</p>
            <ul className="mt-3 grid flex-1 content-start gap-2.5">
              {included.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <Check aria-hidden="true" className="mt-0.5 size-[1.1rem] shrink-0 text-success" strokeWidth={2.25} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>

            <p className="mt-7 flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-bg-raised px-4 py-3 text-small text-fg-muted">
              <MessageCircle aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
              Free consultation and initial project ideas
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={`/${service.slug}/#inquiry`} arrow>
                Get a free consultation<span className="sr-only"> for {service.name.toLowerCase()}</span>
              </ButtonLink>
              <Link href={`/${service.slug}/`} className="group inline-flex min-h-11 items-center gap-2 font-medium text-brand">
                <span className="link-draw">
                  Full details<span className="sr-only"> about {service.name.toLowerCase()}</span>
                </span>
                <ArrowRight aria-hidden="true" className="icon-arrow size-4 text-accent" strokeWidth={1.75} />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
