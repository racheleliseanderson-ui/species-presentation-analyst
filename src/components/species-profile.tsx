import { populationProfilesForSpecies } from "@/lib/engine/population-context";
import { completeOverlayCount, overlayPresence } from "@/lib/knowledge/overlays";
import { useDossierCoverage, useSpeciesOverlays } from "@/lib/knowledge/use-species-overlays";
import { SPECIES, SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import {
  buildAnglerSpeciesProfile,
  type AnglerProfileFact,
  type AnglerProfileStatus,
} from "@/lib/knowledge/angler-profile";
import { useSession } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { speciesSlug } from "@/lib/knowledge/species-slug";

function statusLabel(status: AnglerProfileStatus): string {
  if (status === "reviewed") return "Reviewed";
  if (status === "partial") return "Partial";
  return "Needs research";
}

function statusClass(status: AnglerProfileStatus): string {
  if (status === "reviewed") return "bg-subtle text-fg";
  if (status === "partial") return "bg-elevated text-muted";
  return "bg-bg text-dim";
}

function factsByKind(facts: AnglerProfileFact[], kind: AnglerProfileFact["kind"]) {
  return facts.filter((fact) => (fact.kind ?? "default") === kind);
}

function FactList({ facts }: { facts: AnglerProfileFact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="mt-4 grid gap-2">
      {facts.map((fact) => (
        <div
          key={`${fact.label}-${fact.value.slice(0, 24)}`}
          className="rounded-[var(--radius-sm)] bg-elevated px-3 py-2.5"
        >
          <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">{fact.label}</dt>
          <dd className="mt-1 text-sm text-fg">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SelectedSpeciesProfile() {
  const session = useSession();
  const species = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;
  // Hooks run before the early return so their order never depends on whether a
  // species happens to be selected.
  const { status, overlays } = useSpeciesOverlays(session.speciesId);
  const coverage = useDossierCoverage(SPECIES.length);
  if (!species) return null;

  const profile = buildAnglerSpeciesProfile(species, overlays);
  const knowledge = overlayPresence(overlays);
  const overlayComplete = completeOverlayCount(knowledge);
  const populationProfiles = populationProfilesForSpecies(species.id, session.water.waterType);

  return (
    <section
      className="no-print mx-auto max-w-6xl px-4 pb-10 sm:px-6"
      aria-labelledby="species-profile-heading"
    >
      <details className="group rounded-[var(--radius-lg)] bg-elevated shadow-[var(--shadow-border)]">
        <summary className="cursor-pointer list-none p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-mark">
                Species reference
              </p>
              <h2 id="species-profile-heading" className="mt-1 font-display text-2xl text-fg">
                Know the fish: {species.commonNames[0]}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted">
                Ten angler questions, separated into what is already reviewed, what is only partly
                covered, and what still needs authoritative research. This does not fill missing
                facts with generic AI text.
              </p>
              <Link
                to="/species/$speciesId"
                params={{ speciesId: speciesSlug(species) }}
                onClick={(event) => event.stopPropagation()}
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-fg underline decoration-mark decoration-2 underline-offset-4"
              >
                Open the {species.commonNames[0]} record on its own page
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-2 text-xs text-dim">
                {status === "loading"
                  ? "Loading the reviewed record for this fish…"
                  : status === "unavailable"
                    ? "The reviewed record could not be loaded right now. That is a connection problem, not a gap in the research — nothing below is missing on purpose."
                    : overlayComplete === 4
                      ? `Identification, behavior, diet, and season are reviewed for this fish.${coverage.status === "ready" ? ` Catalog-wide: ${coverage.coverage.completeOverlays} of ${coverage.speciesTotal} species have that full overlay set.` : ""}`
                      : `This fish still has visible knowledge gaps (${overlayComplete} of 4 overlays).${coverage.status === "ready" ? ` Catalog-wide: ${coverage.coverage.completeOverlays} of ${coverage.speciesTotal} species are fully overlaid.` : ""} Missing research stays missing.`}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-wider text-dim">
                Open profile
              </p>
              <p className="mt-1 text-xs text-muted">
                {profile.coverage.reviewed} reviewed · {profile.coverage.partial} partial ·{" "}
                {profile.coverage.notReviewed} needs research
              </p>
            </div>
          </div>
        </summary>

        <div className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
          <div className="rounded-[var(--radius-md)] bg-subtle p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-dim">
              Regional / population context
            </p>
            {populationProfiles.length > 0 ? (
              <>
                <p className="mt-2 text-sm text-fg">
                  {populationProfiles.length} reviewed population{" "}
                  {populationProfiles.length === 1 ? "profile is" : "profiles are"} available for
                  this species{session.water.waterType ? " in the selected water type" : ""}:{" "}
                  {populationProfiles.map((item) => item.label).join("; ")}.
                </p>
                <p className="mt-1 text-xs text-muted">
                  A named population is used only when you declare it, or when it is carried from a
                  reviewed upstream reading. Geography never silently chooses it.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">
                No extra population context is registered for this species
                {session.water.waterType ? " in the selected water type" : ""}. The reviewed
                species-level reading remains active without inventing regional behavior.
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {profile.sections.map((item) => {
              const defaults = factsByKind(item.facts, "default");
              const traits = factsByKind(item.facts, "trait");
              const comparisons = factsByKind(item.facts, "comparison");
              const seasons = factsByKind(item.facts, "season");
              const lifeStages = factsByKind(item.facts, "life_stage");
              const sources = factsByKind(item.facts, "source");

              return (
                <details
                  key={item.id}
                  className="rounded-[var(--radius-md)] bg-subtle p-4 shadow-[var(--shadow-border)]"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-fg">{item.label}</p>
                        <p className="mt-0.5 text-xs text-muted">{item.question}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${statusClass(item.status)}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </div>
                  </summary>

                  <div className="mt-4 border-t border-line pt-4">
                    <p className="text-sm text-muted">{item.summary}</p>

                    <FactList facts={defaults} />

                    {traits.length > 0 && (
                      <details className="mt-4 rounded-[var(--radius-sm)] bg-elevated px-3 py-2.5">
                        <summary className="cursor-pointer list-none">
                          <p className="font-mono text-[9px] uppercase tracking-wider text-dim">
                            Diagnostic traits · {traits.length}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Open for the field characters used to tell this fish apart.
                          </p>
                        </summary>
                        <ul className="mt-3 grid gap-2">
                          {traits.map((trait) => (
                            <li key={trait.label} className="text-sm text-fg">
                              {trait.value}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}

                    {comparisons.length > 0 && (
                      <details className="mt-3 rounded-[var(--radius-sm)] bg-elevated px-3 py-2.5">
                        <summary className="cursor-pointer list-none">
                          <p className="font-mono text-[9px] uppercase tracking-wider text-dim">
                            Tell it apart · {comparisons.length}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Similar species and the reviewed characters that separate them.
                          </p>
                        </summary>
                        <dl className="mt-3 grid gap-3">
                          {comparisons.map((fact) => (
                            <div key={fact.label}>
                              <dt className="text-sm font-medium text-fg">
                                {fact.label.replace("Distinguish from ", "")}
                              </dt>
                              <dd className="mt-1 text-sm text-muted">{fact.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    )}

                    {seasons.length > 0 && (
                      <details className="mt-3 rounded-[var(--radius-sm)] bg-elevated px-3 py-2.5">
                        <summary className="cursor-pointer list-none">
                          <p className="font-mono text-[9px] uppercase tracking-wider text-dim">
                            By season · {seasons.length}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Broad seasonal progression. Spawning aggregations stay out of targeting
                            guidance.
                          </p>
                        </summary>
                        <dl className="mt-3 grid gap-3">
                          {seasons.map((fact) => (
                            <div key={`${item.id}-${fact.label}`}>
                              <dt className="text-sm font-medium text-fg">{fact.label}</dt>
                              <dd className="mt-1 text-sm text-muted">{fact.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    )}

                    {lifeStages.length > 0 && (
                      <details className="mt-3 rounded-[var(--radius-sm)] bg-elevated px-3 py-2.5">
                        <summary className="cursor-pointer list-none">
                          <p className="font-mono text-[9px] uppercase tracking-wider text-dim">
                            Life stage · {lifeStages.length}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            What younger and older fish typically eat when those data exist.
                          </p>
                        </summary>
                        <dl className="mt-3 grid gap-3">
                          {lifeStages.map((fact) => (
                            <div key={fact.label}>
                              <dt className="text-sm font-medium text-fg">{fact.label}</dt>
                              <dd className="mt-1 text-sm text-muted">{fact.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    )}

                    {sources.length > 0 && (
                      <p className="mt-4 text-xs leading-5 text-dim">
                        {sources.map((source) => source.value).join(" · ")}
                      </p>
                    )}

                    {item.gaps.length > 0 && (
                      <div className="mt-4">
                        <p className="font-mono text-[9px] uppercase tracking-wider text-dim">
                          Still needs reviewed data
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted">{item.gaps.join(" · ")}</p>
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>

          <p className="mt-5 text-xs leading-5 text-dim">
            The profile is a reference layer, not another required setup screen. Quick Read stays
            simple; Full Analysis keeps the deeper scenario controls. Current local regulations and
            consumption advisories remain external verification tasks until a live jurisdiction
            source is integrated.
          </p>
        </div>
      </details>
    </section>
  );
}
