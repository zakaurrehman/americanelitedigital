import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { composeEmail, deliverInquiry, DeliveryNotConfiguredError, readDeliveryConfig } from "@/lib/inquiry/deliver";
import type { Inquiry } from "@/lib/inquiry/validate";

const inquiry: Inquiry = {
  name: "Jordan <b>Lee</b>",
  email: "jordan@example.com",
  phone: "310 555 0100",
  service: "web-development-consulting-services",
  package: "",
  message: "Hello <script>alert(1)</script>",
};
const ctx = { serviceLabel: "Website design & development", packageLabel: "", pageUrl: "/contact-us/", submittedAt: "2026-10-23T00:00:00.000Z" };

const env = (vars: Record<string, string>) => ({ ...vars }) as unknown as NodeJS.ProcessEnv;

afterEach(() => vi.unstubAllGlobals());

describe("composeEmail", () => {
  it("escapes user input in the HTML body and keeps plain text intact", () => {
    const mail = composeEmail(inquiry, ctx);
    expect(mail.subject).toBe("New inquiry from Jordan <b>Lee</b> — Website design & development");
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;");
    expect(mail.html).toContain("Jordan &lt;b&gt;Lee&lt;/b&gt;");
    expect(mail.text).toContain("Message:\nHello <script>alert(1)</script>");
  });

  it("marks suspiciously fast submissions for review instead of dropping them", () => {
    expect(composeEmail(inquiry, { ...ctx, flagged: true }).subject).toMatch(/^\[Review: possible spam\] New inquiry/);
  });
});

describe("readDeliveryConfig", () => {
  it("reads SMTP settings and derives TLS from the port", () => {
    const config = readDeliveryConfig(env({ SMTP_HOST: "smtp.example.com", SMTP_PORT: "587", CONTACT_TO_EMAIL: "info@example.com" }));
    expect(config.smtp).toMatchObject({ host: "smtp.example.com", port: 587, secure: false, to: "info@example.com" });
    expect(config.webhook).toBeUndefined();
  });

  it("needs both a host and a recipient for SMTP", () => {
    expect(readDeliveryConfig(env({ SMTP_HOST: "smtp.example.com" })).smtp).toBeUndefined();
  });
});

describe("deliverInquiry", () => {
  it("refuses to pretend success in production when nothing is configured", async () => {
    await expect(deliverInquiry(inquiry, ctx, env({ NODE_ENV: "production" }))).rejects.toBeInstanceOf(DeliveryNotConfiguredError);
  });

  it("logs (without personal data) instead of delivering in development", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const outcome = await deliverInquiry(inquiry, ctx, env({ NODE_ENV: "development" }));
    expect(outcome.delivered).toEqual(["development-log"]);
    expect(info.mock.calls.flat().join(" ")).not.toContain("jordan@example.com");
    info.mockRestore();
  });

  it("posts a signed JSON payload to the webhook", async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const outcome = await deliverInquiry(inquiry, ctx, env({ NODE_ENV: "production", CONTACT_WEBHOOK_URL: "https://hooks.example.com/x", CONTACT_WEBHOOK_SECRET: "s3cret" }));
    expect(outcome).toEqual({ delivered: ["webhook"], failed: [] });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://hooks.example.com/x");
    const body = init.body as string;
    expect(JSON.parse(body)).toMatchObject({ type: "inquiry", email: "jordan@example.com", service: "Website design & development" });
    const expected = `sha256=${createHmac("sha256", "s3cret").update(body).digest("hex")}`;
    expect((init.headers as Record<string, string>)["x-aed-signature"]).toBe(expected);
  });

  it("reports a failed channel instead of throwing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const outcome = await deliverInquiry(inquiry, ctx, env({ NODE_ENV: "production", CONTACT_WEBHOOK_URL: "https://hooks.example.com/x" }));
    expect(outcome).toEqual({ delivered: [], failed: ["webhook"] });
    error.mockRestore();
  });
});
