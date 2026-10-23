import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against the production build (`npm run build` first).
// Inquiries are delivered to a local webhook sink — never to a real inbox or CRM.
const PORT = Number(process.env.E2E_PORT ?? 4320);
const HOOK_PORT = Number(process.env.E2E_HOOK_PORT ?? 4399);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
  webServer: [
    {
      command: `node tests/e2e/support/webhook-sink.mjs ${HOOK_PORT}`,
      url: `http://127.0.0.1:${HOOK_PORT}/health`,
      // Stateless apart from received payloads, which tests filter by unique email.
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node node_modules/next/dist/bin/next start -p ${PORT}`,
      url: `http://localhost:${PORT}/`,
      reuseExistingServer: false,
      timeout: 90_000,
      env: {
        CONTACT_WEBHOOK_URL: `http://127.0.0.1:${HOOK_PORT}/hook`,
        CONTACT_WEBHOOK_SECRET: "e2e-secret",
        // Preview runs (npm run test:preview) also need packages enabled at request time for the API.
        SHOW_PACKAGES: process.env.SHOW_PACKAGES ?? "",
        PREVIEW_PLACEHOLDER_WORK: process.env.PREVIEW_PLACEHOLDER_WORK ?? "",
      },
    },
  ],
});
