import { createHmac } from "node:crypto";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

// Inquiries go to the local webhook sink started by playwright.config.ts — never a real inbox.
const SINK = `http://127.0.0.1:${process.env.E2E_HOOK_PORT ?? 4399}`;

type Received = { payload: Record<string, unknown>; signature: string | null };

async function received(request: APIRequestContext, email: string): Promise<Received[]> {
  const all = (await (await request.get(`${SINK}/requests`)).json()) as Received[];
  return all.filter((r) => r.payload.email === email);
}

/** Each test uses its own client IP so the per-IP rate limit never couples tests together. */
async function useClientIp(page: Page, ip: string) {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": ip });
}

async function fill(page: Page, values: { name?: string; email?: string; phone?: string; message?: string }) {
  const form = page.locator("#inquiry form");
  if (values.name !== undefined) await form.getByLabel("Name").fill(values.name);
  if (values.email !== undefined) await form.getByLabel("Email").fill(values.email);
  if (values.phone !== undefined) await form.getByLabel("Phone").fill(values.phone);
  if (values.message !== undefined) await form.getByLabel("Tell us about your project").fill(values.message);
  // The server ignores submissions completed faster than a person could type.
  await page.waitForTimeout(2700);
}

test.describe("inquiry form", () => {
  test("shows an error summary and inline errors for missing fields", async ({ page }) => {
    await useClientIp(page, "10.0.0.1");
    await page.goto("/contact-us/");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    const summary = page.getByRole("alert").filter({ hasText: "There are problems with 3 fields" });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    const name = page.locator("#inquiry form").getByLabel("Name");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Enter your name.").last()).toBeVisible();

    // Summary links jump to the field.
    await summary.getByRole("link", { name: "Enter your email address." }).click();
    await expect(page.locator("#inquiry form").getByLabel("Email")).toBeInViewport();

    // Errors clear as fields are corrected.
    await name.fill("Jordan Lee");
    await name.blur();
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
  });

  test("validates email format before sending", async ({ page }) => {
    await useClientIp(page, "10.0.0.2");
    await page.goto("/contact-us/");
    await fill(page, { name: "Jordan Lee", email: "jordan@", phone: "310 555 0100" });
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("Enter an email address in the format name@example.com.").first()).toBeVisible();
  });

  test("delivers a valid inquiry and confirms it", async ({ page, request }) => {
    const email = `success-${Date.now()}@example.com`;
    await useClientIp(page, "10.0.0.3");
    await page.goto("/web-development-consulting-services/");
    // Service pages pre-select their own service.
    await expect(page.locator("#inquiry form").getByLabel("What do you need help with?")).toHaveValue("web-development-consulting-services");
    await fill(page, { name: "Jordan Lee", email, phone: "(310) 555-0100", message: "We need a new website by spring." });
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByRole("heading", { name: "Thank you, Jordan." })).toBeFocused();
    const [hit] = await received(request, email);
    expect(hit?.payload).toMatchObject({
      name: "Jordan Lee",
      phone: "(310) 555-0100",
      service: "Website design & development",
      message: "We need a new website by spring.",
      page: "/web-development-consulting-services/",
      flagged: false,
    });
    const expected = `sha256=${createHmac("sha256", "e2e-secret").update(JSON.stringify(hit!.payload)).digest("hex")}`;
    expect(hit?.signature).toBe(expected);
  });

  test("pre-selects a service from the URL", async ({ page }) => {
    await page.goto("/contact-us/?service=digital-strategy-consulting-services");
    await expect(page.locator("#inquiry form").getByLabel("What do you need help with?")).toHaveValue("digital-strategy-consulting-services");
  });

  test("tells the visitor how else to reach us when delivery fails", async ({ page }) => {
    await useClientIp(page, "10.0.0.4");
    await page.goto("/contact-us/");
    await fill(page, { name: "FAIL-WEBHOOK Test", email: `fail-${Date.now()}@example.com`, phone: "310 555 0100" });
    await page.getByRole("button", { name: "Send inquiry" }).click();
    const alert = page.getByRole("alert").filter({ hasText: "couldn't send your message" });
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("(310) 766-6600");
    // The form keeps the visitor's input so they can retry.
    await expect(page.locator("#inquiry form").getByLabel("Name")).toHaveValue("FAIL-WEBHOOK Test");
  });

  test("silently drops honeypot submissions", async ({ request }) => {
    const email = `honeypot-${Date.now()}@example.com`;
    const response = await request.post("/api/contact/", {
      data: { name: "Bot", phone: "310 555 0100", email, website: "http://spam.example" },
      headers: { "x-forwarded-for": "10.0.0.5" },
    });
    expect(response.status()).toBe(200);
    expect(await received(request, email)).toHaveLength(0);
  });

  test("delivers implausibly fast submissions but flags them for review", async ({ request }) => {
    const email = `fast-${Date.now()}@example.com`;
    const response = await request.post("/api/contact/", {
      data: { name: "Quick Filler", phone: "310 555 0100", email, startedAt: String(Date.now()) },
      headers: { "x-forwarded-for": "10.0.0.11" },
    });
    expect(response.status()).toBe(200);
    const [hit] = await received(request, email);
    expect(hit?.payload.flagged).toBe(true);
  });

  test("validates on the server too", async ({ request }) => {
    const response = await request.post("/api/contact/", { data: { name: "J", email: "bad", phone: "1" }, headers: { "x-forwarded-for": "10.0.0.6" } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(Object.keys(body.errors).sort()).toEqual(["email", "name", "phone"]);
  });

  test("rejects cross-site submissions", async ({ request }) => {
    const response = await request.post("/api/contact/", {
      data: { name: "Jordan", email: "j@example.com", phone: "310 555 0100" },
      headers: { origin: "https://evil.example", "x-forwarded-for": "10.0.0.7" },
    });
    expect(response.status()).toBe(400);
  });

  test("rate-limits repeated submissions from one client", async ({ request }) => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const r = await request.post("/api/contact/", { data: { name: "J", email: "bad", phone: "1" }, headers: { "x-forwarded-for": "10.0.0.8" } });
      statuses.push(r.status());
    }
    expect(statuses.slice(0, 5)).toEqual([400, 400, 400, 400, 400]);
    expect(statuses[5]).toBe(429);
  });

  test("works without JavaScript: form POST redirects to the thank-you page", async ({ request }) => {
    const email = `nojs-${Date.now()}@example.com`;
    const response = await request.post("/api/contact/", {
      form: { name: "Casey Morgan", email, phone: "310 555 0100", service: "", message: "No JS here" },
      headers: { "x-forwarded-for": "10.0.0.9" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers()["location"]).toMatch(/\/contact-us\/thank-you\/$/);
    expect(await received(request, email)).toHaveLength(1);
  });

  test("without JavaScript, invalid input gets a readable error page", async ({ request }) => {
    const response = await request.post("/api/contact/", { form: { name: "", email: "", phone: "" }, headers: { "x-forwarded-for": "10.0.0.10" } });
    expect(response.status()).toBe(400);
    expect(await response.text()).toContain("Enter your name.");
  });
});
