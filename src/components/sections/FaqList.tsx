import { Plus } from "lucide-react";
import type { Faq } from "@/content/services";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/structured-data";

/** Native <details> disclosure: keyboard and screen-reader support with no JavaScript. */
export function FaqList({ faqs, withSchema = true }: { faqs: Faq[]; withSchema?: boolean }) {
  return (
    <>
      <div className="border-t border-line">
        {faqs.map((faq) => (
          <details key={faq.question} className="group border-b border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-start justify-between gap-6 py-5 text-title font-semibold transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <Plus aria-hidden="true" className="mt-1 size-5 shrink-0 text-ornament transition-transform duration-200 group-open:rotate-45" strokeWidth={1.75} />
            </summary>
            <p className="max-w-3xl pb-6 pr-10 text-fg-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </>
  );
}
