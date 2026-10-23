import { expect, test } from "@playwright/test";
import { ALL_PAGES } from "./support/routes";

const WIDTHS = [375, 390, 768, 1024, 1440, 1920];

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, hasTouch: width < 1024 });

    test("no page scrolls horizontally and controls stay usable", async ({ page }) => {
      for (const path of ALL_PAGES) {
        await page.goto(path);
        const report = await page.evaluate(() => {
          const overflow = document.documentElement.scrollWidth - window.innerWidth;
          const offenders = [...document.querySelectorAll("body *")]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              const style = getComputedStyle(el);
              return r.width > 0 && r.right > window.innerWidth + 1 && style.position !== "fixed" && !el.closest("[role=region]") && !el.closest("dialog");
            })
            .slice(0, 3)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
          // WCAG 2.2 target size (minimum): standalone controls at least 24×24 CSS px.
          const small = [...document.querySelectorAll("button, input:not([type=hidden]), select, textarea, summary, .btn, nav a, footer a")]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0 || el.closest("[aria-hidden=true]") || el.closest("dialog:not([open])")) return false;
              return r.width < 24 || r.height < 24;
            })
            .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`);
          return { overflow, offenders, small };
        });
        expect(report.overflow, `${path} overflows by ${report.overflow}px: ${report.offenders.join(", ")}`).toBeLessThanOrEqual(0);
        expect(report.small, `${path} small targets`).toEqual([]);
      }
    });
  });
}

test("text reflows at 200% zoom (320 CSS px) without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of ["/", "/contact-us/", "/web-development-consulting-services/", "/the-future-of-digital-marketing/"]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), path).toBeLessThanOrEqual(0);
  }
});
