"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveal-once for elements marked `.motion-reveal`. Content is visible by default (server HTML,
 * no JavaScript, reduced motion). Only after this runs are elements *below* the viewport hidden,
 * and each is revealed once as it scrolls in — it never hides again.
 */
export function RevealOnScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const elements = [...document.querySelectorAll<HTMLElement>(".motion-reveal:not(.is-revealed)")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of elements) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      else {
        el.classList.add("is-pending");
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
