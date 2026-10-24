import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  as?: "h2" | "h3";
  size?: "m" | "l";
  className?: string;
  /** Reveal-once as it scrolls in (MotionRuntime). */
  reveal?: boolean;
};

/** Eyebrow + display heading + optional intro. */
export function SectionHeading({ eyebrow, title, intro, id, as: Tag = "h2", size = "m", className = "", reveal = true }: Props) {
  return (
    <div className={`max-w-3xl ${className}`} data-reveal={reveal || undefined}>
      {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
      <Tag id={id} className={size === "l" ? "text-display-l" : "text-display-m"}>
        {title}
      </Tag>
      {intro && <div className="mt-6 max-w-2xl text-lead text-fg-muted">{intro}</div>}
    </div>
  );
}
