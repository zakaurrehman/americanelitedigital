import type { TitledText } from "@/content/services";

/** Numbered steps on a hairline: horizontal from lg, vertical below. */
export function ProcessSteps({ steps }: { steps: TitledText[] }) {
  return (
    <ol className="grid gap-0 lg:grid-cols-4 lg:gap-8">
      {steps.map((step, i) => (
        <li key={step.title} className="motion-reveal relative border-l border-line pb-10 pl-8 last:pb-0 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-8">
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-1 size-[9px] rotate-45 bg-[var(--ornament)] lg:-top-[5px] lg:left-0"
          />
          <p className="tabular text-label font-semibold tracking-[0.14em] text-fg-subtle">Step {String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 text-title font-semibold">{step.title}</h3>
          <p className="mt-2 text-fg-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
