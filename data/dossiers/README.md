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

The 55 species drafted earlier still live as TypeScript under
`src/lib/knowledge/*-dossiers.ts`. Exporting those into this directory and
deleting the TypeScript is the intended next step; the seed script already
reads both.
