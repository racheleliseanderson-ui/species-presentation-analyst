# Species substantive refresh protocol

You are refreshing one existing Species Presentation Analyst record. This is NOT a link-checking task. The attached brief summarizes the current record and its existing sources. A URL still returning 200 does not mean the biology has been reviewed.

## Non-negotiable objective

Perform fresh web research outside the current citation set, compare the existing claims against newer or independent evidence, close justified gaps, correct stale or contradicted claims, and leave an explicit audit trail of what was searched.

Do not simply reopen the same familiar domains and advance the review date.

## Required fresh-search lanes

Search each lane independently, using the current scientific name plus any current synonyms you verify:

1. taxonomy, accepted name, synonyms and identification boundaries;
2. species-level conservation/target/regulatory context;
3. identification traits and lookalikes;
4. habitat, water type, holding, depth/current/light use and thermal biology;
5. diet, forage and feeding behavior;
6. social, diel and broader behavior;
7. seasonal movement and spawning context;
8. every currently declared gap, each with its own targeted searches.

Prefer evidence published or updated after the record's current `reviewedAt`, but use older primary literature when it remains the best species-specific evidence.

## Source-diversity rules

- Deliberately search outside the record's current domains before returning to them.
- Find at least 2 useful source domains not currently cited for this species when the evidence base permits it.
- Do not let one agency page or one paper revalidate the entire fish.
- Use government/agency sources for current taxonomy, conservation and durable species context where appropriate; use peer-reviewed literature for behavior, diet, thermal and ecological claims when available.
- Avoid tackle retailers, generic fishing blogs, SEO summaries, social posts, AI-generated pages and Wikipedia as evidentiary sources.
- Open and read sources; do not cite snippets.

## Existing claims are hypotheses to revalidate

For each catalogue field and each of the four overlays:

- retain the claim if fresh or independent evidence supports it;
- strengthen it if better evidence is available;
- narrow it if the old wording overstates the evidence;
- correct it if current evidence contradicts it;
- move it to an explicit gap if it can no longer be supported.

Do not change claims merely for novelty. The goal is current evidence, not churn.

## Gap discipline

Every existing gap gets a dedicated search. Do not preserve a gap without trying to resolve it. Do not remove a gap unless a source genuinely supports the missing field.

Before declaring a new `not found after search` gap, try at least 3 materially different queries and at least 2 source ecosystems where reasonable.

## Review-date rule

Do NOT update `reviewedAt` or `nextReviewAt` merely because old URLs still work. Advance the dates only after:

1. fresh searches were performed;
2. current claims were compared against new or independent evidence;
3. contradictions were resolved or documented;
4. all declared gaps received targeted search attempts;
5. the resulting record still passes the repository's factual and safety rules.

Use the repository's established review cadence when setting the next date.

## Safety and product rules

- Never freeze bag limits, size limits or season dates into biological records.
- Spawning is conservation context only; do not publish actionable aggregation sites, staging concentrations or migration bottlenecks.
- Conservation-sensitive and non-target species must retain fail-closed presentation behavior.
- Do not invent thermal bands or presentation implications from fishing folklore.
- Keep all enum-backed values inside the repository's closed vocabularies.

## Research ledger

Create `reports/research-ledger/<species-id>-<YYYY-MM-DD>-refresh.md` containing:

- old review date and new review date, if legitimately advanced;
- every substantive search query, grouped by lane;
- current domains deliberately checked and new domains discovered;
- useful sources with source class and fields supported;
- claims retained, strengthened, narrowed, corrected or moved to gaps;
- every existing gap and the searches attempted against it;
- unresolved contradictions;
- source-diversity summary: distinct domains, agency sources, peer-reviewed sources and newly introduced domains.

## Finish condition

Do not commit or push. The batch runner will validate and save. Before ending, inspect the catalogue record and all four overlays and confirm that the refresh was substantive rather than a citation-health pass.
