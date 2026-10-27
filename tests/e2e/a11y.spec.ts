import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ALL_PAGES } from "./support/routes";

// WCAG 2.2 A/AA automated checks on every page, at desktop and mobile sizes, plus key states.
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const audit = async (page: import("@playwright/test").Page) => {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
};

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`axe @ ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });
    for (const path of [...ALL_PAGES, "/does-not-exist/"]) {
      test(path, async ({ page }) => {
        await page.goto(path);
        expect(await audit(page)).toEqual([]);
      });
    }
  });
}

test.describe("axe on interactive states", () => {
  test("open services menu", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Services" }).click();
    expect(await audit(page)).toEqual([]);
  });

  test("open mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    expect(await audit(page)).toEqual([]);
  });

  test("form with validation errors", async ({ page }) => {
    await page.goto("/contact-us/");
    await page.getByRole("button", { name: "Request free consultation" }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    expect(await audit(page)).toEqual([]);
  });

  test("expanded FAQ", async ({ page }) => {
    await page.goto("/");
    for (const summary of await page.locator("summary").all()) await summary.click();
    expect(await audit(page)).toEqual([]);
  });
});

test("respects reduced motion: nothing is hidden waiting for an animation", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  expect(await page.locator("[data-reveal].is-pending").count()).toBe(0);
  for (const el of await page.locator(".motion-rise, .motion-slide, .motion-fade, [data-reveal], .line-mask > span").all()) {
    const style = await el.evaluate((n) => ({ opacity: getComputedStyle(n).opacity, transform: getComputedStyle(n).transform, clip: getComputedStyle(n).clipPath }));
    expect(Number(style.opacity)).toBe(1);
    expect(style.transform).toBe("none");
    expect(style.clip).toBe("none");
  }
  await context.close();
});
