import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

type Props = {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
};

/** Editorial page header for inner pages: breadcrumb, eyebrow, H1, lead and optional actions. */
export function PageHeader({ crumbs, eyebrow, title, lead, actions, aside }: Props) {
  return (
    <header className="border-b border-line">
      <div className="container-site pb-14 pt-8 sm:pb-20 sm:pt-10">
        <Breadcrumbs items={crumbs} />
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-end">
          <div className={aside ? "lg:col-span-8" : "lg:col-span-10"}>
            {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
            <h1 className="font-display text-display-l">{title}</h1>
            {lead && <div className="mt-7 max-w-2xl text-lead text-fg-muted">{lead}</div>}
            {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
          </div>
          {aside && <div className="lg:col-span-4">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
