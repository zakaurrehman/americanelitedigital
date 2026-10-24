"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";
import { INQUIRY_LIMITS, NOT_SURE, validateInquiry, type InquiryErrors, type InquiryField } from "@/lib/inquiry/validate";

type Option = { value: string; label: string };

type Props = {
  services: Option[];
  /** Present only while packages are published. */
  packages: Option[];
  phone: { display: string; href: string };
  email: string;
  /** Heading level for the success message, matching where the form sits on the page. */
  successHeadingLevel?: "h2" | "h3";
  /** Pre-selected service (service pages). A ?service= URL parameter still takes precedence. */
  defaultService?: string;
};

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; name: string; email: string }
  | { state: "error"; message: string };

const FIELD_ORDER: InquiryField[] = ["name", "email", "phone", "service", "package", "message"];

export function InquiryForm({ services, packages, phone, email, successHeadingLevel = "h3", defaultService = "" }: Props) {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  // Kept in refs, not hidden inputs: React re-applies defaultValue on re-render, which would wipe them.
  const startedAtRef = useRef(0);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [messageLength, setMessageLength] = useState(0);

  const options = { serviceSlugs: services.map((s) => s.value), packageIds: packages.map((p) => p.value) };

  // Progressive enhancement: without JavaScript the browser's native validation and a plain POST
  // still work. With JavaScript we take over validation, pre-select from the URL and add timing.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    form.noValidate = true;
    startedAtRef.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    const service = form.elements.namedItem("service") as HTMLSelectElement | null;
    const pkg = form.elements.namedItem("package") as HTMLSelectElement | null;
    const requestedService = params.get("service");
    const requestedPackage = params.get("package");
    if (service && requestedService && [...service.options].some((o) => o.value === requestedService)) service.value = requestedService;
    if (pkg && requestedPackage && [...pkg.options].some((o) => o.value === requestedPackage)) pkg.value = requestedPackage;
  }, []);

  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
  }, [status.state]);

  const readForm = () => Object.fromEntries(new FormData(formRef.current!).entries());

  const revalidate = (field: InquiryField) => {
    if (!attempted) return;
    const result = validateInquiry(readForm(), options);
    setErrors((prev) => {
      const next = { ...prev };
      const message = result.ok ? undefined : result.errors[field];
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const showErrors = (next: InquiryErrors) => {
    setErrors(next);
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.state === "submitting") return;
    setAttempted(true);
    const fields = readForm();
    const result = validateInquiry(fields, options);
    if (!result.ok) return showErrors(result.errors);

    setErrors({});
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...fields, startedAt: String(startedAtRef.current), page: window.location.pathname }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: InquiryErrors; message?: string };
      if (res.ok && body.ok) {
        setStatus({ state: "success", name: result.data.name.split(" ")[0] ?? result.data.name, email: result.data.email });
        return;
      }
      if (res.status === 400 && body.errors) {
        setStatus({ state: "idle" });
        return showErrors(body.errors);
      }
      setStatus({ state: "error", message: body.message ?? `Something went wrong. Please call ${phone.display} or email ${email}.` });
    } catch {
      setStatus({ state: "error", message: `We couldn't reach the server. Check your connection, or call ${phone.display}.` });
    }
  }

  if (status.state === "success") {
    const Heading = successHeadingLevel;
    return (
      <div className="motion-rise relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-bg-raised p-7 sm:p-10" role="status">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(44_108_28/0.14),transparent_65%)]" />
        <svg aria-hidden="true" viewBox="0 0 48 48" className="draw-check relative size-12 text-success" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
          <path d="M15 24.5l6 6 12-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Heading ref={successRef} tabIndex={-1} className="relative mt-6 text-display-s outline-none">
          Thank you, {status.name}.
        </Heading>
        <p className="relative mt-3 text-fg-muted">
          We&rsquo;ve received your message and will reply to <strong className="text-fg">{status.email}</strong>. If it&rsquo;s urgent, call us
          on{" "}
          <a href={phone.href} className="link tabular">
            {phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const errorEntries = FIELD_ORDER.filter((f) => errors[f]).map((f) => [f, errors[f]!] as const);
  const describedBy = (field: InquiryField, hint?: string) => [errors[field] ? id(`${field}-error`) : null, hint].filter(Boolean).join(" ") || undefined;
  const fieldError = (field: InquiryField) =>
    errors[field] ? (
      <p id={id(`${field}-error`)} className="field-error">
        <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
        <span>
          <span className="sr-only">Error: </span>
          {errors[field]}
        </span>
      </p>
    ) : null;

  return (
    <form ref={formRef} action="/api/contact/" method="post" onSubmit={onSubmit} aria-describedby={id("required-note")} className="relative">
      {errorEntries.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="alert-box mb-7 rounded-[var(--radius-sm)] border border-danger bg-danger-bg p-5 text-fg outline-none">
          <p className="font-semibold">
            {errorEntries.length === 1 ? "There is a problem with 1 field:" : `There are problems with ${errorEntries.length} fields:`}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={`#${id(field)}`} className="link">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p id={id("required-note")} className="mb-5 text-small text-fg-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id("name")} className="field-label">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={INQUIRY_LIMITS.nameMax}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            onBlur={() => revalidate("name")}
            className="field-input"
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor={id("email")} className="field-label">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={INQUIRY_LIMITS.emailMax}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            onBlur={() => revalidate("email")}
            className="field-input"
          />
          {fieldError("email")}
        </div>

        <div>
          <label htmlFor={id("phone")} className="field-label">
            Phone <span aria-hidden="true">*</span>
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={INQUIRY_LIMITS.phoneMax}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
            onBlur={() => revalidate("phone")}
            className="field-input tabular"
          />
          {fieldError("phone")}
        </div>

        <div className={packages.length ? "" : "sm:col-span-2"}>
          <label htmlFor={id("service")} className="field-label">
            What do you need help with?
          </label>
          <select
            id={id("service")}
            name="service"
            defaultValue={defaultService}
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={describedBy("service")}
            onChange={() => revalidate("service")}
            className="field-input"
          >
            <option value="">Choose a service (optional)</option>
            {services.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
            <option value={NOT_SURE}>Not sure yet</option>
          </select>
          {fieldError("service")}
        </div>

        {packages.length > 0 && (
          <div>
            <label htmlFor={id("package")} className="field-label">
              Design package
            </label>
            <select
              id={id("package")}
              name="package"
              defaultValue=""
              aria-invalid={errors.package ? true : undefined}
              aria-describedby={describedBy("package")}
              onChange={() => revalidate("package")}
              className="field-input"
            >
              <option value="">No package (optional)</option>
              {packages.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {fieldError("package")}
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor={id("message")} className="field-label">
            Tell us about your project
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            maxLength={INQUIRY_LIMITS.messageMax}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", id("message-hint"))}
            onInput={(e) => setMessageLength(e.currentTarget.value.length)}
            onBlur={() => revalidate("message")}
            className="field-input"
          />
          <span id={id("message-hint")} className="field-hint flex justify-between gap-4">
            <span>Goals, timing and budget all help. Optional.</span>
            <span className="tabular shrink-0" aria-hidden="true">
              {messageLength.toLocaleString("en-US")} / {INQUIRY_LIMITS.messageMax.toLocaleString("en-US")}
            </span>
          </span>
          {fieldError("message")}
        </div>
      </div>

      {/* Anti-spam: hidden from people and assistive tech; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto size-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.state === "error" && (
        <div role="alert" className="alert-box mt-7 flex gap-3 rounded-[var(--radius-sm)] border border-danger bg-danger-bg p-5 text-fg">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={2} />
          <p>{status.message}</p>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" data-magnetic className="btn btn-primary" aria-disabled={status.state === "submitting"}>
          {status.state === "submitting" ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin" strokeWidth={2} />
              Sending…
            </>
          ) : (
            <>
              Send inquiry
              <ArrowRight aria-hidden="true" className="icon-arrow size-[1.125em]" strokeWidth={1.75} />
            </>
          )}
        </button>
        <p className="text-small text-fg-muted">
          We use your details only to reply. See our{" "}
          <Link href="/privacy-policy/" className="link">
            privacy policy
          </Link>
          .
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {status.state === "submitting" ? "Sending your message." : ""}
      </p>
    </form>
  );
}
