# Refinement pass — September 2026

Everything in this pass is already applied to the working tree **except the
deletions**, which have to be run locally (see the last section). Nothing was
committed or pushed.

## 1. Generator residue removed from production

The app was still serving the Grok app-builder's platform layer even though it
deploys to Vercel on `species.hookthehorizon.blog`:

| What was shipping | Where it came from |
| --- | --- |
| A `<script src="https://grok.com/grok-app-builder/extensions.js">` injected into **every** HTML document | `grokExtensionsHeadTags()` in `scripts/grok-pwa-shared.mjs` |
| A web manifest whose `name` and `short_name` were literally **"Grok App"** | `renderWebManifest()` derived the name from the host, and only recognised `*.grok.me` hosts |
| An `og.grok.me` placeholder share-card code path, plus a pass that stripped the app's own share metas before re-adding its own | `injectGrokPwaHead()` |
| A `?install=1` link in the header that went nowhere — the middleware only served the tutorial for `?install=1&platform=ios` | `isInstallQuery()` |
| A grok.com preview bridge in the production client bundle | `<PreviewHostBridge />` in `__root.tsx` |

Replaced with a first-party layer:

- `public/manifest.webmanifest` — static, correctly named, own icon at
  `/icon-180.png` (moved out of `public/__grok/`), own theme colour.
- Share identity is now declared directly in `src/routes/__root.tsx`
  (`og:*`, `twitter:*`, canonical). Nothing rewrites it at the edge, so what is
  in that file is what link scrapers see.
- `PreviewHostBridge` is mounted behind `import.meta.env.DEV`, so it still works
  when you run `npm run dev` inside a preview pane but ships nothing to
  production.
- `serverDir: "./server"` removed from the Nitro config along with the
  middleware it existed for.

Verified: `grep -ril grok .vercel/output/` returns nothing after a build.

Left alone deliberately: `better-auth` / `app-data` / `pglite` plumbing and
`.grok/app-env.json` (it drives `VITE_AUTH_ENABLED`, which the auth-invariant
check enforces). Untangling those is its own pass.

## 2. One appearance control

`src/components/appearance-control.tsx` is now the only appearance control in
the app, floating in the lower-right, mounted once in the root document. The
header radio group is gone.

Four themes became three: **Dark**, **Light**, **Color-safe**. `atelier` and
`bw` are migrated forward from local storage (`atelier → light`, `bw →
colorsafe`) in both `theme.ts` and the pre-paint boot script, so nobody's stored
choice resets or flashes.

Color-safe is a real accessibility mode, not a fourth decorative theme: high
contrast, and blue / orange / teal rather than red / green so the three status
colours stay separable under protanopia, deuteranopia and tritanopia.

### Contrast fixes

An audit of every text node in all three themes found `--fg-subtle`
(`text-dim`) failing WCAG AA — at the 9–12px mono labels where it matters most:

| Token | Was | Worst ratio | Now | Worst ratio |
| --- | --- | --- | --- | --- |
| dark `--fg-subtle` | `#7a7668` | 3.73:1 | `#8a8676` | 4.65:1 |
| light `--fg-subtle` | `#7a7568` | 3.52:1 | `#656156` | 4.74:1 |
| light `--mark` | `#8a7348` | 3.48:1 | `#735f3c` | 4.69:1 |

All three themes now report **0 failing nodes**.

## 3. The decision chain

Species → Season → Water temperature → Water type → Holding water → Forage →
Presentation → Tackle.

The reviewed seasonal-calendar, behavior and diet dossiers — roughly 7,000 lines
of researched material — were only reachable inside a collapsed
"Know the fish" accordion at the bottom of the page. They now drive the reading:

- **`src/lib/engine/condition-read.ts`** — `seasonRead()` answers *where should
  it be this season* from the reviewed calendar (holding water, depth, movement,
  feeding, forage, thermal context, current, cover, light, plus the entry's own
  presentation implication and invalidators). `responseRead()` answers *what is
  it responding to*, and only for conditions actually declared.
  - Seasons the calendars do not carry (`early_spring`, `early_summer`,
    `late_summer`) fall back to the nearest reviewed entry **and say so** rather
    than presenting a borrowed entry as if it named that season.
- **`src/components/tackle-requirements.tsx`** — the engine has always computed
  `equipment` and `connection`; `connection` was never rendered anywhere and
  `equipment` appeared as four unexplained words. Now it is a section that says
  what each requirement means and why it follows from the presentation.
- **`src/lib/engine/alternatives.ts`** + `alternatives-panel.tsx` — the ordered
  fallback plan, cheapest change first: next family → untried reviewed holding
  classes → time of day (from the reviewed diel note) → third family → go and
  measure what is unknown. Every move is assembled from existing records; no new
  family, location or tactic is invented.

## 4. Cross-app handoffs

`src/components/handoffs.tsx` is now the single handoff surface, used by **both**
reading modes. Quick Read previously had none at all, and nothing anywhere
handed off to Waterways.

Each destination states the job it takes over rather than just naming an app:
Waterways (back one step — water), Hatch Match (forage), Tackle Link, Rig Signal,
Knot Analyst, Field Ops. Same packet, same check-before-sending dialog, same
guarantee about what does not travel, from either mode.

## 5. Pathways

`beginner` / `competent` / `advanced` previously rendered *identically* for the
last two. `advanced` now opens the evidence layers (positioning, forage,
weighting trace and sources) instead of folding them away, and the three cards
describe what actually differs.

## 6. Other fixes

- `src/components/quick-read.tsx` (542 lines) was dead — nothing imported it.
- `BuyMeACoffeeWidget.tsx` → `support-link.tsx`; inline styles became theme
  tokens, and it keeps clear of the floating control.
- `trip-context-bar.tsx` showed a *second* notion of skill level (derived from
  saved-reading count) directly above the pathway selector, where the two could
  disagree. It now shows the chain itself — 4 links, what is declared, what is
  not.
- Two stale tests that failed on a clean checkout are fixed:
  - the image library asserted a hard-coded count of 15 (it holds 19) and that
    every image belonged to expansion 04 (brown trout, rainbow, largemouth and
    pike are core-catalog). Both assertions are now derived; the source
    allow-list additionally requires a stock asset to carry
    `identificationBasis: "visual_review"` and a recorded licence.
  - `topWeightTrace` in `infer.ts` was computed and thrown away; it is now part
    of the trace.
- `scripts/qa-smoke.mjs` — drives a running preview: one appearance control,
  three modes, both reading modes, all six handoffs carrying a packet with no
  coordinates, touch-target size, no horizontal scroll, no overlap between the
  floating control and the sticky mobile bar. Run it with
  `npx vite preview & node scripts/qa-smoke.mjs`.
- No language selector, translation switch or multilingual code exists anywhere
  in the repo — nothing to remove.

## Verification

`tsc --noEmit`, `eslint .`, `vite build` and the TypeScript test suite
(135 tests) are all clean. Five `scripts/**/*.test.mjs` tests fail in a bare
clone because they read the git-ignored `.grok/` directory; they should pass on
your machine.

## Deletions to run locally

These files were removed in the reviewed working tree but could not be deleted
remotely. From the repo root:

```powershell
git rm -r --cached public/__grok
Remove-Item -Recurse -Force public/__grok
git rm .write-test-tmp `
  scripts/brand-check.mjs scripts/brand-check.test.mjs `
  scripts/grok-pwa-plugin.mjs scripts/grok-pwa-plugin.test.mjs `
  scripts/grok-pwa-shared.mjs scripts/grok-pwa-shared.d.mts `
  scripts/install-page.html `
  server/middleware/grok-pwa.ts server/virtual-grok-og-identity.d.ts `
  src/components/BuyMeACoffeeWidget.tsx src/components/quick-read.tsx
```

`server/` is then empty and can go too. The build will fail until these are
gone, because `vite.config.ts` no longer imports the Grok plugin.
