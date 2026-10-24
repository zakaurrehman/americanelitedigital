import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import type { Photo } from "@/content/media";

type Props = {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  /** Header photo; opens out of a rounded mask. With `aside`, the aside overlaps its lower edge. */
  image?: Photo;
  /** "ambient" adds the soft brand light; "plain" is for long-form pages (legal, articles). */
  tone?: "ambient" | "plain";
};

/** Page header for inner pages: grid backdrop, breadcrumb, eyebrow, masked H1, lead, actions, photo. */
export function PageHeader({ crumbs, eyebrow, title, lead, actions, aside, image, tone = "ambient" }: Props) {
  const wide = Boolean(aside || image);
  return (
    <header data-spotlight data-tilt className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      {tone === "ambient" && <div aria-hidden="true" className="aurora -z-10" />}
      <div aria-hidden="true" className="pointer-light -z-10" />
      <div className="container-site pb-16 pt-8 sm:pb-20 sm:pt-10">
        <Breadcrumbs items={crumbs} />
        <div className={`mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 ${image ? "lg:items-center" : "lg:items-end"}`}>
          <div className={wide ? "lg:col-span-7" : "lg:col-span-10"}>
            {eyebrow && <p className="eyebrow motion-rise mb-7">{eyebrow}</p>}
            <h1 className="text-display-xl">
              <span className="line-mask">
                <span>{title}</span>
              </span>
            </h1>
            {lead && <div className="motion-slide mt-8 max-w-2xl text-lead text-fg-muted">{lead}</div>}
            {actions && <div className="motion-rise mt-10 flex flex-wrap gap-3 [--delay:140ms]">{actions}</div>}
          </div>
          {wide && (
            <div className="relative lg:col-span-5">
              {image && (
                <div
                  className="relative"
                  style={{ transform: "translate3d(calc(var(--tx, 0) * -12px), calc(var(--ty, 0) * -12px), 0)", transition: "transform 900ms cubic-bezier(0.16,1,0.3,1)" }}
                >
                  <div aria-hidden="true" className="absolute -right-4 -top-4 size-28 rounded-full bg-[radial-gradient(circle,rgb(244_196_52/0.45),transparent_70%)]" />
                  <div className="motion-photo photo aspect-[4/3] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]">
                    <Image src={image.src} alt={image.alt} fill loading="eager" placeholder="blur" sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
                  </div>
                </div>
              )}
              {aside && <div className={`motion-rise relative z-10 [--delay:180ms] ${image ? "-mt-16 mx-4 sm:mx-8 lg:-ml-10 lg:mr-6" : ""}`}>{aside}</div>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
