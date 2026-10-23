import "server-only";
import { createHmac } from "node:crypto";
import nodemailer from "nodemailer";
import type { Inquiry } from "./validate";

// Delivery channels are configured with environment variables (see .env.example):
//   SMTP_*            → email to CONTACT_TO_EMAIL (e.g. the Hostinger mailbox)
//   CONTACT_WEBHOOK_* → JSON POST to a CRM / automation endpoint
// An inquiry counts as delivered when at least one configured channel accepts it.

export type InquiryContext = {
  serviceLabel: string;
  packageLabel: string;
  pageUrl: string;
  submittedAt: string;
  /** Submitted implausibly fast after the form loaded — delivered, but marked for review. */
  flagged?: boolean;
};

export type DeliveryOutcome = { delivered: string[]; failed: string[] };

export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super("No inquiry delivery channel is configured (set SMTP_* or CONTACT_WEBHOOK_URL).");
    this.name = "DeliveryNotConfiguredError";
  }
}

type SmtpConfig = { host: string; port: number; secure: boolean; user?: string; pass?: string; to: string; from: string };
type WebhookConfig = { url: string; secret?: string };

export function readDeliveryConfig(env: NodeJS.ProcessEnv = process.env): { smtp?: SmtpConfig; webhook?: WebhookConfig } {
  const config: { smtp?: SmtpConfig; webhook?: WebhookConfig } = {};
  if (env.SMTP_HOST && env.CONTACT_TO_EMAIL) {
    const port = Number(env.SMTP_PORT ?? 465);
    config.smtp = {
      host: env.SMTP_HOST,
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      to: env.CONTACT_TO_EMAIL,
      from: env.CONTACT_FROM_EMAIL ?? env.SMTP_USER ?? env.CONTACT_TO_EMAIL,
    };
  }
  if (env.CONTACT_WEBHOOK_URL) config.webhook = { url: env.CONTACT_WEBHOOK_URL, secret: env.CONTACT_WEBHOOK_SECRET };
  return config;
}

export function isDeliveryConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  const config = readDeliveryConfig(env);
  return Boolean(config.smtp || config.webhook);
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function composeEmail(inquiry: Inquiry, ctx: InquiryContext) {
  const rows: [string, string][] = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Service", ctx.serviceLabel || "Not specified"],
    ...(ctx.packageLabel ? ([["Package", ctx.packageLabel]] as [string, string][]) : []),
    ["Page", ctx.pageUrl],
    ["Submitted", ctx.submittedAt],
  ];
  const message = inquiry.message || "(No message)";
  const subject = `${ctx.flagged ? "[Review: possible spam] " : ""}New inquiry from ${inquiry.name}${ctx.serviceLabel ? ` — ${ctx.serviceLabel}` : ""}`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${message}\n`;
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><th align="left" style="color:#566173">${k}</th><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</p>`;
  return { subject, text, html };
}

async function sendEmail(config: SmtpConfig, inquiry: Inquiry, ctx: InquiryContext) {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  const { subject, text, html } = composeEmail(inquiry, ctx);
  await transport.sendMail({ from: config.from, to: config.to, replyTo: { name: inquiry.name, address: inquiry.email }, subject, text, html });
}

async function sendWebhook(config: WebhookConfig, inquiry: Inquiry, ctx: InquiryContext) {
  const body = JSON.stringify({
    type: "inquiry",
    ...inquiry,
    service: ctx.serviceLabel || inquiry.service,
    package: ctx.packageLabel,
    page: ctx.pageUrl,
    submittedAt: ctx.submittedAt,
    flagged: Boolean(ctx.flagged),
  });
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (config.secret) headers["x-aed-signature"] = `sha256=${createHmac("sha256", config.secret).update(body).digest("hex")}`;
  const res = await fetch(config.url, { method: "POST", headers, body, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

export async function deliverInquiry(inquiry: Inquiry, ctx: InquiryContext, env: NodeJS.ProcessEnv = process.env): Promise<DeliveryOutcome> {
  const config = readDeliveryConfig(env);
  const jobs: [string, () => Promise<void>][] = [];
  if (config.smtp) jobs.push(["email", () => sendEmail(config.smtp!, inquiry, ctx)]);
  if (config.webhook) jobs.push(["webhook", () => sendWebhook(config.webhook!, inquiry, ctx)]);

  if (!jobs.length) {
    if (env.NODE_ENV === "production") throw new DeliveryNotConfiguredError();
    // Development only: no credentials, so record that a submission happened without logging personal data.
    console.info(`[inquiry] development submission received (service: ${ctx.serviceLabel || "none"}); configure SMTP_* or CONTACT_WEBHOOK_URL to deliver.`);
    return { delivered: ["development-log"], failed: [] };
  }

  const results = await Promise.allSettled(jobs.map(([, run]) => run()));
  const outcome: DeliveryOutcome = { delivered: [], failed: [] };
  results.forEach((r, i) => {
    const channel = jobs[i]![0];
    if (r.status === "fulfilled") outcome.delivered.push(channel);
    else {
      outcome.failed.push(channel);
      console.error(`[inquiry] ${channel} delivery failed: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`);
    }
  });
  return outcome;
}
