# American Elite Digital — website

The marketing website for American Elite Digital (brand identity, websites, applications and digital marketing, Los Angeles). It replaces the WordPress/Elementor site at americanelitedigital.com and keeps every existing URL.

**Stack:** Next.js 16 (App Router, static generation) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Vitest · Playwright + axe-core.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional in development; required in production
npm run dev                  # http://localhost:3000
```

Without delivery credentials in development, form submissions are logged (without personal data) instead of sent. **In production the form returns an error until `SMTP_*` or `CONTACT_WEBHOOK_URL` is set.**

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end, accessibility and responsive tests against the production build. Run `npm run build` first. |
| `npm run test:all` | All of the above, in order |
| `npm run test:preview` | Builds with the unpublished packages and portfolio placeholders into `.next-preview/` and tests them |

## Editing content

All copy and business facts live in `src/content/`, typed, with articles as Markdown in `src/content/insights/`. See `docs/architecture.md` → "Editing content" for how to:

- add an article or a case study
- publish the logo packages (they stay off until the owner confirms the prices)
- bring back a sister-site link

## Documentation

| Document | Contents |
|---|---|
| `docs/audit/website-inventory.md` | Every route on the old site, CTAs, hidden pricing, media |
| `docs/audit/component-inventory.md` | Old components, problems and severity |
| `docs/audit/technical-audit.md` | Old platform findings and the stack decision |
| `docs/audit/performance-baseline.md` | Lighthouse baseline of the old site |
| `docs/audit/seo-audit.md` | SEO findings, redirect map, metadata as built |
| `docs/audit/redesign-roadmap.md` | Priorities, service hierarchy, owner blockers, post-launch plan |
| `docs/design/design-direction.md` | Three directions considered and why "American Editorial" was chosen |
| `docs/design/design-system.md` | Tokens, type, layout, components, motion |
| `docs/architecture.md` | Code structure, data flow, feature switches, security, limitations |
| `docs/deployment.md` | Go-live checklist, Vercel / Hostinger steps, rollback |
| `docs/testing/verification-report.md` | Test results and before/after performance |
