"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Mail, Phone, X } from "lucide-react";

type NavItem = { label: string; href: string };
export type ServiceNavItem = NavItem & { summary: string; pillar: string };

type Props = {
  services: ServiceNavItem[];
  links: NavItem[];
  phone: { display: string; href: string };
  email: string;
};

const isActive = (pathname: string, href: string) => pathname === href;

export function HeaderNav({ services, links, phone, email }: Props) {
  const pathname = usePathname() ?? "/";
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();
  const onServicePage = pathname === "/services/" || services.some((s) => s.href === pathname);

  // "Lamp" indicator: slides under the hovered item and rests on the current section.
  // Adapted from 21st.dev "Tubelight Navbar" (MIT) without Framer Motion — positions are
  // written straight to CSS variables, so moving it never re-renders React.
  const moveLamp = useCallback((el: HTMLElement | null) => {
    const lamp = lampRef.current;
    const pill = pillRef.current;
    if (!lamp || !pill) return;
    if (!el) {
      lamp.style.opacity = "0";
      return;
    }
    const a = el.getBoundingClientRect();
    const b = pill.getBoundingClientRect();
    lamp.style.setProperty("--lamp-x", `${a.left - b.left}px`);
    lamp.style.setProperty("--lamp-w", `${a.width}px`);
    lamp.style.opacity = "1";
  }, []);
  const restLamp = useCallback(() => {
    moveLamp(pillRef.current?.querySelector<HTMLElement>("[data-nav-active='true']") ?? null);
  }, [moveLamp]);

  // Positioned after paint (not in a layout effect) so measuring never blocks hydration.
  useEffect(() => {
    const frame = requestAnimationFrame(restLamp);
    return () => cancelAnimationFrame(frame);
  }, [pathname, restLamp]);

  useEffect(() => {
    window.addEventListener("resize", restLamp);
    document.fonts?.ready.then(restLamp).catch(() => {});
    return () => window.removeEventListener("resize", restLamp);
  }, [restLamp]);

  // Desktop services panel: close on outside pointer or Escape (returning focus to the trigger).
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  // Mobile dialog: lock page scroll while open and restore focus to the menu button on close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      menuButtonRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const openMenu = () => {
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.showModal();
  };
  const closeMenu = () => dialogRef.current?.close();

  const itemClass =
    "relative z-10 inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[0.9375rem] font-semibold text-fg-muted transition-colors duration-200 hover:text-brand aria-[current=page]:text-brand";

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Main" className="hidden lg:block">
        <div
          ref={pillRef}
          onMouseLeave={restLamp}
          onBlur={(event) => {
            if (!pillRef.current?.contains(event.relatedTarget as Node | null)) restLamp();
          }}
          className="relative flex items-center rounded-full border border-line bg-bg-raised/80 p-1"
        >
          <span
            ref={lampRef}
            aria-hidden="true"
            style={{ transform: "translateX(var(--lamp-x, 0px))", width: "var(--lamp-w, 0px)" }}
            className="pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-white opacity-0 shadow-[0_2px_10px_-2px_rgb(4_28_116/0.18)] transition-[transform,width,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="absolute -bottom-[5px] left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent via-[var(--gold-500)] to-[var(--gold-300)]" />
          </span>

          <div
            ref={servicesRef}
            className="relative"
            onBlur={(event) => {
              if (!servicesRef.current?.contains(event.relatedTarget as Node | null)) setServicesOpen(false);
            }}
          >
            <button
              ref={servicesButtonRef}
              type="button"
              aria-expanded={servicesOpen}
              aria-controls={panelId}
              data-nav-active={onServicePage}
              onClick={() => setServicesOpen((open) => !open)}
              onMouseEnter={(e) => moveLamp(e.currentTarget)}
              onFocus={(e) => moveLamp(e.currentTarget)}
              className={`${itemClass} ${onServicePage ? "text-brand" : ""}`}
            >
              Services
              <ChevronDown aria-hidden="true" className={`size-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} strokeWidth={1.75} />
            </button>
            <div
              id={panelId}
              data-spotlight
              className={`absolute left-1/2 top-full z-50 mt-4 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[var(--radius-lg)] border border-line bg-white p-2 shadow-pop transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <div className="grid grid-cols-[15rem_1fr] gap-2">
                <div className="surface-navy relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-md)] p-6">
                  <div aria-hidden="true" className="bg-stars absolute inset-0" />
                  <div className="relative">
                    <p className="eyebrow">Services</p>
                    <p className="mt-4 text-[1.75rem] font-medium leading-[1.05] tracking-[-0.04em]">
                      Brand. Build. <span className="em-accent">Grow.</span> Advise.
                    </p>
                  </div>
                  <Link
                    href="/services/"
                    onClick={() => setServicesOpen(false)}
                    aria-current={pathname === "/services/" ? "page" : undefined}
                    className="link-arrow relative mt-8 text-[0.9375rem]"
                  >
                    All services
                    <ArrowUpRight aria-hidden="true" className="icon-arrow size-4" strokeWidth={1.75} />
                  </Link>
                </div>
                <ul className="grid gap-1">
                  {services.map((service) => (
                    <li key={service.href}>
                      <Link
                        href={service.href}
                        onClick={() => setServicesOpen(false)}
                        aria-current={isActive(pathname, service.href) ? "page" : undefined}
                        className="spot group block rounded-[var(--radius-md)] px-4 py-3 transition-colors hover:bg-bg-hover aria-[current=page]:bg-bg-hover"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="index-num w-6 shrink-0 text-[1.05rem]">{service.pillar}</span>
                          <span className="font-semibold text-brand">{service.label}</span>
                        </span>
                        <span className="mt-0.5 block pl-9 text-small text-fg-subtle">{service.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              data-nav-active={isActive(pathname, link.href)}
              onMouseEnter={(e) => moveLamp(e.currentTarget)}
              onFocus={(e) => moveLamp(e.currentTarget)}
              className={itemClass}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/contact-us/" data-magnetic className="btn btn-primary btn-sm hidden sm:inline-flex">
          Start a project
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={openMenu}
          aria-haspopup="dialog"
          className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong px-4 text-[0.9375rem] font-semibold text-brand lg:hidden"
        >
          <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
            <span className="h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-0.5" />
            <span className="h-px w-2/3 bg-current transition-[width] duration-300 group-hover:w-full" />
          </span>
          Menu
        </button>
      </div>

      {/* Mobile */}
      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-[rgb(6_18_58/0.5)]"
      >
        <div className="relative flex min-h-full flex-col overflow-hidden">
          <div aria-hidden="true" className="aurora opacity-70" />
          <div className="container-site relative flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.9375rem] font-semibold text-brand"
            >
              <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="container-site relative flex-1 pb-6 pt-4">
            <ul>
              {[...links, { label: "Contact", href: "/contact-us/" }].map((link, i) => (
                <li key={link.href} className="menu-item" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    className="flex min-h-14 items-center border-b border-line text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-brand aria-[current=page]:text-accent-strong"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow menu-item mb-2 mt-9" style={{ "--i": 5 } as React.CSSProperties}>
              Services
            </p>
            <ul>
              {services.map((service, i) => (
                <li key={service.href} className="menu-item" style={{ "--i": 6 + i } as React.CSSProperties}>
                  <Link
                    href={service.href}
                    onClick={closeMenu}
                    aria-current={isActive(pathname, service.href) ? "page" : undefined}
                    className="flex min-h-12 items-center justify-between gap-4 py-1.5 text-[1.0625rem] text-fg-muted aria-[current=page]:text-fg"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="index-num w-5 text-[0.95rem]">{service.pillar}</span>
                      {service.label}
                    </span>
                    <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
                  </Link>
                </li>
              ))}
              <li className="menu-item" style={{ "--i": 11 } as React.CSSProperties}>
                <Link
                  href="/services/"
                  onClick={closeMenu}
                  aria-current={pathname === "/services/" ? "page" : undefined}
                  className="flex min-h-12 items-center font-medium text-accent-strong"
                >
                  All services
                </Link>
              </li>
            </ul>
          </nav>
          <div className="container-site relative shrink-0 border-t border-line py-6">
            <Link href="/contact-us/" onClick={closeMenu} className="btn btn-primary w-full">
              Start a project
            </Link>
            <div className="mt-4 flex flex-col gap-1 text-fg-muted">
              <a href={phone.href} className="inline-flex min-h-11 items-center gap-2 tabular">
                <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={1.75} />
                {phone.display}
              </a>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-2 break-all">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
                {email}
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
