import { PageHeader } from "@/components/sections/PageHeader";
import { formatDate } from "@/components/sections/InsightList";
import type { LegalDocument } from "@/content/legal";
import { formattedAddress, site } from "@/content/site";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Legal text with an on-page table of contents. The wording itself is carried over verbatim. */
export function LegalPage({ doc, path }: { doc: LegalDocument; path: string }) {
  return (
    <>
      <PageHeader
        tone="plain"
        crumbs={[{ name: doc.title, path }]}
        eyebrow="Legal"
        title={doc.title}
        lead={
          <>
            Last updated <time dateTime={doc.lastModified}>{formatDate(`${doc.lastModified}T00:00:00Z`)}</time>
          </>
        }
      />
      <div className="container-site section grid gap-12 lg:grid-cols-12">
        <nav aria-labelledby="toc-title" className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <h2 id="toc-title" className="eyebrow eyebrow-plain mb-5">
              On this page
            </h2>
            <ol className="space-y-0.5 border-l border-line">
              {doc.sections.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#${slugify(s.title)}`}
                    className="-ml-px flex min-h-10 items-center gap-3 border-l border-transparent pl-5 text-fg-muted transition-colors hover:border-accent hover:text-brand"
                  >
                    <span className="index-num w-5 text-[0.95rem]" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <div className="prose-editorial lg:col-span-8">
          <p>{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.title} aria-labelledby={slugify(s.title)}>
              <h2 id={slugify(s.title)}>{s.title}</h2>
              <p className="mt-5">{s.body}</p>
            </section>
          ))}
          <section aria-labelledby="legal-contact">
            <h2 id="legal-contact">Contact</h2>
            <p className="mt-5">
              {site.name}, {formattedAddress}. Email <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
              <a href={site.phone.href}>{site.phone.display}</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
