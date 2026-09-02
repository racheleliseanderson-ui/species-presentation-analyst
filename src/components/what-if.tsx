import { ChipGroup } from "@/components/chips";
import { Button } from "@/components/ui/button";
import { populationProfilesForSpecies } from "@/lib/engine/population-context";
import { declareHolding, declaredHolding, reviewedHoldingFor } from "@/lib/engine/water";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import {
  CLARITY,
  FORAGE_CLASSES,
  LIGHT,
  labelOf,
  type ForageClass,
  type AnyHolding,
} from "@/lib/protocol/vocab";
import type { Session } from "@/lib/store";

const LIGHT_OPTS = LIGHT.filter((id) => id !== "unknown").map((id) => ({
  id,
  label: labelOf(id),
}));
const CLARITY_OPTS = CLARITY.filter((id) => id !== "unknown").map((id) => ({
  id,
  label: labelOf(id),
}));
const FORAGE_QUICK: ForageClass[] = [
  "aquatic_insects",
  "emerging_insects",
  "small_forage_fish",
  "larger_prey_fish",
];

export function WhatIf({
  session,
  onPatch,
}: {
  session: Session;
  onPatch: (partial: Partial<Session>) => void;
}) {
  const species = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;
  // The classes this species is reviewed for in the water actually being
  // fished. Reading the two freshwater lists directly left a saltwater what-if
  // with no holding-water control at all.
  const holdings = species ? reviewedHoldingFor(species, session.waterType) : [];
  const populationProfiles = session.speciesId
    ? populationProfilesForSpecies(session.speciesId, session.waterType)
    : [];

  return (
    <section className="no-print rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6">
      <h3 className="font-display text-2xl">Change one thing</h3>
      <p className="mt-1 text-sm text-muted">
        The reading updates immediately. Same reviewed biology, different inputs — not a fresh guess.
      </p>
      <div className="mt-5 space-y-5">
        {populationProfiles.length > 0 && (
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Regional / population context
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onPatch({ populationContext: null })}
                className={`min-h-11 rounded-[var(--radius-sm)] px-3 text-sm shadow-[var(--shadow-border)] ${
                  !session.populationContext ? "bg-accent text-accent-fg" : "bg-subtle text-fg"
                }`}
              >
                Generic species record
              </button>
              {populationProfiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() =>
                    onPatch({
                      populationContext: {
                        profileId: profile.id,
                        source: "user_declared",
                      },
                    })
                  }
                  className={`min-h-11 rounded-[var(--radius-sm)] px-3 text-sm shadow-[var(--shadow-border)] ${
                    session.populationContext?.profileId === profile.id
                      ? "bg-accent text-accent-fg"
                      : "bg-subtle text-fg"
                  }`}
                >
                  {profile.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-dim">
              Optional population context. It is never inferred from a water name, a jurisdiction, or coordinates; choose only a profile you recognize.
            </p>
          </div>
        )}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            Water temperature
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              disabled={session.tempF == null}
              onClick={() =>
                session.tempF != null && onPatch({ tempF: session.tempF - 6 })
              }
            >
              −6°F
            </Button>
            <input
              type="number"
              inputMode="decimal"
              aria-label="Water temperature in Fahrenheit"
              value={session.tempF ?? ""}
              onChange={(e) =>
                onPatch({
                  tempF: e.target.value === "" ? null : Number(e.target.value),
                  tempSource:
                    session.tempSource === "unknown" && e.target.value !== ""
                      ? "user_measured"
                      : session.tempSource,
                })
              }
              placeholder="°F"
              className="min-h-11 w-24 rounded-[var(--radius-sm)] bg-subtle px-3 font-mono text-sm text-fg shadow-[var(--shadow-border)]"
            />
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              disabled={session.tempF == null}
              onClick={() =>
                session.tempF != null && onPatch({ tempF: session.tempF + 6 })
              }
            >
              +6°F
            </Button>
          </div>
        </div>
        <ChipGroup
          legend="Light"
          value={session.light}
          onChange={(light) => onPatch({ light })}
          options={LIGHT_OPTS}
          columns={4}
        />
        <ChipGroup
          legend="Clarity"
          value={session.clarity}
          onChange={(clarity) => onPatch({ clarity })}
          options={CLARITY_OPTS}
          columns={3}
        />
        {holdings.length > 0 && (
          <ChipGroup
            legend="Holding-water class"
            value={declaredHolding(session)}
            onChange={(id) => onPatch(declareHolding(session.waterType, id as AnyHolding))}
            options={holdings.map((id) => ({ id, label: labelOf(id) }))}
            columns={3}
          />
        )}
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            Observed forage
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onPatch({ forage: null })}
              className={`min-h-11 rounded-[var(--radius-sm)] px-3 text-sm shadow-[var(--shadow-border)] ${
                !session.forage ? "bg-accent text-accent-fg" : "bg-subtle text-fg"
              }`}
            >
              Not observed
            </button>
            {FORAGE_QUICK.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  onPatch({ forage: { class: id, source: "user_observation" } })
                }
                className={`min-h-11 rounded-[var(--radius-sm)] px-3 text-sm shadow-[var(--shadow-border)] ${
                  session.forage?.class === id ? "bg-accent text-accent-fg" : "bg-subtle text-fg"
                }`}
              >
                {labelOf(id)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-dim">
            {FORAGE_CLASSES.length} classes exist; these four change the ranking most. Hatch Match can carry a forage observation here.
          </p>
        </div>
      </div>
    </section>
  );
}
