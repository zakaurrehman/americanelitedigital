import { Plus } from "lucide-react";
import type { Faq } from "@/content/services";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/structured-data";

/**
 * Native <details> disclosure: keyboard and screen-reader support with no JavaScript. Where the
 * browser supports ::details-content, the answer eases open (CSS only); elsewhere it opens instantly.
 */
export function FaqList({ faqs, withSchema = true }: { faqs: Faq[]; withSchema?: boolean }) {
  return (
    <>
      <div className="grid gap-3">
        {faqs.map((faq, i) => (
          <details
            key={faq.question}
            data-reveal
            style={{ "--i": i } as React.CSSProperties}
            className="faq-item group rounded-[var(--radius-md)] border border-line bg-white shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-300 hover:border-line-strong open:border-[var(--gold-500)] open:shadow-[var(--shadow-md)]"
          >
            <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 px-5 py-5 text-title font-semibold text-brand sm:px-7">
              <span>{faq.question}</span>
              <span className="faq-icon grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-brand">
                <Plus aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </span>
            </summary>
            <p className="max-w-3xl px-5 pb-6 pr-16 text-fg-muted sm:px-7">{faq.answer}</p>
          </details>
        ))}
      </div>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </>
  );
}
