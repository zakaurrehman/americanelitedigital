import { NextResponse, type NextRequest } from "next/server";
import { getPackage, designPackages, packagesEnabled } from "@/content/packages";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { DeliveryNotConfiguredError, deliverInquiry } from "@/lib/inquiry/deliver";
import { createRateLimiter } from "@/lib/inquiry/rate-limit";
import { NOT_SURE, validateInquiry } from "@/lib/inquiry/validate";

// Handles the inquiry form. JavaScript clients post JSON and get JSON back; the no-JavaScript
// fallback posts application/x-www-form-urlencoded and is redirected (success) or shown a
// minimal HTML page (failure).

const MAX_BODY_BYTES = 16 * 1024;
/**
 * Submissions faster than this after the form rendered are probably automated. They are still
 * delivered (autofill can be quick, and a lost lead costs more than a spam email) but flagged.
 */
const MIN_FILL_MS = 2000;
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

type Outcome =
  | { kind: "ok" }
  | { kind: "invalid"; errors: Record<string, string> }
  | { kind: "rate-limited"; retryAfter: number }
  | { kind: "unavailable" }
  | { kind: "bad-request"; message: string };

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // Some privacy tools strip Origin; other checks still apply.
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

async function readFields(req: NextRequest, isJson: boolean): Promise<Record<string, unknown>> {
  if (isJson) return (await req.json()) as Record<string, unknown>;
  const form = await req.formData();
  return Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]));
}

async function handle(req: NextRequest, fields: Record<string, unknown>): Promise<Outcome> {
  // Honeypot: real visitors never see this field. Pretend success so bots learn nothing.
  if (typeof fields.website === "string" && fields.website.trim() !== "") return { kind: "ok" };

  const startedAt = Number(fields.startedAt);
  const flagged = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS;

  const rate = limiter.hit(clientIp(req));
  if (!rate.allowed) return { kind: "rate-limited", retryAfter: rate.retryAfter };

  const packageIds = packagesEnabled() ? designPackages.map((p) => p.id) : [];
  const result = validateInquiry(fields, { serviceSlugs: services.map((s) => s.slug), packageIds });
  if (!result.ok) return { kind: "invalid", errors: result.errors };

  const inquiry = result.data;
  const service = services.find((s) => s.slug === inquiry.service);
  const pageUrl = typeof fields.page === "string" && fields.page.startsWith("/") ? fields.page.slice(0, 200) : "/contact-us/";
  try {
    const outcome = await deliverInquiry(inquiry, {
      serviceLabel: service ? service.name : inquiry.service === NOT_SURE ? "Not sure yet" : "",
      packageLabel: inquiry.package ? (getPackage(inquiry.package)?.name ?? "") : "",
      pageUrl,
      submittedAt: new Date().toISOString(),
      flagged,
    });
    return outcome.delivered.length ? { kind: "ok" } : { kind: "unavailable" };
  } catch (error) {
    if (error instanceof DeliveryNotConfiguredError) console.error(`[inquiry] ${error.message}`);
    else console.error("[inquiry] unexpected delivery error", error instanceof Error ? error.message : error);
    return { kind: "unavailable" };
  }
}

const UNAVAILABLE_MESSAGE = `We couldn't send your message just now. Please call ${site.phone.display} or email ${site.email}.`;

function jsonResponse(outcome: Outcome) {
  switch (outcome.kind) {
    case "ok":
      return NextResponse.json({ ok: true });
    case "invalid":
      return NextResponse.json({ ok: false, errors: outcome.errors }, { status: 400 });
    case "rate-limited":
      return NextResponse.json(
        { ok: false, message: "Too many messages from this connection. Please wait a few minutes, or call us." },
        { status: 429, headers: { "retry-after": String(outcome.retryAfter) } },
      );
    case "unavailable":
      return NextResponse.json({ ok: false, message: UNAVAILABLE_MESSAGE }, { status: 503 });
    case "bad-request":
      return NextResponse.json({ ok: false, message: outcome.message }, { status: 400 });
  }
}

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

function htmlResponse(req: NextRequest, outcome: Outcome) {
  if (outcome.kind === "ok") return NextResponse.redirect(new URL("/contact-us/thank-you/", req.url), 303);
  const message =
    outcome.kind === "invalid"
      ? `Please check your details: ${Object.values(outcome.errors).join(" ")}`
      : outcome.kind === "rate-limited"
        ? "Too many messages from this connection. Please wait a few minutes, or call us."
        : outcome.kind === "unavailable"
          ? UNAVAILABLE_MESSAGE
          : outcome.message;
  const status = outcome.kind === "invalid" || outcome.kind === "bad-request" ? 400 : outcome.kind === "rate-limited" ? 429 : 503;
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Message not sent — ${site.name}</title><style>body{font:18px/1.6 system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;color:#0E1A2B;background:#F6F2EA}a{color:#A3192F}</style></head><body><h1>Your message wasn't sent</h1><p>${escapeHtml(message)}</p><p><a href="/contact-us/">Go back to the contact form</a></p></body></html>`;
  return new NextResponse(body, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function POST(req: NextRequest) {
  const isJsonRequest = (req.headers.get("content-type") ?? "").includes("application/json");
  const respond = (outcome: Outcome) => (isJsonRequest ? jsonResponse(outcome) : htmlResponse(req, outcome));

  if (!sameOrigin(req)) return respond({ kind: "bad-request", message: "Cross-site submissions are not accepted." });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return respond({ kind: "bad-request", message: "Your message is too large." });

  let fields: Record<string, unknown>;
  try {
    fields = await readFields(req, isJsonRequest);
  } catch {
    return respond({ kind: "bad-request", message: "We couldn't read the form submission." });
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return respond({ kind: "bad-request", message: "Invalid submission." });

  return respond(await handle(req, fields));
}

export function GET() {
  return NextResponse.json({ ok: false, message: "Method not allowed." }, { status: 405, headers: { allow: "POST" } });
}
