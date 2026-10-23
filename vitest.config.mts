import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // "server-only" throws outside React Server Components; unit tests run server code directly.
    alias: { "server-only": path.resolve(process.cwd(), "tests/unit/server-only-stub.ts") },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
