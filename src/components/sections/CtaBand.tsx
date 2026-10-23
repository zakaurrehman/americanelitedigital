import { offer } from "@/content/company";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StarRule } from "@/components/ui/Ornament";

/** Compact closing call to action for pages that don't carry the full inquiry form. */
export function CtaBand({ title = "Have a project in mind?", text = offer.long }: { title?: string; text?: string }) {
  return (
    <section aria-labelledby="cta-title" className="surface-paper-2 section">
      <div className="container-site text-center">
        <StarRule className="mx-auto mb-10 max-w-xs" />
        <h2 id="cta-title" className="mx-auto max-w-3xl font-display text-display-m">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lead text-fg-muted">{text}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact-us/" arrow>
            Start a project
          </ButtonLink>
          <a href={site.phone.href} className="btn btn-secondary tabular">
            Call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
