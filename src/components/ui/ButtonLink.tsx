import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary";

type Props = Omit<ComponentProps<typeof Link>, "className" | "children"> & {
  variant?: Variant;
  size?: "md" | "sm";
  arrow?: boolean;
  /** Drifts toward the pointer on fine-pointer devices (see MotionRuntime). */
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", arrow = false, magnetic = false, className = "", children, ...props }: Props) {
  return (
    <Link {...props} data-magnetic={magnetic || undefined} className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`}>
      {children}
      {arrow && <ArrowRight aria-hidden="true" className="icon-arrow size-[1.1em]" strokeWidth={1.75} />}
    </Link>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link-arrow group ${className}`}>
      {children}
      <ArrowRight aria-hidden="true" className="icon-arrow size-[1.05em]" strokeWidth={1.75} />
    </Link>
  );
}
