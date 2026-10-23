# Design direction

## Inputs

- **Brand equity worth keeping:** the American Elite crest (gold lion, green laurel, navy star ribbon on a crimson and gold field) and its palette of **gold, crimson and navy**. It signals heritage and "American" credibility. The problem was its execution: a raster crest in a bevelled frame on a `#FF0000` bar, not the idea behind it.
- **Content reality:** strong, specific service copy; four articles; no portfolio, testimonials, team photos or project imagery. The stock imagery is generic, and some of it has baked-in text.
- **Audience:** business owners, startups and growing companies judging whether this team is credible enough to trust with their brand, website or software.
- **Research (UI/UX Pro Max dataset):**
  - "B2B Service" points to Swiss and minimal styles, with credibility and clear ROI messaging.
  - "Creative/Marketing Agency" points to editorial and motion-led styles, and **requires case studies** to work.
  - Authority palettes for professional services pair **navy with a trust gold**.
  - Editorial Grid and Exaggerated Minimalism are recommended for agency landing pages, with high-contrast, oversized but readable type.
  - The search script couldn't run (no Python on this machine), so the dataset's CSVs were queried directly.
- **21st.dev MCP:** **not available in this session.** None of its tools were connected, so no 21st.dev components were searched or used. All components are original implementations on native HTML primitives.

## Three directions explored

### A. Editorial Digital Studio — "American Editorial"

- **Look:** warm ivory paper and navy ink. Oversized Caslon display headlines (the typeface family of early American printing, including the 1776 Declaration broadside) paired with a Franklin Gothic-lineage sans (Public Sans, the US government's open-source typeface).
- **Detail:** gold hairline rules, numbered sections, generous margins, and a restrained crimson used only for action.
- **Signature element:** a typographic **services index** in the hero (Brand · Build · Grow · Advise), which works as both the centrepiece and the navigation.

### B. Premium Technology Partner — "Mission Control"

- **Look:** deep navy surfaces, precise 1px grids, monospaced labels, schematic diagrams and animated system illustrations.
- **Promise:** technical depth.
- **Risk:** it needs real product or interface work to show, and the site has none, so diagrams would become decoration posing as proof.

### C. Contemporary Growth Agency — "Results Engine"

- **Look:** bold commercial headlines, big numbers, case-study-first layouts, high-energy colour blocks.
- **Risk:** its core assets (metrics, logos, case studies, testimonials) **don't exist**. Filling those slots would mean fabricating proof, which the brief forbids.

## Evaluation

Scores are 1–5, higher is better.

| Criterion | A. Editorial | B. Technology | C. Growth |
|---|---|---|---|
| Brand distinction (heritage crest, "American Elite" name) | **5** — Caslon and gold rules extend the crest naturally | 3 — generic tech look; discards the brand's heritage | 2 — looks like any growth agency |
| Credibility with the content available today | **5** — typography and specific copy carry it without imagery | 2 — implies product proof the site can't show | 1 — depends on fake metrics |
| Conversion potential | 4 — clear CTAs, services index, inquiry form on every key page | 4 | 5 in theory; fails without proof |
| Accessibility | **5** — high-contrast ink on paper (15.7:1), large type | 4 — dark UI is harder for low vision; thin mono labels | 4 |
| Performance | **5** — almost no imagery needed; CSS-only motion | 3 — animated diagrams cost JavaScript | 3 — heavy imagery and counters |
| Maintenance | **5** — new content is mostly text | 3 | 2 — every page needs bespoke visuals |
| Fit across all routes (legal, articles, services) | **5** — editorial suits long-form pages | 3 | 2 |
| **Total** | **34** | 22 | 19 |

## Decision: A, "American Editorial"

It's the only direction that is distinctive, honest about the available content, and excellent without imagery or motion.

It takes one disciplined idea from B: **precision**. That means a strict 12-column grid, hairline rules, tabular numerals and a monospaced-feeling label style built from Public Sans small caps rather than a third font. This doesn't mix styles; it executes the editorial idea precisely.

### What it looks like

- **Surfaces:**
  - Ivory paper (`#F6F2EA`) is the default.
  - Deep navy (`#12284A`) is reserved for moments of emphasis: the "Why us" section, the inquiry band and the footer.
  - Navy sections invert the system (paper text, gold accents) and are never decorative backdrops.
- **Type:**
  - Libre Caslon Display for headlines (H1 hero up to 96px).
  - Libre Caslon Text italic for one or two emphasis words per headline, in gold on navy or crimson on paper.
  - Public Sans for everything else.
- **Brand mark:** the real crest (lion and laurel, cropped from the original logo) as a small circular seal beside a typographic wordmark — "American Elite" in Caslon over "DIGITAL" in tracked small caps. The full original logo appears on the About page under "Our mark", so the recognisable artwork is kept and presented properly.
- **Graphic language:**
  - hairline gold rules
  - section numerals ("01 / Brand")
  - a large gold star from the crest ribbon, used sparingly as a section terminator
  - pull-quote scale for key statements
  - No gradients, glassmorphism, floating blobs or emoji.
- **Imagery:** article featured images only, framed with a thin rule and a caption-style label. No stock photos on service pages; specific copy does the work.
- **Motion:** CSS only.
  - A one-time 560 ms rise-and-fade on the hero.
  - Scroll-driven reveals (`animation-timeline: view()`) that apply only where supported, and **never hide content when unsupported**.
  - 200 ms hover and focus transitions; the arrow nudges on links.
  - All of it is disabled under `prefers-reduced-motion`.

### What we deliberately avoided

- Repeating three-card grids. Services render as an indexed list, process as a numbered rule-line sequence, and articles as an editorial list with one featured lead.
- Hidden-until-hover information. Every service row shows its contents at rest.
- Fake proof. The "proof" band states only facts the business already publishes: free initial project ideas, a Los Angeles address, membership of American Elite Enterprises, and brand, web, apps and marketing under one roof. Package-only guarantees (24-hour turnaround, money-back, ownership rights) appear only beside the packages they belong to. There are no invented numbers.
