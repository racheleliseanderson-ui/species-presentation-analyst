# Drafting brief — Red grouper

Written 2026-09-04. This is a brief, not a record. Nothing below is sourced yet.

Scientific name as given: *Epinephelus morio*
Proposed species id: `epinephelus_morio`
Queued under: E - snapper and grouper

Why it was asked for: Gag and scamp are in; red grouper is not, and gag versus red is the identification the recreational fishery turns on.

## What it will be confused with

The identification overlay has to separate the new record from each of these in `similarSpecies`, with a distinction somebody can use with the fish in their hands. Not a list of adjectives.

- **Gag grouper** `mycteroperca_microlepis` (*Mycteroperca microlepis*) — you named it in the note, also a "grouper"
- **Scamp** `mycteroperca_phenax` (*Mycteroperca phenax*) — you named it in the note


## What the catalogue record needs

Before any dossier: the species record itself, in a dated expansion module, carrying

- `scientificName`, `commonNames`, `group`, `nativeContext`, `geographic`
- `targetStatus` — `standard`, `regulated_context`, `conservation_sensitive` or `non_target`. Decide this first. It gates everything downstream, and a conservation-sensitive or non-target record produces no presentation guidance at all.
- `thermal` — only if an agency or a paper publishes a band. If nobody does, omit it and let the reading say the temperature axis is not reviewed. Do not carry a plausible number.
- `habitat.waterTypes` from: flowing, stillwater, surf, inshore, nearshore, offshore
- holding classes for each water type it uses
- `forageClasses` from the closed list: aquatic_insects, emerging_insects, terrestrial_insects, crustaceans, small_forage_fish, larger_prey_fish, mollusks, worms_annelids, eggs, amphibians, zooplankton
- the reviewed presentation families, in baseline order, drawn only from families that already exist
- `spawning` as conservation context only — seasons and a note, never a site, a staging concentration or a migration bottleneck

## What each of the four overlays needs

Required fields, enforced by `npm run validate:dossiers`. An empty one is accepted only when `gaps` says out loud that it is missing and why.

**identification** — speciesId, status, regionalNames, bodyShape, identificationTraits, coloration, adultAppearance, similarSpecies, averageAdultLength, commonAnglingSize, typicalWeight, maximumDocumentedSize, sources, reviewedAt, nextReviewAt, gaps

**behavior** — speciesId, status, social, feedingStrategy, dielTendency, spawningBehavior, sources, reviewedAt, nextReviewAt, gaps

**diet** — speciesId, status, feedingStyle, feedingZone, primaryForage, primaryNote, observedForageRule, sources, reviewedAt, nextReviewAt, gaps

**seasonal_calendar** — speciesId, status, overview, entries, sources, reviewedAt, nextReviewAt, gaps

Seasons in the calendar come from: winter, early_spring, spring, early_summer, summer, late_summer, fall, late_fall. One entry each, no repeats.

## Presentation families that already exist

`presentationImplication` may name one of these and nothing else. A new family is a separate, reviewed change to the engine, not something a species record introduces.

- `dead_drift` — Dead drift (flowing)
- `tight_line_drift` — Tight-line drift (flowing)
- `swing` — Swing (flowing)
- `suspended_drift` — Suspended drift (flowing)
- `bottom_contact_drift` — Bottom-contact drift (flowing)
- `cross_current_retrieve` — Cross-current retrieve (flowing)
- `upstream_retrieve` — Upstream retrieve (flowing)
- `downstream_retrieve` — Downstream retrieve (flowing)
- `pulse_jig` — Pulse / jig (flowing)
- `surface_drift` — Surface drift (flowing)
- `wake_skate` — Wake / skate (flowing)
- `stationary_bait` — Stationary bait (flowing)
- `horizontal_retrieve` — Horizontal retrieve (stillwater/inshore/surf)
- `stop_and_go` — Stop-and-go (stillwater/inshore)
- `suspend_pause` — Suspend / pause (stillwater)
- `vertical_jig` — Vertical jig (stillwater/nearshore/offshore)
- `bottom_contact` — Bottom contact (stillwater/nearshore)
- `slow_drag` — Slow drag (stillwater)
- `drop_presentation` — Drop presentation (stillwater/nearshore)
- `surface_retrieve` — Surface retrieve (stillwater/inshore/surf)
- `subsurface_slow_roll` — Subsurface slow-roll (stillwater)
- `suspended_stationary` — Suspended stationary (stillwater/offshore)
- `trolling` — Trolling (stillwater/nearshore/offshore)
- `live_natural_bait_suspension` — Live / natural bait suspension (stillwater/inshore/nearshore)
- `surf_bait_soak` — Surf bait soak (surf)
- `surf_metal_cast` — Surf metal cast (surf)
- `surf_swim_retrieve` — Surf swim retrieve (surf)
- `flats_sight_cast` — Flats sight cast (inshore)
- `tidal_drift_bait` — Tidal drift bait (inshore)
- `structure_pitch` — Structure pitch (inshore)
- `dock_light_ambush` — Light-edge ambush (inshore)
- `structure_vertical` — Structure vertical (nearshore)
- `chum_established_drift` — Chum-established drift (saltwater)
- `tide_line_drift` — Tide-line drift (saltwater)
- `trolling_spread` — Trolling spread (offshore)
- `deep_drop` — Deep drop (offshore)
- `run_and_gun_cast` — Run-and-gun cast (saltwater)
- `live_bait_slow_troll` — Live-bait slow troll (saltwater)

## The rules that will fail this record if it breaks them

- Every claim comes from a named agency or peer-reviewed source. `class` is `agency`, `peer_reviewed` or `synthesis`.
- What is not sourced is omitted and named in `gaps`. `status` is `partial` whenever the sourcing is thin. A short honest record beats a complete invented one.
- No locations, no bite prediction, no lure or brand names, no frozen size, bag or season limits.
- Spawning is conservation context. No spawning site, staging concentration, aggregation or migration bottleneck is ever named — and for reef and offshore records, no aggregation is described at all.
- If `targetStatus` is `conservation_sensitive` or `non_target`, no `presentationImplication` appears anywhere in the record.
- A thermal band records in `basis` whether it is a measured preference or merely where the fish gets caught. Sources conflate the two constantly.

## Then

1. Write the species record and the four overlays.
2. `npm run validate:dossiers` until it is clean.
3. `npm test`.
4. Run REVIEW-AND-UPDATE, which checks the new citations along with everything else.

