import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  as?: "h2" | "h3";
  size?: "m" | "l";
  className?: string;
};

/** Eyebrow + display heading + optional intro, on the editorial grid. */
export function SectionHeading({ eyebrow, title, intro, id, as: Tag = "h2", size = "m", className = "" }: Props) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <Tag id={id} className={`font-display ${size === "l" ? "text-display-l" : "text-display-m"}`}>
        {title}
      </Tag>
      {intro && <div className="mt-5 text-lead text-fg-muted max-w-2xl">{intro}</div>}
    </div>
  );
}
