// Builds the site with the unpublished features switched on (logo packages, portfolio
// placeholders) into .next-preview/, then runs the preview e2e checks against it.
// The production build in .next/ is never touched.
import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  SHOW_PACKAGES: "true",
  PREVIEW_PLACEHOLDER_WORK: "true",
  NEXT_DIST_DIR: ".next-preview",
  E2E_PREVIEW: "true",
  E2E_PORT: "4321",
};

const run = (args) => {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run(["node_modules/next/dist/bin/next", "build"]);
run(["node_modules/@playwright/test/cli.js", "test", "preview.spec", "routes.spec"]);
