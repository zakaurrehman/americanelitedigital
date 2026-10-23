"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";

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
  const panelId = useId();
  const onServicePage = pathname === "/services/" || services.some((s) => s.href === pathname);

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

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
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
            onClick={() => setServicesOpen((open) => !open)}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-sm px-3 font-medium transition-colors hover:text-accent ${
              onServicePage ? "text-accent" : ""
            }`}
          >
            Services
            <ChevronDown aria-hidden="true" className={`size-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} strokeWidth={1.75} />
          </button>
          <div
            id={panelId}
            hidden={!servicesOpen}
            className="absolute left-0 top-full z-50 mt-3 w-[min(46rem,calc(100vw-2rem))] rounded-md border border-line bg-[var(--aed-white)] p-2 shadow-pop"
          >
            <div className="grid grid-cols-[14rem_1fr] gap-2">
              <div className="flex flex-col justify-between rounded-sm bg-[var(--aed-paper)] p-5">
                <div>
                  <p className="eyebrow eyebrow-plain">Services</p>
                  <p className="mt-3 font-display text-[1.625rem] leading-tight">Brand · Build · Grow · Advise</p>
                </div>
                <Link
                  href="/services/"
                  onClick={() => setServicesOpen(false)}
                  aria-current={pathname === "/services/" ? "page" : undefined}
                  className="link-arrow mt-6 text-[0.9375rem]"
                >
                  All services
                  <ArrowRight aria-hidden="true" className="icon-arrow size-4" strokeWidth={1.75} />
                </Link>
              </div>
              <ul className="grid gap-px">
                {services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      onClick={() => setServicesOpen(false)}
                      aria-current={isActive(pathname, service.href) ? "page" : undefined}
                      className="group block rounded-sm px-4 py-3 transition-colors hover:bg-[var(--aed-paper)] aria-[current=page]:bg-[var(--aed-paper)]"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="tabular w-6 shrink-0 text-label font-semibold tracking-[0.14em] text-fg-subtle">{service.pillar}</span>
                        <span className="font-semibold group-hover:text-accent">{service.label}</span>
                      </span>
                      <span className="mt-0.5 block pl-9 text-small text-fg-muted">{service.summary}</span>
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
            className="inline-flex min-h-11 items-center rounded-sm px-3 font-medium transition-colors hover:text-accent aria-[current=page]:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-4">
        <a href={phone.href} className="hidden min-h-11 items-center gap-2 font-medium tabular xl:inline-flex">
          <Phone aria-hidden="true" className="size-4 text-ornament" strokeWidth={1.75} />
          {phone.display}
        </a>
        <Link href="/contact-us/" className="btn btn-primary btn-sm hidden sm:inline-flex">
          Start a project
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={openMenu}
          aria-haspopup="dialog"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line-strong px-3.5 font-semibold lg:hidden"
        >
          <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
          Menu
        </button>
      </div>

      {/* Mobile */}
      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none bg-[var(--aed-paper)] p-0 text-fg backdrop:bg-[rgb(11_26_51/0.4)]"
      >
        <div className="flex min-h-full flex-col">
          <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line">
            <span className="font-display text-[1.3125rem]">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line-strong px-3.5 font-semibold"
            >
              <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="container-site flex-1 py-6">
            <p className="eyebrow mb-3">Services</p>
            <ul className="border-b border-line pb-4">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    onClick={closeMenu}
                    aria-current={isActive(pathname, service.href) ? "page" : undefined}
                    className="flex min-h-12 items-center justify-between gap-4 py-2 text-[1.125rem] font-medium aria-[current=page]:text-accent"
                  >
                    {service.label}
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-ornament" strokeWidth={1.75} />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services/"
                  onClick={closeMenu}
                  aria-current={pathname === "/services/" ? "page" : undefined}
                  className="flex min-h-12 items-center py-2 font-semibold text-accent"
                >
                  All services
                </Link>
              </li>
            </ul>
            <ul className="mt-4">
              {[...links, { label: "Contact", href: "/contact-us/" }].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    className="flex min-h-12 items-center font-display text-[1.75rem] aria-[current=page]:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container-site shrink-0 border-t border-line py-6">
            <Link href="/contact-us/" onClick={closeMenu} className="btn btn-primary w-full">
              Start a project
            </Link>
            <div className="mt-5 flex flex-col gap-1 text-fg-muted">
              <a href={phone.href} className="inline-flex min-h-11 items-center gap-2 tabular">
                <Phone aria-hidden="true" className="size-4 text-ornament" strokeWidth={1.75} />
                {phone.display}
              </a>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-2 break-all">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-ornament" strokeWidth={1.75} />
                {email}
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
