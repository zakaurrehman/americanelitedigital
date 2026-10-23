import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/inquiry/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit within a window, then blocks", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });
    const t = 1_000_000;
    expect([1, 2, 3].map(() => limiter.hit("ip", t).allowed)).toEqual([true, true, true]);
    const blocked = limiter.hit("ip", t + 1_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBe(59);
  });

  it("tracks keys independently and resets after the window", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });
    expect(limiter.hit("a", 0).allowed).toBe(true);
    expect(limiter.hit("b", 0).allowed).toBe(true);
    expect(limiter.hit("a", 500).allowed).toBe(false);
    expect(limiter.hit("a", 1_000).allowed).toBe(true);
  });
});
