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
    <ul className="grid gap-6 lg:grid-cols-3">
      {designPackages.map((pkg) => (
        <li
          key={pkg.id}
          id={pkg.id}
          className={`relative flex flex-col rounded-md border p-7 sm:p-8 ${
            pkg.featured ? "border-[var(--aed-navy)] bg-[var(--aed-white)] shadow-pop" : "border-line bg-bg-raised"
          }`}
        >
          {pkg.featured && (
            <p className="absolute -top-3 left-7 rounded-xs bg-[var(--aed-navy)] px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--aed-paper)]">
              Best choice
            </p>
          )}
          <Heading className="text-title font-semibold">{pkg.name}</Heading>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-display-m tabular">{formatPrice(pkg.price)}</span>
            <span className="text-small text-fg-subtle">one-time</span>
          </p>
          <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
            {pkg.included.map((item) => (
              <li key={item} className="flex gap-3">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-ornament" strokeWidth={2} />
                {item}
              </li>
            ))}
            {pkg.free.map((item) => (
              <li key={item} className="flex gap-3">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-ornament" strokeWidth={2} />
                <span>
                  {item === "Final formats" ? `Final formats (${finalFormats.join(", ")})` : item}{" "}
                  <span className="ml-1 rounded-xs bg-[var(--aed-paper-2)] px-1.5 py-0.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[var(--aed-ink-2)]">
                    Free
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Link href={orderHref(pkg)} className={`btn w-full ${pkg.featured ? "btn-primary" : "btn-secondary"}`}>
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
    <div className="rounded-md border border-line p-6 sm:p-8">
      <h3 className="text-title font-semibold">Included with every package</h3>
      <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {packageGuarantees.map((g) => (
          <li key={g} className="flex gap-3">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-ornament" strokeWidth={2} />
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
    <div role="region" aria-labelledby="compare-caption" tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-bg-raised">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption id="compare-caption" className="px-6 pt-6 text-left text-title font-semibold">
          Compare packages
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-6 py-4 text-small font-semibold text-fg-subtle">
              Deliverable
            </th>
            {designPackages.map((p) => (
              <th key={p.id} scope="col" className="px-4 py-4 text-center font-semibold">
                {p.name}
                <span className="block font-display text-[1.5rem] font-normal tabular">{formatPrice(p.price)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-6 py-3 font-normal">
                {row === "Final formats" ? `Final formats (${finalFormats.join(", ")})` : row}
              </th>
              {designPackages.map((p) => {
                const included = p.included.includes(row) || p.free.includes(row);
                return (
                  <td key={p.id} className="px-4 py-3 text-center">
                    {included ? (
                      <Check aria-label="Included" role="img" className="mx-auto size-5 text-[var(--aed-success)]" strokeWidth={2} />
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
