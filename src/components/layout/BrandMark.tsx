import Image from "next/image";
import Link from "next/link";
import lockup from "../../../public/brand/lockup-horizontal.png";
import lockupOnDark from "../../../public/brand/lockup-horizontal-on-dark.png";

/**
 * The official logo (lion, laurel and ribbon beside the "AMERICAN ELITE / DIGITAL" wordmark),
 * rebuilt as a horizontal lockup from the owner's artwork. `tone="dark"` uses the version with a
 * white wordmark for navy backgrounds.
 */
export function BrandMark({ tone = "light", eager = false }: { tone?: "light" | "dark"; eager?: boolean }) {
  // The image's alt text matches the visible wordmark, so the link's accessible name
  // ("American Elite Digital, home") is what speech-input users see (WCAG 2.5.3).
  return (
    <Link href="/" className="group inline-flex min-h-11 shrink-0 items-center no-underline">
      <Image
        src={tone === "dark" ? lockupOnDark : lockup}
        alt="American Elite Digital"
        sizes="(min-width: 640px) 220px, 180px"
        loading={eager ? "eager" : "lazy"}
        className="h-[38px] w-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] sm:h-[46px]"
      />
      <span className="sr-only">, home</span>
    </Link>
  );
}
