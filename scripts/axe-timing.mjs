// Diagnostic: time axe-core rules on one page. Usage: node scripts/axe-timing.mjs <url>
// (Kept out of the test suite; used to investigate slow accessibility runs.)
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:4317/";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
for (const rules of [["color-contrast"], ["region", "landmark-one-main", "heading-order"], null]) {
  const t0 = Date.now();
  const builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"]);
  if (rules) builder.withRules(rules);
  const r = await builder.analyze();
  console.log(rules ? rules.join(",") : "all", `${Date.now() - t0}ms`, "violations:", r.violations.map((v) => v.id).join(",") || "none", "incomplete:", r.incomplete.length);
}
await browser.close();
