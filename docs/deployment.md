# Deployment and rollback

The site is a standard Next.js server build and runs anywhere Node.js 20.9+ runs. The host hasn't been chosen yet (owner decision, 2026-10-23), so both likely targets are covered below. **Going live is a deliberate, reversible switch: the WordPress site stays untouched until then.**

## Before go-live checklist

| ✔ | Item | Owner | Notes |
|---|---|---|---|
| ☐ | Delivery channel configured | Owner / dev | Set `SMTP_*` and `CONTACT_TO_EMAIL` (Hostinger mailbox: `smtp.hostinger.com`, port 465), and/or `CONTACT_WEBHOOK_URL`. Without them the form returns 503, by design, and the server logs an error at startup. |
| ☐ | Real test inquiry received | Owner | Submit once on the staging URL and confirm it arrives. Tests only ever used a local webhook sink. |
| ☐ | `NEXT_PUBLIC_SITE_URL=https://americanelitedigital.com` | Dev | Used for canonicals, sitemap and Open Graph. |
| ☐ | `SHOW_PACKAGES` and `PREVIEW_PLACEHOLDER_WORK` unset | Dev | Preview-only switches. |
| ☐ | Legal text reviewed | Owner + counsel | The privacy policy still describes cookies and analytics that the new site doesn't use. |
| ☐ | Search Console access | Owner | Needed to submit the new sitemap and monitor the redirects. |
| ☐ | `npm run test:all` green on the release commit | Dev | Typecheck, lint, unit, build and e2e. |

## Option A — Vercel

1. Import the repository in Vercel. It detects Next.js; the defaults (`npm install`, `npm run build`) are correct.
2. Add the environment variables from `.env.example` under Production.
3. Deploy, and test on the generated `*.vercel.app` URL using the checklist above.
4. Add the domain `americanelitedigital.com` (and `www`, redirecting to the apex) in Vercel, then update DNS at the registrar or Hostinger as Vercel instructs (apex A record / `www` CNAME).
5. Vercel issues TLS automatically. HSTS is already sent by the app.

### Contact form email on Vercel, step by step

Without these variables the live form can't deliver: visitors see an error that gives them the phone number and email instead (by design, so no inquiry is silently lost).

1. Vercel → the project → **Settings → Environment Variables**.
2. Add each variable below for **Production** (and Preview, if previews should send email too):

   | Name | Value |
   |---|---|
   | `SMTP_HOST` | `smtp.hostinger.com` |
   | `SMTP_PORT` | `465` |
   | `SMTP_SECURE` | `true` |
   | `SMTP_USER` | the full mailbox address, e.g. `info@americanelitedigital.com` |
   | `SMTP_PASS` | that mailbox's password (mark it **Sensitive**) |
   | `CONTACT_TO_EMAIL` | where inquiries should arrive |
   | `CONTACT_FROM_EMAIL` | `American Elite Digital <info@americanelitedigital.com>` (must be the SMTP mailbox or an alias of it) |
   | `NEXT_PUBLIC_SITE_URL` | `https://americanelitedigital.com` once the domain is connected |

3. **Redeploy** (Deployments → latest → Redeploy). Variables only apply to new deployments.
4. Send one real inquiry from the live contact form and confirm it arrives, including in the spam folder. Reply to it to check that Reply-To is the visitor.
5. If it fails, open Vercel → Logs and look for `[inquiry]` lines. They name the failing channel and never print secrets or the visitor's details.

Notes: the in-memory rate limiter is per serverless instance. Use the Hobby plan only if it suits your commercial use; Vercel's terms require Pro for commercial sites.

## Option B — Hostinger (plan with Node.js web apps)

1. In hPanel, create a Node.js application on a **subdomain first** (for example `new.americanelitedigital.com`), with Node 20 or 22.
2. Deploy the code (Git integration or upload), then run:
   ```bash
   npm ci
   npm run build
   ```
3. Start command: `npm start`. Use the port Hostinger provides (`next start -p $PORT` if it isn't picked up automatically).
4. Set the environment variables from `.env.example` in the app settings.
5. Test on the subdomain using the checklist above.
6. Cut over by pointing the main domain at the Node.js app in hPanel, or swapping the document root / proxy target. Keep the WordPress files and database in place.

If your Hostinger plan can't run Node.js, use Option A for the website and keep the mailbox at Hostinger. The form sends email through Hostinger SMTP either way.

## After go-live (first two weeks)

- Submit `https://americanelitedigital.com/sitemap.xml` in Google Search Console, and remove the old `wp-sitemap.xml` (it now redirects).
- Watch Search Console → Pages for new 404s. Every URL from the old sitemap is preserved or redirected (`tests/e2e/routes.spec.ts`), but external links may point to other old paths. Add redirects in `next.config.ts` as needed.
- Send one real inquiry per week for the first month to confirm delivery.
- Once real-user data accumulates (about 28 days), check Core Web Vitals in Search Console.

## Rollback

The old site is never modified, so rollback takes minutes:

| Hosting option | How to roll back |
|---|---|
| Vercel | Remove the domain from the Vercel project and restore the previous DNS records (note them down **before** cut-over). |
| Hostinger | Point the domain back to the WordPress document root in hPanel. |

Redirects only exist in the new app, so rolling back restores WordPress URLs exactly as they were.

To roll back a bad release while staying on the new stack:

- **Vercel:** "Instant Rollback" to the previous deployment.
- **Hostinger:** check out the previous Git tag, then run `npm ci && npm run build` and restart.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server. With no delivery configured, submissions are logged (without personal data) instead of sent. |
| `npm run build` / `npm start` | Production build and server. |
| `npm run test:all` | Typecheck, lint, unit, build and e2e. |
| `npm run test:preview` | Builds with packages and placeholder work switched on into `.next-preview/` and tests them. This never touches `.next/`. |
