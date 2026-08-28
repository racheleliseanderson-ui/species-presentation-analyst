import { populationProfilesForSpecies } from "@/lib/engine/population-context";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import {
  ANGLER_PROFILE_MODEL_VERSION,
  buildAnglerSpeciesProfile,
  type AnglerProfileStatus,
} from "@/lib/knowledge/angler-profile";
import { useSession } from "@/lib/store";

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

export function SelectedSpeciesProfile() {
  const session = useSession();
  const species = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;
  if (!species) return null;

  const profile = buildAnglerSpeciesProfile(species);
  const populationProfiles = populationProfilesForSpecies(
    species.id,
    session.water.waterType,
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6" aria-labelledby="species-profile-heading">
      <details className="group rounded-[var(--radius-lg)] bg-elevated shadow-[var(--shadow-border)]">
        <summary className="cursor-pointer list-none p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-mark">
                Species reference · {ANGLER_PROFILE_MODEL_VERSION}
              </p>
              <h2 id="species-profile-heading" className="mt-1 font-display text-2xl text-fg">
                Know the fish: {species.commonNames[0]}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted">
                Ten angler questions, separated into what is already reviewed, what is only partly covered, and what still needs authoritative research. This does not fill missing facts with generic AI text.
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-wider text-dim">Open profile</p>
              <p className="mt-1 text-xs text-muted">
                {profile.coverage.partial} partial · {profile.coverage.notReviewed} needs research
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
                  {populationProfiles.length} reviewed population {populationProfiles.length === 1 ? "profile is" : "profiles are"} available for this species{session.water.waterType ? " in the selected water type" : ""}: {populationProfiles.map((item) => item.label).join("; ")}.
                </p>
                <p className="mt-1 text-xs text-muted">
                  RPC-1.0 only applies one when it is explicitly declared or carried from reviewed upstream context. Geography never silently chooses it.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">
                No live RPC-1.0 population profile is registered for this species{session.water.waterType ? " in the selected water type" : ""}. The reviewed species-level model remains active without inventing regional behavior.
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {profile.sections.map((item) => (
              <details key={item.id} className="rounded-[var(--radius-md)] bg-subtle p-4 shadow-[var(--shadow-border)]">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-fg">{item.label}</p>
                      <p className="mt-0.5 text-xs text-muted">{item.question}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${statusClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </div>
                </summary>

                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-sm text-muted">{item.summary}</p>

                  {item.facts.length > 0 && (
                    <dl className="mt-4 grid gap-2">
                      {item.facts.map((fact) => (
                        <div key={`${item.id}-${fact.label}`} className="rounded-[var(--radius-sm)] bg-elevated px-3 py-2.5">
                          <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">{fact.label}</dt>
                          <dd className="mt-1 text-sm text-fg">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {item.gaps.length > 0 && (
                    <div className="mt-4">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-dim">Still needs reviewed data</p>
                      <p className="mt-1 text-xs leading-5 text-muted">{item.gaps.join(" · ")}</p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-5 text-xs leading-5 text-dim">
            The profile is a reference layer, not another required setup screen. Quick Read stays simple; Full Analysis keeps the deeper scenario controls. Current local regulations and consumption advisories remain external verification tasks until a live jurisdiction source is integrated.
          </p>
        </div>
      </details>
    </section>
  );
}
