# Component selection — 21st.dev (v2 redesign, 2026-10-23)

## How 21st.dev was accessed

- **MCP:** no 21st.dev MCP server was connected in this session. Tool discovery returned no `21st` or "magic" tools, so **no MCP tools were used**.
- **Website:** I browsed the public site instead (`https://21st.dev/`, category pages `/s/hero`, `/s/text`, `/s/button`, `/s/background`, `/s/accordion`, `/s/timeline`, `/s/navbar`, `/s/features`, `/s/card`, `/s/footer`).
- **Registry:** the shadcn-style registry (`/r/<author>/<component>`) returned **403 Authentication required**.
- **Source:** where a page exposed it publicly, I read the component through its CDN source file (`cdn.21st.dev/user_<author>/<name>.tsx`) or its compiled demo bundle.
- **Packages and CLI:** nothing was installed from 21st.dev and no CLI was run. Every adopted idea was reimplemented inside this project's design tokens.

## Candidates inspected

| Pattern needed | Component (author) | Licence stated | Dependencies | Source read | Decision |
|---|---|---|---|---|---|
| Sliding nav indicator | **Tubelight Navbar** (ayushmxxn) | MIT | framer-motion, lucide-react | ✅ `.tsx` | **Adapted** → `HeaderNav` "lamp". See notes 1. |
| Scroll-linked process timeline | **Timeline** (Aceternity / manuarora700) | MIT | framer-motion | ✅ `.tsx` | **Adapted** → `ProcessSteps`. See notes 2. |
| Animated border light | **Shine Border** (Magic UI / dillionverma) | MIT | none (CSS + Tailwind) | ✅ `.tsx` | **Adapted** → `.btn-secondary:hover::before`. See notes 3. |
| Cursor spotlight cards | **Spotlight Card / GlowCard** (jahed, EaseMize) | not stated | none | ✅ compiled bundle | **Technique only**: own implementation (`.spot` + `MotionRuntime`). See notes 4. |
| Masked headline reveal | **Vertical Cut Reveal** (cnippet-dev) | "no-license" | — | ✅ compiled bundle | **Concept only**: own CSS (`.line-mask`). No code taken. |
| Large-wordmark footer | Beam Wordmark Footer (kedhareswer), Large Name Footer (arihantcodes) | MIT / not stated | — | listing only | **Idea only**: own implementation in `SiteFooter`. |
| FAQ accordion | Accordion Plus/Minus (designali-in) | MIT | @radix-ui/react-accordion, dicons | listing | **Rejected**: native `<details>` with CSS `::details-content` gives the same interaction with zero JavaScript. |
| Bento features | Bento (kinfe123) | not stated | framer-motion, clsx | listing | **Rejected**: unknown licence, framer-motion. Bento layouts were built with CSS grid. |
| Dark grid background | Elegant Dark Pattern (jatin-yadav05), Dot Pattern (Magic UI) | not stated / MIT | — | listing | **Idea only**: `.bg-grid` is two CSS gradients and a mask. |
| Shader / WebGL heroes | Liquid Metal Hero, Shader Animation, Web GL Shader, … | various | three / WebGL | listing | **Rejected**: continuous GPU work and heavy JavaScript would undo the mobile performance budget. |

## Integration notes

1. **Tubelight Navbar.** Kept: the moving pill and the glowing "lamp" bar.
   - **Changed:**
     - Framer Motion's `layoutId` spring was replaced by CSS variables (`--lamp-x`, `--lamp-w`) written directly to the DOM with a CSS transition, so there are no re-renders and no extra library.
     - The active item comes from the route (`usePathname`) rather than click state.
     - Text labels stay visible at every size; the original hides them on mobile, leaving icon-only links without accessible names.
     - The blur glows became a single `box-shadow`.
   - **Tested:** keyboard focus moves the lamp, and `aria-current` marks the page (`tests/e2e/navigation.spec.ts`).
2. **Aceternity Timeline.** Kept: the vertical rail with a gradient beam that fills as you scroll.
   - **Changed:** `useScroll`/`useTransform` (Framer Motion) were replaced by a CSS scroll-driven animation: `view-timeline-name: --process` with `.beam-fill { animation-timeline: --process }`.
   - **Fallback:** where scroll timelines aren't supported, or under reduced motion, the beam is static. Content never depends on it.
3. **Magic UI Shine Border.** Adopted the technique almost directly: a radial gradient travelling across a `mask-composite: exclude` 1px frame.
   - **Changed:** it runs only while a secondary button is hovered, never continuously, and uses the cobalt token.
4. **Spotlight Card.** No licence is stated, so no code was copied.
   - **Studied:** a document-level pointer listener writes coordinates to CSS variables, and a radial-gradient border uses them.
   - **Own version:** one listener for the whole site (`MotionRuntime`), throttled to one frame. It writes *element-local* coordinates to every `.spot` card in the hovered `[data-spotlight]` group, so neighbouring cards light up by proximity. Local coordinates (not `background-attachment: fixed`) keep the light correct while cards are transformed (reveals, hover lift).
   - **Scope:** fine pointers only.

## Net dependency change

- **Added:** none.
- **Removed:** `vite-tsconfig-paths`, in the v1 tidy-up.
- **Animation libraries:** none.

The whole motion runtime is one client component: 2.9 KB minified, 1.1 KB gzipped (measured by bundling `MotionRuntime.tsx` alone with rolldown). In the production build the homepage ships 153.3 KB of gzipped JavaScript against v1's 151.4 KB, so v2's motion and navigation work added about 1.9 KB. A motion library such as Motion (Framer Motion) would typically add tens of KB to every page. Mobile LCP was already the tightest metric, and CSS covers every pattern used.
