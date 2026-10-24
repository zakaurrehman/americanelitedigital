import Image from "next/image";
import { offer } from "@/content/company";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import emblem from "../../../public/brand/emblem.png";

/** Closing call to action for pages that don't carry the full inquiry form. */
export function CtaBand({ title = "Have a project in mind?", text = offer.long }: { title?: string; text?: string }) {
  return (
    <section aria-labelledby="cta-title" className="section">
      <div className="container-site">
        <div data-spotlight data-reveal="scale" className="surface-navy relative isolate overflow-hidden rounded-[var(--radius-xl)] px-6 py-16 text-center shadow-[var(--shadow-lg)] sm:px-12 sm:py-24">
          <div aria-hidden="true" className="bg-stars absolute inset-0 -z-10" />
          <div aria-hidden="true" className="aurora -z-10" />
          <Image src={emblem} alt="" aria-hidden="true" sizes="420px" className="pointer-events-none absolute -right-16 -top-10 -z-10 w-[26rem] max-w-none opacity-[0.08]" />
          <div aria-hidden="true" className="gold-rule absolute inset-x-[15%] top-0" />
          <h2 id="cta-title" className="mx-auto max-w-4xl text-display-l">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lead text-fg-muted">{text}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact-us/" arrow magnetic>
              Start a project
            </ButtonLink>
            <a href={site.phone.href} className="btn btn-secondary tabular">
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
