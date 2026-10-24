import { Star } from "lucide-react";

/** Gold rule with a star at its centre — the section divider, taken from the logo's ribbon and rules. */
export function GlowRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-4 ${className}`}>
      <span className="gold-rule flex-1" />
      <Star className="size-4 fill-gold text-gold" strokeWidth={1} />
      <span className="gold-rule flex-1" />
    </div>
  );
}
