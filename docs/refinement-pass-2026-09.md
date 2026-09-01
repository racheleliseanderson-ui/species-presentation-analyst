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

---

# Second pass — species knowledge moved to Supabase

You asked for the knowledge to live in the database rather than the JSON, and
for no sign-in. Both are done, and the first one was worth doing on the numbers
alone.

## There was never a sign-in to remove

`authEnabled` is `import.meta.env.VITE_AUTH_ENABLED !== "false"`, the shipped
default is `false`, and the repo has no `/login` route. Nothing gates the app
today. The dossier tables follow the same pattern your other Hook apps already
use for public reference data — a `SELECT` policy for the `anon` role — so
reading them involves no account either.

## What the bundle was costing

| | Before | After |
| --- | --- | --- |
| Largest client chunk | 647 KB (`coverage-*.js`) | 155 KB (`vocab-*.js`) |
| Total client JavaScript | 1,253 KB | 762 KB |

**−491 KB, a 39% cut.** Every visitor was downloading all 75 species — 220
dossiers, ~530 KB of JSON — in order to read one.

## Schema

Migration `species_dossiers` created:

- **`public.species_dossiers`** — `(species_id, kind)` primary key, `kind` one of
  identification / behavior / diet / seasonal_calendar. `payload` is the whole
  reviewed record as authored, so the round-trip is lossless and the app reads
  it as its existing TypeScript type; `status`, `sources`, `gaps`, `reviewed_at`,
  `next_review_at` and `model_version` are extracted alongside for indexing.
  RLS on, one policy: `select` for `anon` and `authenticated` where `published`.
- **`public.species_dossier_coverage`** — a one-row view counting how many
  species carry each overlay and how many carry all four. Declared
  `security_invoker = true`, so it enforces the caller's RLS rather than the
  creator's — the thing your security advisor currently flags on
  `public.observation_summary`, which is a Waterways object I left alone.

## Migration, and how it was verified

220 rows across 55 species loaded. Then, rather than trusting the load:

I reproduced PostgreSQL's `jsonb::text` serialisation in JavaScript (keys ordered
by byte length then bytewise, `", "` / `": "` separators) and compared an MD5
digest of every record, computed on both sides:

| Overlay | Rows | Digest | |
| --- | --- | --- | --- |
| identification | 55 | `2fda983b22c91526a556d7da829d7c60` | match |
| behavior | 55 | `acbf3b1702ca631b749dc754dc09a34f` | match |
| diet | 55 | `5750e80e4097cc6b3cf5e86667a9e782` | match |
| seasonal_calendar | 55 | `c0bbbc8c16258c9d1517c03bf5237756` | match |

All 220 dossiers round-trip identically, character count included.

`scripts/seed-dossiers.mjs` makes this repeatable. `npm run db:seed-dossiers`
prints those digests without touching anything — the fastest way to check the
repo and the database are still in step. Adding `-- --write` with `DATABASE_URL`
set re-seeds (idempotent, in a transaction) and verifies the digests afterwards.

## Read path

- `GET /api/dossiers/:speciesId` and `GET /api/dossier-coverage` read Supabase
  over PostgREST with plain `fetch` — no new dependency. Cached hard at the edge
  (`s-maxage=86400`, a week of stale-while-revalidate), because these records
  change on a review cycle measured in months.
- Deliberately **not** through the app's existing Postgres pool: that pool falls
  back to an embedded PGLite when `DATABASE_URL` is unset, and a fallback
  returning zero rows would make the app claim a research gap that does not
  exist.
- `useSpeciesOverlays()` is a ~60-line module-level cache, not a query library —
  adding a client cache framework to read this back would undo part of the point.
- The service worker caches `/api/dossiers/*` stale-while-revalidate for 90 days,
  so a species opened once stays readable when the radio drops.

**The distinction the UI now makes:** "this fish has not been reviewed yet" is a
statement this product makes on purpose; "the reviewed record could not be
loaded" is a failure. `OverlayStatus` keeps them apart, and no failure path ever
renders as a research gap.

## Configuration you need to set

`SUPABASE_URL` and `SUPABASE_ANON_KEY`, in Vercel and in a local `.env` — see the
new `.env.example`. Without them the app still runs, but every species reads as
"could not be loaded" instead of showing the seasonal and behavior layers.

## What the dossier TypeScript files are now

They are no longer imported by the running app — that is where the 491 KB went —
but they are still in the repo as the authored, diffable history and as the seed
source. `coverage.ts` and the dossier tests read them directly, which is what
keeps the authored records honest before they are loaded. Once you are happy the
database is the source of truth, deleting them is a follow-up.

## Verification

- `tsc --noEmit`, `eslint .`, `vite build`: clean.
- TypeScript suite: **135 tests, 0 failures**.
- Contrast audit: **0 failing nodes** in all three themes.
- `scripts/qa-smoke.mjs`: green, now including that the seasonal and behavior
  layers actually render reviewed content rather than a spinner or an error.
- The whole read path was exercised end-to-end against a local stand-in for the
  Supabase REST endpoint serving the same rows: both API routes, the cache
  headers, the 404 for an unknown species, and both reading modes rendering the
  reviewed content.
