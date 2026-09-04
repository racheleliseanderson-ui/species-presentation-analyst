# Species acquisition research protocol

You are adding one genuinely new fish to the Species Presentation Analyst repository. The attached research brief is only an editorial hypothesis and a schema guide. Treat every factual statement in `why`, every proposed scientific name, and every proposed lookalike as unverified until a current authoritative source supports it.

## Non-negotiable objective

Do not merely write a plausible record and do not recycle the same familiar pages. Perform fresh web research, then add the species record and all four dossier overlays with the fullest evidence-backed coverage the repository can honestly support.

## Search breadth requirements

You MUST use web search and web fetch tools. Search each lane separately rather than asking one broad question and letting one page answer everything:

1. accepted taxonomy, scientific-name authority, synonyms, common names and identification boundaries;
2. species-level conservation/target/regulatory context;
3. identification traits, body shape, coloration, adult appearance, size evidence and field-confusion species;
4. habitat, water types, depth/current/light use and holding behavior;
5. thermal evidence, distinguishing preference from distribution or capture temperature;
6. diet, prey/forage classes, feeding zone and feeding modes;
7. social, diel and broader behavior;
8. seasonal movement and spawning context without actionable aggregation locations;
9. presentation implications supported by the ecology and limited to presentation families that already exist in the engine.

Search the scientific name, reviewed synonyms, and common names. Search agency and literature ecosystems independently.

## Source-diversity rules

- Aim for at least 4 distinct source domains for a complete new species, unless the evidence base is unusually narrow.
- Use at least 2 agency/government sources when they exist and at least 2 peer-reviewed papers when relevant papers are accessible.
- Discover at least 2 useful domains that are not simply the repository's most frequently reused domains or the domains already attached to the nearest lookalikes.
- No single domain should carry the entire record. A comprehensive agency monograph may support several related fields, but it does not replace independent checks for taxonomy, behavior, diet, thermal biology and seasonality.
- Prefer primary agencies, peer-reviewed papers, university/museum references, NOAA/USGS/USFWS or equivalent jurisdictional authorities. Do not use tackle retailers, generic fishing blogs, SEO species summaries, social posts, AI-generated pages or Wikipedia as evidentiary sources.
- Do not cite a search-result snippet. Open the source and verify what it actually says.

## Completion matrix

Every required catalogue and dossier field must end in exactly one of these states:

- **supported** — populated from evidence and cited;
- **not applicable** — structurally inapplicable to the species and explained;
- **not found after search** — left empty only after targeted attempts and explicitly named in `gaps`.

A field may not become a gap after one failed search. Before declaring `not found`, try at least 3 materially different queries and at least 2 source ecosystems where reasonable, such as agency + literature.

Do not create false completeness. If the evidence is genuinely absent or contradictory, preserve that uncertainty. But do not use `gaps` as a shortcut around research.

## Repository work

1. Read the species schema, vocabularies, current expansion modules, aliases and several nearby high-quality species records before editing.
2. Resolve taxonomy and target status first because those choices gate downstream presentation guidance.
3. Add the catalogue species record in the repository's current expansion pattern and wire it into the catalogue if required.
4. Add all four dossier overlays in `data/dossiers/<species-id>.json` unless the repository's current pattern clearly requires another home.
5. Add only sourced aliases/common names. Do not manufacture aliases from the editorial brief.
6. Keep presentation families inside the existing closed vocabulary. Do not create a new presentation family as part of a species addition.
7. For conservation-sensitive or non-target species, preserve the repository's fail-closed behavior and do not add presentation guidance where the schema forbids it.
8. Never freeze current bag limits, size limits or season dates into biological records. Record only durable species-level regulatory or conservation context.
9. Spawning is conservation context only. Do not name spawning sites, staging concentrations, migration bottlenecks, reef aggregations or other actionable concentration locations.
10. Update `reviewedAt` and `nextReviewAt` using the repository's established cadence only after the substantive research is complete.

## Research ledger

Create `reports/research-ledger/<species-id>-<YYYY-MM-DD>-new.md` containing:

- scientific name and synonyms searched;
- every substantive search query used, grouped by research lane;
- useful sources found with domain, source class and what fields they support;
- discarded sources and why they were rejected when that decision matters;
- a field-by-field completion matrix: supported / not applicable / not found after search;
- unresolved contradictions;
- every remaining gap and the searches attempted before leaving it open;
- a short source-diversity summary: distinct domains, agency sources, peer-reviewed sources, and which domains were new relative to the existing catalogue.

This ledger is provenance for the research process. It is not a substitute for citations in the record itself.

## Finish condition

Do not commit or push. The batch runner will validate and save after you finish. Before ending your turn, inspect your edits and confirm that the species record plus all four overlays exist and that no required field was silently skipped.
