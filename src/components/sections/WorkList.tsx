import Image from "next/image";
import { getService } from "@/content/services";
import type { Project } from "@/content/projects";

/** Case-study list. Placeholder entries are visibly marked so they can't be mistaken for real work. */
export function WorkList({ items, headingLevel = "h3" }: { items: Project[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
      {items.map((project) => (
        <li key={project.slug}>
          <article>
            {project.image ? (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="aspect-[4/3] w-full rounded-sm border border-line object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-sm border border-dashed border-line-strong bg-bg-raised text-small text-fg-subtle">
                Project image to come
              </div>
            )}
            {project.placeholder && (
              <p className="mt-4 inline-block rounded-xs bg-danger-bg px-2 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[var(--aed-danger)]">
                Preview placeholder
              </p>
            )}
            <p className="mt-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ornament">
              {project.services.map((s) => getService(s).name).join(" · ")}
            </p>
            <Heading className="mt-2 text-title font-semibold">{project.title}</Heading>
            <p className="mt-1 text-small text-fg-subtle">{project.client}</p>
            <p className="mt-3 text-fg-muted">{project.summary}</p>
            {project.results.length > 0 && (
              <ul className="mt-4 space-y-1 border-t border-line pt-4 text-small">
                {project.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
