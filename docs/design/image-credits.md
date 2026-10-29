# Image credits and rules (v3)

## Logo

The source is the owner's **updated, metallic logo** (1431 × 1099 JPEG on white, sent over WhatsApp), supplied on 2026-10-27. It replaced the flat logo of 2026-10-24 (`American Logo.jpg`).

`public/brand/` holds transparent PNGs made from it by `node scripts/build-logo-assets.mjs <logo.jpg>`.
- **Background:** the white background, the letter counters and the gaps in the mane become transparent.
- **Shine:** the metallic highlights stay opaque, so they don't turn see-through on navy.
- **Edges:** only the anti-aliased edges get partial transparency.

The artwork itself was not redrawn or recoloured, apart from the dark-background variant noted below. A few sub-pixel specks where the laurel leaves meet the stem remain; they're invisible at the sizes used.

**For print or larger sizes:** the WhatsApp copy is compressed and 1431 px wide. Ask the designer for the original file (ideally vector: AI, EPS, SVG or PDF) and re-run the script on it.

| File | Use |
|---|---|
| `lockup-full.png` | About page "Our mark", Organization JSON-LD logo, social image |
| `lockup-horizontal.png` | Header: the emblem beside the wordmark |
| `lockup-horizontal-on-dark.png` | Footer. The blue "AMERICAN ELITE" lettering becomes chrome (white, keeping its metallic shading) and "DIGITAL" is brightened, so both read on navy. The gold is unchanged. |
| `emblem.png` | Lion, laurel and ribbon: hero badge, the "Part of American Elite Enterprises" card, call-to-action watermark, favicon and Apple touch icon |

`public/og/default.png` (the social share image) is generated from `lockup-full.png` and the `workshop` photo. `src/app/icon.png` (192 px, transparent) and `apple-icon.png` (180 px, on white) are generated from `emblem.png`.

## Photography

All 15 photos are from **Unsplash** under the [Unsplash License](https://unsplash.com/license): free for commercial use, with no permission or attribution required.

- **Processing:** they were downloaded from `images.unsplash.com` at 2000 px, then re-encoded to 1800 px mozjpeg (2.6 MB in total at source). Next.js serves resized AVIF or WebP.
- **Code:** the typed registry, with alt text, is `src/content/media.ts`.

| File (`public/images/photos/`) | Unsplash photo ID | Used on |
|---|---|---|
| `workshop.jpg` | `1552664730-d307ca884978` | Home hero, services header, social image |
| `wireframe-sketch.jpg` | `1581291518857-4e27b48ff24e` | Home hero (inset) |
| `collaborate.jpg` | `1522071820081-009f0129c71c` | About header, home process section |
| `team-desk.jpg` | `1519389950473-47ba0277781c` | Home "Under one roof", About methodology |
| `pair-review.jpg` | `1531482615713-2afd69097998` | Home "Why", Why-choose-us header |
| `designer-tablet.jpg` | `1572044162444-ad60f128bdea` | "Brand" practice card |
| `wireframe-tablet.jpg` | `1586717791821-3f44a563fa4c` | "Build" practice card |
| `analytics-laptop.jpg` | `1460925895917-afdab827c52f` | "Grow" practice card |
| `strategy-wall.jpg` | `1531403009284-440f080d1e12` | "Advise" practice card |
| `brand-swatches.jpg` | `1561070791-2526d30994b5` | Branding service header |
| `phone-laptop.jpg` | `1563986768609-322da13575f3` | Web development service header |
| `app-screens.jpg` | `1609921212029-bb5a28e60960` | App development service header |
| `marketing-desk.jpg` | `1533750349088-cd871a92f312` | Digital marketing service header |
| `presentation.jpg` | `1557804506-669a67965ba0` | Digital strategy service header |
| `sketch-desk.jpg` | `1432888498266-38ffec3eaf0a` | Contact header |

The source URL for each is `https://images.unsplash.com/photo-<ID>`.

### Rules applied when choosing

- **Illustrative only.** Alt text describes what is in the picture. No caption or alt text presents the people as American Elite Digital staff, clients or projects.
- **No third-party brands.** I excluded photos showing app or company logos (Instagram, Netflix, Adobe app icons, a branded coffee cup) and a screen with readable Microsoft course text. That last one was swapped out after review.
- **No implied scale.** I excluded a large open-plan office that would suggest a company size the business hasn't stated.
- **The old site's images were reviewed and not reused.** They were mostly dark stock, small (the people photos are 475 × 332 px), or carried baked-in text, including a third-party endorsement banner.

**Owner action recommended:** replace these with real photos of the team, workspace and delivered projects as they become available. Real photography is more credible than stock.
