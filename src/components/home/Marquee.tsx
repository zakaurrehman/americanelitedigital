import { Star } from "lucide-react";

/**
 * Navy band of service names that scrolls sideways (CSS only; starts once the visitor interacts,
 * pauses on hover, static under reduced motion). Decorative: the same services are listed as text.
 */
export function Marquee({ items }: { items: string[] }) {
  const row = (copy: number) =>
    items.map((item) => (
      <span key={`${copy}-${item}`} className="flex items-center gap-8 pr-8">
        <span className="whitespace-nowrap text-[clamp(1.25rem,2.4vw,1.85rem)] font-semibold tracking-[-0.02em] text-white">{item}</span>
        <Star className="size-4 shrink-0 fill-[var(--gold-400)] text-[var(--gold-400)]" strokeWidth={1} />
      </span>
    ));
  return (
    <div aria-hidden="true" className="marquee surface-navy relative overflow-hidden py-6 sm:py-7">
      <div className="gold-rule absolute inset-x-0 top-0" />
      <div className="marquee-track [--marquee-dur:45s]">
        <div className="flex">{row(0)}</div>
        <div className="flex">{row(1)}</div>
      </div>
      <div className="gold-rule absolute inset-x-0 bottom-0" />
    </div>
  );
}
