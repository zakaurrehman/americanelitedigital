# Redesign roadmap

## 1. Business and conversion priorities

**Primary goal:** turn qualified visitors (business owners, startups, growing companies) into project inquiries.
**Secondary goal:** let first-time buyers start small with a logo package, once prices are confirmed and the packages are switched on.

**What a visitor needs within the first screen, and what the old site gave them:**

| Visitor question | Old site | Redesign |
|---|---|---|
| What do you do? | "Cutting-Edge Digital Strategy" (vague) | Brand identity, websites, custom applications and digital marketing, named explicitly |
| Who is it for? | Not stated | Business owners, startups and growing companies |
| Why you? | Not stated above the fold | One accountable team from identity to launch to growth; Los Angeles based; free initial project ideas |
| What next? | "Learn More" | **Start a project** (primary), **Explore services** (secondary), phone number in the header |

## 2. Service hierarchy recommendation

I scored the current services on visitor intent (how specific and purchase-ready the search or visit is), offer clarity, credibility evidence available today, and route to conversion.

| Rank | Service (page) | Why it ranks here |
|---|---|---|
| 1 | **Website design & development** (`/web-development-consulting-services/`) | Highest commercial intent; the most concrete deliverables; a natural entry point to marketing and app work |
| 2 | **Brand identity & design** (`/branding-and-design-consulting-services/`) | Concrete, productised deliverables, with a priced package line ready to switch on; the cheapest way for a new client to start |
| 3 | **Application & software development** (`/application-development-consulting-services/`) | High value per project, but needs case studies to convert well; the site has none yet |
| 4 | **Digital marketing & SEO** (`/digital-marketing-consulting-services/`) | Ongoing, retainer-style work; buyers expect proof of results, which the site can't show yet |
| 5 | **Digital strategy & consulting** (`/digital-strategy-consulting-services/`) | Best positioned as the front door to the others (audit, then roadmap), rather than a standalone product |

**Presentation:** four pillars that tell one story — **Brand → Build → Grow → Advise.** Website and app development sit together under Build.

**Unbacked services:** "Business Consulting", "Analytics & Reporting" and "Content Creation" appear only as short blurbs on `/services/`, with no detail page. They are folded into the pillars where the existing copy supports them:

- analytics → Grow
- content → Grow
- business consulting → Advise

No new service pages were invented.

## 3. Phased plan (executed in this engagement)

| Phase | Work | Status |
|---|---|---|
| 1 | Audit: inventory, components, technical, performance, SEO | ✅ `docs/audit/` |
| 2 | Three creative directions; one selected; design system | ✅ `docs/design/` |
| 3 | Stack decision (Next.js 16, static generation) | ✅ `docs/audit/technical-audit.md` §4, `docs/architecture.md` |
| 4 | Tokens, global shell, navigation, footer | ✅ |
| 5 | Every route: home, services index, five service pages, about, why, contact, insights index, four articles, legal, 404, thank-you; pricing and portfolio built but switched off until real content exists | ✅ |
| 6 | Inquiry endpoint: validation, anti-spam, SMTP/webhook delivery | ✅ (credentials needed at deploy) |
| 7 | SEO: metadata, JSON-LD, sitemap, robots, RSS, redirects | ✅ |
| 8 | Verification: build, types, lint, unit, e2e, accessibility, Lighthouse | ✅ `docs/testing/verification-report.md` |

## 4. Blocked on the owner

| Item | Why it matters | What's needed |
|---|---|---|
| **Portfolio and case studies** | The biggest credibility gap: agency buyers expect to see work. `/work/` and the homepage section are built, and appear as soon as one entry exists. Preview them with `npm run test:preview`. | 3–6 real projects: client name (with permission), challenge, what was delivered, images, and results only if measured |
| **Testimonials** | Social proof near CTAs | Real, attributable quotes with permission. None exist on the current site |
| **Package prices** | Packages are built but switched off | Confirm the three prices (the $116 Social Media Kit may be a typo) and the guarantee terms, then set `PACKAGES_PUBLISHED = true` |
| **Form delivery credentials** | No leads arrive without them | SMTP credentials for the inbox, or a webhook URL for your CRM (`.env.example`) |
| **Social profiles** | The old icons had no links | Real profile URLs, or keep them omitted |
| **Legal review** | The privacy policy was written for the WordPress site (cookies, usage data) | Counsel review; the new site sets no tracking cookies and uses no analytics |
| **Sister-site status** | 3 of 17 network links failed on 2026-10-23 | Confirm whether Business Star Makers, American Elite Global Solutions and American Elite Executives are coming back; they're hidden via `live: false` in `src/content/site.ts` |
| **Team or leadership** | "Who will I work with?" is unanswered | Names, roles and photos, if the owner wants them public |
| **Analytics** | No measurement on the old site either | Choose a tool (e.g. privacy-friendly Plausible or GA4 with consent) |

## 5. Post-launch roadmap (recommended)

1. **Weeks 0–2:**
   - Submit the new `sitemap.xml` in Search Console.
   - Monitor coverage, 404s and redirect hits.
   - Confirm form delivery with a real internal test.
2. **Weeks 2–6:**
   - Publish the first 2–3 case studies.
   - Add testimonials next to CTAs.
   - Switch packages on once prices are confirmed.
3. **Ongoing:**
   - Publish one useful article a month, linked from the relevant service page.
   - Review Core Web Vitals field data monthly.
