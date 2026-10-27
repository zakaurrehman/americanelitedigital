import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Checks the features that are switched off in production (logo packages, portfolio slots).
// Run with `npm run test:preview`, which builds with SHOW_PACKAGES / PREVIEW_PLACEHOLDER_WORK.
test.skip(process.env.E2E_PREVIEW !== "true", "preview-only features; run npm run test:preview");

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

test("pricing page shows the three packages exactly as on the old site", async ({ page }) => {
  await page.goto("/pricing/");
  for (const [name, price] of [
    ["Logo Design", "$116"],
    ["Logo & Identity", "$134"],
    ["Identity & Social Media Kit", "$116"],
  ] as const) {
    const card = page.locator("li").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(card).toContainText(price);
  }
  await expect(page.getByText("Best choice")).toBeVisible();
  await expect(page.getByRole("table")).toContainText("Final formats (AI, EPS, PSD, PDF, JPG, PNG)");
  expect((await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations).toEqual([]);
});

test("ordering a package pre-fills the inquiry form", async ({ page }) => {
  await page.goto("/pricing/");
  await page.getByRole("link", { name: "Order Logo & Identity" }).click();
  await expect(page).toHaveURL(/\/contact-us\/\?service=branding-and-design-consulting-services&package=logo-and-identity/);
  const form = page.locator("#inquiry form");
  await expect(form.getByLabel("Design package")).toHaveValue("logo-and-identity");
  await expect(form.getByLabel("What do you need help with?")).toHaveValue("branding-and-design-consulting-services");
});

test("portfolio placeholders are clearly labelled and not indexable", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.getByText("Preview placeholder")).toHaveCount(3);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect((await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations).toEqual([]);
});

test("homepage shows packages, work and testimonial sections, and the nav links to packages and work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Start with a logo." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent projects" })).toBeVisible();
  const quotes = page.locator("section[aria-labelledby=testimonials-title]");
  await expect(quotes.getByRole("heading", { name: "What our clients say" })).toBeVisible();
  await expect(quotes.getByText("Preview placeholder")).toHaveCount(3);
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "Pricing" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Work" })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations).toEqual([]);
});
