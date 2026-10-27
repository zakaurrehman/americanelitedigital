import { expect, test } from "@playwright/test";
import { ALL_PAGES, SERVICE_ROUTES } from "./support/routes";

// Client review (2026-10-27): clearer offerings, stronger calls to action, no repeated numbering.

test("no page repeats a list number — numbers are kept for real sequences only", async ({ page }) => {
  for (const path of ALL_PAGES) {
    await page.goto(path);
    const numbers = await page.locator(".index-num").allTextContents();
    const seen = numbers.map((n) => n.trim()).filter(Boolean);
    expect(new Set(seen).size, `${path}: ${seen.join(", ")}`).toBe(seen.length);
  }
});

test("the services page compares every service, each with a consultation call to action", async ({ page }) => {
  await page.goto("/services/");
  const compare = page.locator("#compare");
  await expect(compare.getByRole("heading", { level: 2 })).toHaveText("Choose the service you need.");
  await expect(compare.getByRole("heading", { level: 3 })).toHaveCount(SERVICE_ROUTES.length);
  for (const route of SERVICE_ROUTES) {
    await expect(compare.locator(`a[href="${route}#inquiry"]`)).toHaveCount(1);
    await expect(compare.locator(`a[href="${route}"]`)).toHaveCount(1);
  }
  await expect(compare.getByText("$")).toHaveCount(0); // no prices until the owner confirms them
});

test.describe("mobile call-to-action bar", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("offers call and consultation, and steps aside for the keyboard", async ({ page }) => {
    await page.goto("/");
    const bar = page.getByRole("complementary", { name: "Quick contact" });
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link", { name: "Call" })).toHaveAttribute("href", /^tel:/);
    await expect(bar.getByRole("link", { name: "Free consultation" })).toHaveAttribute("href", "/contact-us/");

    // The footer's last line stays reachable above the bar.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const barTop = (await bar.boundingBox())!.y;
    const lastLine = await page.getByText(/All rights reserved/).boundingBox();
    expect(lastLine!.y + lastLine!.height).toBeLessThanOrEqual(barTop);

    await page.goto("/contact-us/");
    await page.locator("#inquiry form").getByLabel("Name").first().focus();
    await expect(bar).toBeHidden();
  });

  test("is not shown on larger screens", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("complementary", { name: "Quick contact" })).toBeHidden();
  });
});
