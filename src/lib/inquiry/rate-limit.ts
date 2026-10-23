// Fixed-window, in-memory rate limiter. It protects a single Node.js process; on multi-instance
// or serverless hosts each instance keeps its own window, so treat it as a first line of defence.

export type RateLimiter = {
  /** Records a hit and reports whether it is allowed, plus seconds until the window resets. */
  hit(key: string, now?: number): { allowed: boolean; retryAfter: number };
};

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const windows = new Map<string, { count: number; resetAt: number }>();

  return {
    hit(key, now = Date.now()) {
      if (windows.size > 10_000) {
        for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
      }
      const current = windows.get(key);
      if (!current || current.resetAt <= now) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfter: 0 };
      }
      current.count += 1;
      return { allowed: current.count <= limit, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
    },
  };
}
