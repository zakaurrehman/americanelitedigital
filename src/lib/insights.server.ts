import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

const INSIGHTS_DIR = path.join(process.cwd(), "src", "content", "insights");

/** Reads an article body (Markdown). Slugs come from the typed index, never from user input. */
export async function readInsightBody(slug: string): Promise<string> {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid insight slug: ${slug}`);
  return readFile(path.join(INSIGHTS_DIR, `${slug}.md`), "utf8");
}

/** Approximate reading time at 230 words per minute. */
export function readingMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
