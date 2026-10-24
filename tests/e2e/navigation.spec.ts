import { expect, test } from "@playwright/test";

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("services menu works with the keyboard and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Services" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(`#${await trigger.getAttribute("aria-controls")}`);
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link")).toHaveCount(6);

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("services menu closes on outside click and navigates to a service", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Services" });
    await trigger.click();
    // Click a point well outside the (centred, wide) services panel.
    await page.mouse.click(12, 700);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await page.getByRole("link", { name: /Website design & development/ }).first().click();
    await expect(page).toHaveURL(/\/web-development-consulting-services\/$/);
    await expect(page.locator("h1")).toHaveText("Web Development Consulting");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("marks the current page and supports back/forward", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("navigation", { name: "Main" });
    await main.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about-us\/$/);
    await expect(main.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");

    await main.getByRole("link", { name: "Insights" }).click();
    await expect(page).toHaveURL(/\/blogs\/$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/about-us\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/blogs\/$/);
  });

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/services/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("refreshing a nested route keeps the page", async ({ page }) => {
    await page.goto("/contact-us/thank-you/");
    await page.reload();
    await expect(page.locator("h1")).toContainText("Thank you");
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

  test("menu dialog opens, traps focus, closes with Escape and restores focus", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Menu" });
    await open.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();

    // A native modal dialog makes the page behind it inert: Tab cycles through the dialog and
    // may pass to the browser's own UI (document.body), but never reaches background content.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const where = await page.evaluate(() => {
        const el = document.activeElement;
        return !el || el === document.body ? "browser" : el.closest("dialog") ? "dialog" : `background: ${el.outerHTML.slice(0, 80)}`;
      });
      expect(["dialog", "browser"]).toContain(where);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
  });

  test("menu links navigate and close the dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await dialog.getByRole("link", { name: "Digital marketing & SEO" }).click();
    await expect(page).toHaveURL(/\/digital-marketing-consulting-services\/$/);
    await expect(dialog).toBeHidden();
    // Page scrolling is restored after the dialog closes.
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("FAQ items open and close without JavaScript widgets", async ({ page }) => {
    await page.goto("/");
    const item = page.locator("details").filter({ hasText: "Is the first consultation free?" });
    await item.locator("summary").click();
    await expect(item).toHaveAttribute("open", "");
    await expect(item.getByText("free of charge")).toBeVisible();
    await item.locator("summary").click();
    await expect(item).not.toHaveAttribute("open", "");
  });
});
