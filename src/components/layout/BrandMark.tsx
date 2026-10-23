import Image from "next/image";
import Link from "next/link";
import crest from "../../../public/brand/crest.png";

/** Crest seal (the lion and laurel from the original logo) beside a typographic wordmark. */
export function BrandMark() {
  // The visible wordmark is the link's accessible name ("American Elite Digital, home"),
  // so speech-input users can say what they see (WCAG 2.5.3).
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-3 no-underline">
      <span className="relative block size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/70 ring-offset-2 ring-offset-bg">
        <Image src={crest} alt="" width={44} height={44} sizes="44px" className="size-full object-cover" loading="eager" fetchPriority="low" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.3125rem] tracking-[-0.005em] text-fg">American Elite</span>{" "}
        <span className="mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.34em] text-ornament">Digital</span>
        <span className="sr-only">, home</span>
      </span>
    </Link>
  );
}
