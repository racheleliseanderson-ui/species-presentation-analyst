# Reviewed species dossiers

Authored knowledge records, one JSON file per species, each carrying the four
AFP overlays: `identification`, `behavior`, `diet`, `seasonal_calendar`.

These are the **source of record**. They are plain JSON rather than TypeScript
because they are content, not code: nothing imports them at runtime, they are
reviewed in a diff, and they are what `npm run db:seed-dossiers` loads into
`public.species_dossiers` in Supabase, which is what the app actually reads.

Editing rules live in `docs/refinement-pass-2026-09.md` and are enforced by
`npm run validate:dossiers`:

- Every claim comes from an agency or peer-reviewed source, named in `sources`.
- What is not sourced is **omitted** and named in `gaps`. `status` is `partial`
  whenever the sourcing is thin. A short honest record beats a complete
  invented one.
- Spawning is conservation context only. No spawning site, staging
  concentration or migration bottleneck is ever named.
- No locations, no bite prediction, no lure or brand names.
- `presentationImplication` may only name a presentation family the engine
  already ranks, and never appears at all for a species whose `targetStatus` is
  `conservation_sensitive` or `non_target`.

All 111 reviewed species — 75 freshwater and 36 saltwater — now carry all four
overlays. 56 of them are authored here; the other 55 still live as TypeScript
under `src/lib/knowledge/*-dossiers.ts`. Exporting those into this directory and
deleting the TypeScript is the intended next step, and would take roughly
600 KB out of the client bundle. Both the seed script and the coverage checks
already read both, with this directory winning on a collision.

Two rules are specific to the saltwater records, and matter more here than they
do in fresh water:

- **No spawning aggregation is ever described.** Grouper and snapper
  aggregations are exactly what gets fished out, so spawning appears as
  conservation context and nothing else — never as timing, never as a class of
  water to go and fish.
- **A thermal band is often simply absent.** Twelve of the 36 saltwater species
  have no published temperature figure that a review would accept, and their
  records omit `thermal` entirely rather than carry a plausible one. The reading
  says so and drops the temperature axis. Where a band exists, `basis` records
  whether it is a measured preference or merely where the fish is caught, which
  sources conflate constantly.
