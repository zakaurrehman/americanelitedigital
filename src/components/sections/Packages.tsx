import Link from "next/link";
import { Check, Minus } from "lucide-react";
import {
  comparisonRows,
  designPackages,
  finalFormats,
  formatPrice,
  packageGuarantees,
  type DesignPackage,
} from "@/content/packages";

const orderHref = (pkg: DesignPackage) => `/contact-us/?service=branding-and-design-consulting-services&package=${pkg.id}#inquiry`;

/** Package cards. Rendered only while packages are published (see src/content/packages.ts). */
export function PackageCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul data-spotlight className="grid gap-4 lg:grid-cols-3">
      {designPackages.map((pkg, i) => (
        <li
          key={pkg.id}
          id={pkg.id}
          data-reveal
          style={{ "--i": i } as React.CSSProperties}
          className={`card spot relative flex flex-col p-7 sm:p-8 ${pkg.featured ? "border-2 border-[var(--gold-500)] shadow-[var(--shadow-lg)]" : ""}`}
        >
          {pkg.featured && (
            <p className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white">
              Best choice
            </p>
          )}
          <Heading className="text-title font-medium">{pkg.name}</Heading>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="text-display-m tabular">{formatPrice(pkg.price)}</span>
            <span className="text-small text-fg-subtle">one-time</span>
          </p>
          <ul className="mt-7 space-y-3 border-t border-line pt-7 text-fg-muted">
            {pkg.included.map((item) => (
              <li key={item} className="flex gap-3">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-success" strokeWidth={2} />
                {item}
              </li>
            ))}
            {pkg.free.map((item) => (
              <li key={item} className="flex gap-3">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-success" strokeWidth={2} />
                <span>
                  {item === "Final formats" ? `Final formats (${finalFormats.join(", ")})` : item}{" "}
                  <span className="ml-1 rounded-full border border-line-strong px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-fg">Free</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-9">
            <Link href={orderHref(pkg)} data-magnetic className={`btn w-full ${pkg.featured ? "btn-primary" : "btn-secondary"}`}>
              Order {pkg.name}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PackageGuarantees() {
  return (
    <div className="card p-6 sm:p-8" data-reveal>
      <h3 className="text-title font-medium">Included with every package</h3>
      <ul className="mt-5 grid gap-x-8 gap-y-3 text-fg-muted sm:grid-cols-2">
        {packageGuarantees.map((g) => (
          <li key={g} className="flex gap-3">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-success" strokeWidth={2} />
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Accessible comparison table; scrolls horizontally inside its own region on narrow screens. */
export function PackageComparison() {
  return (
    <div role="region" aria-labelledby="compare-caption" tabIndex={0} className="card overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption id="compare-caption" className="px-6 pt-6 text-left text-title font-medium">
          Compare packages
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-6 py-4 text-small font-medium text-fg-subtle">
              Deliverable
            </th>
            {designPackages.map((p) => (
              <th key={p.id} scope="col" className="px-4 py-4 text-center font-medium">
                {p.name}
                <span className="mt-1 block text-[1.375rem] font-medium tabular">{formatPrice(p.price)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row} className="border-b border-line transition-colors last:border-b-0 hover:bg-bg-elevated">
              <th scope="row" className="px-6 py-3.5 font-normal text-fg-muted">
                {row === "Final formats" ? `Final formats (${finalFormats.join(", ")})` : row}
              </th>
              {designPackages.map((p) => {
                const included = p.included.includes(row) || p.free.includes(row);
                return (
                  <td key={p.id} className="px-4 py-3.5 text-center">
                    {included ? (
                      <Check aria-label="Included" role="img" className="mx-auto size-5 text-success" strokeWidth={2} />
                    ) : (
                      <Minus aria-label="Not included" role="img" className="mx-auto size-5 text-fg-subtle" strokeWidth={1.5} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
