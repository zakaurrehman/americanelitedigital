import { expect, test } from "@playwright/test";
import { ALL_PAGES, ARTICLE_ROUTES, CANONICAL_ORIGIN, INDEXABLE_ROUTES, REDIRECTS, UTILITY_ROUTES } from "./support/routes";

test.describe("every page", () => {
  for (const path of ALL_PAGES) {
    test(`${path} renders with complete metadata`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
      await expect(page).toHaveTitle(/American Elite Digital/);

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThanOrEqual(50);
      expect(description?.length ?? 0).toBeLessThanOrEqual(170);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${CANONICAL_ORIGIN}${path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/americanelitedigital\.com\//);

      const robotsMeta = page.locator('meta[name="robots"]');
      const robots = (await robotsMeta.count()) ? await robotsMeta.getAttribute("content") : "";
      if (UTILITY_ROUTES.includes(path)) expect(robots).toContain("noindex");
      else expect(robots).not.toContain("noindex");

      // Structured data must be valid JSON.
      for (const block of await page.locator('script[type="application/ld+json"]').allTextContents()) {
        expect(() => JSON.parse(block)).not.toThrow();
      }

      // Images: dimensions reserved (no CLS) and alt attribute present (empty only when decorative).
      for (const img of await page.locator("img").all()) {
        expect(await img.getAttribute("alt")).not.toBeNull();
        expect(await img.getAttribute("width")).not.toBeNull();
      }
    });
  }

  test("titles and descriptions are unique across indexable pages", async ({ request }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of INDEXABLE_ROUTES) {
      const html = await (await request.get(path)).text();
      titles.add(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "");
      descriptions.add(html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "");
    }
    expect(titles.size).toBe(INDEXABLE_ROUTES.length);
    expect(descriptions.size).toBe(INDEXABLE_ROUTES.length);
  });

  test("articles carry BlogPosting data with author and dates", async ({ request }) => {
    for (const path of ARTICLE_ROUTES) {
      const html = await (await request.get(path)).text();
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]!));
      const article = blocks.flat().find((b) => b["@type"] === "BlogPosting");
      expect(article, path).toBeTruthy();
      expect(article.author.name).toContain("Davidson");
      expect(article.datePublished).toMatch(/^2024-05-/);
    }
  });
});

test.describe("errors and retired routes", () => {
  test("unknown URLs return a helpful 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist/");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("moved on");
    await expect(page.getByRole("link", { name: "Go to the homepage" })).toBeVisible();
  });

  test("unpublished pricing and empty portfolio are 404s and not linked anywhere", async ({ page, request }) => {
    test.skip(process.env.E2E_PREVIEW === "true", "preview builds publish both on purpose");
    for (const path of ["/pricing/", "/work/"]) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
    await page.goto("/");
    await expect(page.locator('a[href="/pricing/"], a[href="/work/"]')).toHaveCount(0);
    await expect(page.getByText("Preview placeholder")).toHaveCount(0);
  });

  for (const [from, to] of REDIRECTS) {
    test(`redirects ${from} → ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect([301, 308]).toContain(response.status());
      const location = new URL(response.headers()["location"]!, "http://localhost");
      expect(location.pathname).toBe(to);
    });
  }
});

test.describe("crawler files", () => {
  test("sitemap lists exactly the indexable pages, all returning 200", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(CANONICAL_ORIGIN, ""));
    // Preview builds switch packages on, which correctly adds /pricing/ (placeholder work never is).
    const expected = [...INDEXABLE_ROUTES, ...(process.env.E2E_PREVIEW === "true" ? ["/pricing/"] : [])];
    expect(locs.sort()).toEqual(expected.sort());
    for (const path of locs) expect((await request.get(path)).status(), path).toBe(200);
  });

  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text();
    expect(text).toContain("Allow: /");
    expect(text).toContain(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`);
  });

  test("RSS feed is served at the old WordPress URL", async ({ request }) => {
    const response = await request.get("/feed/");
    expect(response.headers()["content-type"]).toContain("application/rss+xml");
    const xml = await response.text();
    expect(xml.match(/<item>/g)?.length).toBe(ARTICLE_ROUTES.length);
  });

  test("security headers are set", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
