"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The site's whole motion runtime (about 1 KB gzipped). Markup opts in with data attributes, so server
 * components stay server components:
 *
 *   data-reveal[="fade"|"scale"|"mask"]  reveal-once as the element scrolls in (stagger via --i)
 *   data-spotlight                        container whose `.spot` children share a cursor light
 *   data-magnetic                         element drifts a few px toward the pointer
 *   data-tilt                             container exposes --tilt-x / --tilt-y (deg) and --tx / --ty (unitless)
 *   html.has-interacted                   set on first pointer/scroll/key/touch; starts ambient drift
 *
 * Content is visible without it: reveals only hide elements still below the fold when this
 * runs (and never hide them again), and every pointer effect is skipped for touch input and
 * reduced-motion users.
 */
export function MotionRuntime() {
  const pathname = usePathname();

  // Reveal-once, re-scanned on every route change. A scroll sweep (one rect pass per frame) is
  // used instead of IntersectionObserver because an observer never fires for elements a fast
  // jump carries straight past (anchor links, End key), and it treats a fully clipped
  // `data-reveal="mask"` element as invisible. Anything at or above the reveal line shows.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const line = () => window.innerHeight * 0.9;
    const pending = new Set<HTMLElement>();
    let frame = 0;

    // First pass runs in its own frame after hydration (not inside React's commit), and reads
    // every position before writing any class, so it costs one layout instead of one per element.
    const start = requestAnimationFrame(() => {
      const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")];
      const tops = els.map((el) => el.getBoundingClientRect().top);
      const limit = line();
      els.forEach((el, i) => {
        if (tops[i]! < limit) el.classList.add("is-revealed");
        else {
          el.classList.add("is-pending");
          pending.add(el);
        }
      });
      if (pending.size) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
      }
    });

    function stop() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
    function sweep() {
      frame = 0;
      const limit = line();
      const due = [...pending].filter((el) => el.getBoundingClientRect().top < limit);
      for (const el of due) {
        el.classList.add("is-revealed");
        pending.delete(el);
      }
      if (!pending.size) stop();
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(sweep);
    }
    return () => {
      stop();
      cancelAnimationFrame(start);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Ambient motion (the hero's drifting light) starts on the first sign of a present visitor.
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("has-interacted")) return;
    const events = ["pointermove", "scroll", "keydown", "touchstart"] as const;
    const mark = () => {
      root.classList.add("has-interacted");
      for (const type of events) window.removeEventListener(type, mark);
    };
    for (const type of events) window.addEventListener(type, mark, { passive: true });
    return () => {
      for (const type of events) window.removeEventListener(type, mark);
    };
  }, []);

  // Pointer-driven effects: one listener, at most one DOM write pass per frame.
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    let magnet: HTMLElement | null = null;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("--mag-x");
      el.style.removeProperty("--mag-y");
    };

    const update = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      // Spotlight: pointer position local to the group and to each `.spot` card in it, so the
      // light stays correct even while cards are transformed. All reads happen before writes.
      const group = target?.closest<HTMLElement>("[data-spotlight]");
      if (group) {
        const cards = [group, ...group.querySelectorAll<HTMLElement>(".spot")];
        const rects = cards.map((el) => el.getBoundingClientRect());
        cards.forEach((el, i) => {
          el.style.setProperty("--px", (e.clientX - rects[i]!.left).toFixed(0));
          el.style.setProperty("--py", (e.clientY - rects[i]!.top).toFixed(0));
        });
      }

      // Magnetic: drift toward the pointer, capped at 10px.
      const next = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (next !== magnet) {
        release(magnet);
        magnet = next;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) * 0.2));
        const dy = Math.max(-8, Math.min(8, (e.clientY - (r.top + r.height / 2)) * 0.25));
        magnet.style.setProperty("--mag-x", `${dx.toFixed(1)}px`);
        magnet.style.setProperty("--mag-y", `${dy.toFixed(1)}px`);
      }

      // Tilt: normalised pointer position within the area, in degrees.
      const tilt = target?.closest<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
        tilt.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
        // Unitless copies (-0.5…0.5) for layered parallax: calc(var(--tx) * 24px)
        tilt.style.setProperty("--tx", x.toFixed(3));
        tilt.style.setProperty("--ty", y.toFixed(3));
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      release(magnet);
      magnet = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      release(magnet);
    };
  }, []);

  return null;
}
