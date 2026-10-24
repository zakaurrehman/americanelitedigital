import { expect, test } from "@playwright/test";

// Guarantees of the motion system (src/components/motion/MotionRuntime.tsx, globals.css):
// content is never hidden behind an animation that might not run.

const revealHidden = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter((el) => {
        const s = getComputedStyle(el);
        return Number(s.opacity) < 1 || (s.clipPath !== "none" && !s.clipPath.startsWith("inset(0px"));
      }).length,
  );

test("without JavaScript every section is visible", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ["/", "/web-development-consulting-services/", "/about-us/", "/the-future-of-digital-marketing/"]) {
    await page.goto(path);
    await page.waitForTimeout(1300); // let the CSS-only entrances finish
    expect(await revealHidden(page), path).toBe(0);
    await expect(page.locator("h1")).toBeVisible();
  }
  await context.close();
});

test("a fast jump to the bottom and back leaves nothing hidden", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  expect(await page.locator("[data-reveal].is-pending:not(.is-revealed)").count()).toBe(0);
  expect(await revealHidden(page)).toBe(0);
});

test("below-the-fold sections reveal once and stay revealed", async ({ page }) => {
  await page.goto("/");
  const faq = page.locator("details.faq-item").first();
  await expect(faq).toHaveClass(/is-pending/);
  await faq.scrollIntoViewIfNeeded();
  await expect(faq).toHaveClass(/is-revealed/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await expect(faq).toHaveClass(/is-revealed/);
});

test("hero headline is readable immediately and the hero has a primary call to action", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveText("Brand. Web. Software. One team.");
  await expect(page.getByRole("link", { name: "Start a project" }).first()).toBeVisible();
  // The H1 is never faded (opacity animations would delay the largest paint).
  expect(Number(await h1.evaluate((n) => getComputedStyle(n).opacity))).toBe(1);
});

test("client-side navigation plays the page entrance, the first load does not", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("main > div.page-enter").count()).toBe(0);
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about-us\/$/);
  await expect(page.locator("main > div.page-enter")).toHaveCount(1);
});
