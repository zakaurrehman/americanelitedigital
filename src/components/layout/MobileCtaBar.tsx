import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { site } from "@/content/site";

/**
 * Phones only: call and consultation always one tap away. Hidden from md up (the header button is
 * visible there) and while any form field has focus, so it never covers the on-screen keyboard.
 */
export function MobileCtaBar() {
  return (
    <aside aria-label="Quick contact" className="mobile-cta no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden">
      <div className="container-site grid grid-cols-[auto_1fr] gap-3 py-3">
        <a href={site.phone.href} className="btn btn-secondary btn-sm min-h-12 px-4">
          <Phone aria-hidden="true" className="size-4" strokeWidth={2} />
          Call
        </a>
        <Link href="/contact-us/" className="btn btn-primary btn-sm min-h-12">
          <MessageCircle aria-hidden="true" className="size-4" strokeWidth={2} />
          Free consultation
        </Link>
      </div>
    </aside>
  );
}
