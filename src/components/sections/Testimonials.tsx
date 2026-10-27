import { Quote } from "lucide-react";
import { getService } from "@/content/services";
import type { Testimonial } from "@/content/testimonials";

/** Client quotes. Placeholder entries are visibly marked so they can't be mistaken for real ones. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <ul data-spotlight className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t, i) => (
        <li key={`${t.name}-${i}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
          <figure className="card spot flex h-full flex-col rounded-[var(--radius-lg)] p-7 sm:p-8">
            {/* No star icons: they would imply a rating the client never gave. */}
            <Quote aria-hidden="true" className="size-8 text-[var(--gold-500)]" strokeWidth={1.5} />
            {t.placeholder && (
              <p className="mt-5 w-fit rounded-full border border-danger bg-danger-bg px-3 py-1 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-danger">
                Preview placeholder
              </p>
            )}
            <blockquote className="mt-5 flex-1 text-lead text-fg">
              <p>“{t.quote}”</p>
            </blockquote>
            <figcaption className="mt-7 border-t border-line pt-5">
              <span className="block font-semibold text-brand">{t.name}</span>
              {(t.role || t.service) && (
                <span className="mt-0.5 block text-small text-fg-subtle">{[t.role, t.service && getService(t.service).name].filter(Boolean).join(" · ")}</span>
              )}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
