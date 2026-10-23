# Performance baseline — production, before redesign

## Method

- **Tool:** Lighthouse 12.3.0 (npm CLI), headless Chrome 155 on Windows 11. Default simulated throttling: mobile is Moto G Power-class with 4× CPU slowdown and slow 4G; desktop preset is 10 Mbps with no CPU slowdown.
- **Date:** 2026-10-23, 11:59–12:06 UTC. One run per page; scores vary by a few points between runs.
- **Pages:** `/` (mobile and desktop), `/web-development-consulting-services/` (mobile), `/contact-us/` (mobile).
- **Field data:** I requested real-user Core Web Vitals (CrUX) through the PageSpeed Insights API, but it returned `429 Quota exceeded` for anonymous use. **All numbers below are lab measurements, not real-user data.** A Search Console Core Web Vitals report, if the property is verified, would supply field data.

## Results

| Page | Form factor | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Speed Index | Transfer |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Mobile | **47** | 90 | 93 | 69 | 3.3 s | 3.8 s | 1,900 ms | 0.056 | 7.9 s | 2,945 KB |
| `/` | Desktop | **52** | 90 | 93 | 69 | 0.8 s | 8.3 s | 220 ms | **0.139** | 31.1 s | **26,545 KB** |
| `/web-development-consulting-services/` | Mobile | **61** | 93 | 96 | 77 | 2.7 s | 5.6 s | 280 ms | 0.003 | 8.9 s | 5,302 KB |
| `/contact-us/` | Mobile | **56** | 93 | 96 | 77 | 2.7 s | 3.4 s | 1,590 ms | 0.001 | 5.9 s | 8,786 KB |

Against Google's "good" thresholds (LCP ≤ 2.5 s, CLS ≤ 0.1, and TBT as the lab proxy for INP), **every page fails LCP**, the desktop homepage fails CLS, and three of four runs have TBT above 1 s.

## Where the weight comes from (homepage, mobile)

| Resource type | Requests | Transfer |
|---|---|---|
| Script | 57 | 738 KB |
| Font | 13 | 617 KB |
| Media (video) | 11 | 882 KB on mobile; 23.9 MB on desktop |
| Stylesheet | 72 | 334 KB |
| Image | 15 | 249 KB |
| Document | 5 | 123 KB |
| Third-party | 25 | 484 KB |
| **Total** | **177** | **2,945 KB** |

## Main causes

1. **Third-party script:** Google reCAPTCHA (`Google CDN` entity) blocked the main thread for 1,270 ms on mobile, and it isn't even used.
2. **JavaScript execution:** main-thread work of 15.7 s and bootup time of 5.9 s on mobile; about 298 KB of unused JavaScript.
3. **Server response:** TTFB of 0.9–1.76 s under Lighthouse, because pages aren't edge-cached.
4. **Video backgrounds:** up to 4K MP4s. LCP on desktop lands at 8.3 s and Speed Index at 31 s while video frames paint.
5. **Fonts:** 13 font files, with `font-display` missing on the self-hosted Californian FB, which delays text.
6. **Layout shift (desktop 0.139):** unsized images (`unsized-images`, `image-aspect-ratio` audits) and late-loading banners.
7. **Caching:** 146 static resources served without long cache lifetimes.

## Other failing Lighthouse audits

- **Accessibility:**
  - `color-contrast`: white on `#FF0000` 3.99:1, white on `#FF8F8F` 2.19:1, white on `#FF8181` 2.41:1
  - `link-name`: the logo link has no accessible name
  - `aria-allowed-role`: `role="presentation"` on `<video>`
  - `link-in-text-block`
- **SEO:**
  - `meta-description` missing on all pages
  - `crawlable-anchors`: social links with no `href`
  - `link-text`: "Learn More", "Read More"
  - `robots-txt`: Lighthouse could not download it during the run, although `curl` returns 200, which points to slow dynamic generation
- **Best practices:** `errors-in-console` (a 404 for a missing resource).

## Raw reports

Raw Lighthouse JSON was kept in the session scratchpad and isn't committed (about 500 KB each). Re-create it with:

```bash
npx lighthouse@12.3.0 https://americanelitedigital.com/ --output=json --output-path=./home.mobile.json
npx lighthouse@12.3.0 https://americanelitedigital.com/ --preset=desktop --output=json --output-path=./home.desktop.json
```

The before-and-after comparison is in `docs/testing/verification-report.md`.
