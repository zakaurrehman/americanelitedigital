import { expect, test } from "@playwright/test";
import { ALL_PAGES } from "./support/routes";

test("every internal link and CTA resolves, and no link is a placeholder", async ({ page, request }) => {
  const internal = new Set<string>();
  const problems: string[] = [];

  for (const path of [...ALL_PAGES, "/does-not-exist/"]) {
    await page.goto(path);
    const links = await page.locator("a").evaluateAll((anchors) =>
      anchors.map((a) => ({ href: a.getAttribute("href"), text: (a.textContent ?? "").trim().slice(0, 40), rel: a.getAttribute("rel") })),
    );
    for (const link of links) {
      if (!link.href || link.href === "#" || link.href.startsWith("javascript:")) {
        problems.push(`${path}: placeholder link "${link.text}"`);
        continue;
      }
      if (link.href.startsWith("#") || link.href.startsWith("tel:") || link.href.startsWith("mailto:")) continue;
      if (link.href.startsWith("/")) internal.add(link.href.split("#")[0]!);
      else if (!link.href.startsWith("https://")) problems.push(`${path}: non-HTTPS external link ${link.href}`);
    }
  }

  for (const href of internal) {
    const response = await request.get(href);
    if (response.status() !== 200) problems.push(`${href} → ${response.status()}`);
  }

  expect(problems).toEqual([]);
  // Sanity check that the crawl actually found the site's pages.
  expect(internal.size).toBeGreaterThanOrEqual(17);
});

test("in-page anchors point at existing elements", async ({ page }) => {
  for (const path of ALL_PAGES) {
    await page.goto(path);
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
        .map((a) => a.getAttribute("href")!.slice(1))
        .filter((id) => id && !document.getElementById(decodeURIComponent(id))),
    );
    expect(missing, path).toEqual([]);
  }
});
