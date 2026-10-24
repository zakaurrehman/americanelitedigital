import type { TitledText } from "@/content/services";

/**
 * Vertical timeline whose beam fills as the visitor scrolls through it. Adapted from the
 * 21st.dev / Aceternity "Timeline" (MIT): the original's Framer Motion scroll hook is replaced by
 * a CSS scroll-driven animation (`.beam-fill` + view timeline `--process`), so there is no
 * JavaScript; where unsupported, the beam simply shows full.
 */
export function ProcessSteps({ steps }: { steps: TitledText[] }) {
  return (
    <div className="process-timeline relative">
      <div aria-hidden="true" className="absolute bottom-3 left-[19px] top-3 w-px bg-line">
        <div className="beam-fill absolute inset-0 origin-top bg-gradient-to-b from-[var(--gold-500)] via-accent to-[var(--blue-500)]" />
      </div>
      <ol className="grid gap-10 sm:gap-14">
        {steps.map((step, i) => (
          <li key={step.title} data-reveal style={{ "--i": i } as React.CSSProperties} className="relative grid grid-cols-[40px_1fr] gap-5 sm:gap-8">
            <span aria-hidden="true" className="relative z-10 mt-1 grid size-10 place-items-center rounded-full border-2 border-[var(--gold-400)] bg-white shadow-[var(--shadow-sm)]">
              <span className="size-2.5 rounded-full bg-accent" />
            </span>
            <div>
              <p className="index-num text-[1.5rem] leading-none" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-display-s">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-xl text-fg-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
