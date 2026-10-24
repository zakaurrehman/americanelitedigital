import Image from "next/image";
import { getService } from "@/content/services";
import type { Project } from "@/content/projects";

/** Case-study list. Placeholder entries are visibly marked so they can't be mistaken for real work. */
export function WorkList({ items, headingLevel = "h3" }: { items: Project[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul data-spotlight className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {items.map((project, i) => (
        <li key={project.slug} data-reveal style={{ "--i": i } as React.CSSProperties}>
          <article className="group">
            {project.image ? (
              <div className="zoom-frame card aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  width={project.image.width}
                  height={project.image.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <div className="card spot flex aspect-[4/3] w-full items-center justify-center border-dashed text-small text-fg-subtle">
                <div aria-hidden="true" className="bg-grid absolute inset-0 rounded-[inherit] opacity-70" />
                <span className="relative">Project image to come</span>
              </div>
            )}
            {project.placeholder && (
              <p className="mt-5 inline-block rounded-full border border-danger bg-danger-bg px-3 py-1 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-danger">
                Preview placeholder
              </p>
            )}
            <p className="mt-5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-strong">
              {project.services.map((s) => getService(s).name).join(" · ")}
            </p>
            <Heading className="mt-2 text-title font-medium">{project.title}</Heading>
            <p className="mt-1 text-small text-fg-subtle">{project.client}</p>
            <p className="mt-3 text-fg-muted">{project.summary}</p>
            {project.results.length > 0 && (
              <ul className="mt-4 space-y-1 border-t border-line pt-4 text-small text-fg-muted">
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
