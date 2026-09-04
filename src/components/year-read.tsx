/**
 * The year at a glance, and the thermometer beside it.
 *
 * The thermal band already has a plate. What it did not have is a companion:
 * the strip puts the four seasons side by side and marks what actually moves
 * between them, which is the thing the calendar knows and has never been able
 * to say, because it is read one season at a time.
 *
 * The conflict card is the sharp one. Everywhere else in fishing software the
 * calendar and the thermometer quietly disagree and the software picks a side
 * without telling anybody. This names it, says the reading governs, and says
 * why: the thermometer describes the water you are standing in and the
 * calendar describes a typical year, which this one may not be.
 */

import { useMemo } from "react";

import {
  SEASON_LABEL,
  TRACKED_FIELDS,
  YEAR_ORDER,
  calendarConflict,
  yearRead,
} from "@/lib/engine/year-read";
import type { OverlayState } from "@/lib/knowledge/overlays";
import type { ScenarioInput, SpeciesRecord } from "@/lib/protocol/types";
import { cn } from "@/lib/utils";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)]">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The year strip                                                      */
/* ------------------------------------------------------------------ */

export function YearStrip({ speciesId, overlays }: { speciesId: string; overlays: OverlayState }) {
  const read = useMemo(
    () => (overlays.status === "ready" ? yearRead(speciesId, overlays.overlays) : null),
    [speciesId, overlays],
  );

  if (!read) {
    return (
      <Shell title="The year">
        <p className="text-sm text-muted">
          The reviewed overlays have not loaded, so the year cannot be assembled.
        </p>
      </Shell>
    );
  }

  if (read.thin) {
    return (
      <Shell title="The year">
        <p className="text-sm text-muted">
          {read.reviewedSeasons === 0
            ? "No reviewed seasonal calendar for this species. Nothing is filled in from a general-purpose model, so the year stays blank rather than plausible."
            : "One reviewed season. A year needs at least two before anything can be said about what changes between them."}
        </p>
      </Shell>
    );
  }

  return (
    <Shell title="The year, and what moves between seasons">
      {read.overview ? <p className="text-sm leading-relaxed text-muted">{read.overview}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Each reviewed field across the four seasons, with unreviewed seasons marked.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-40 pb-2 pr-3 font-normal">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  Field
                </span>
              </th>
              {YEAR_ORDER.map((season) => {
                const cell = read.cells.find((c) => c.season === season)!;
                return (
                  <th key={season} scope="col" className="pb-2 pr-3 font-normal">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-[0.14em]",
                        cell.reviewed ? "text-mark" : "text-dim line-through",
                      )}
                    >
                      {SEASON_LABEL[season]}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {TRACKED_FIELDS.map((field) => {
              const values = YEAR_ORDER.map(
                (season) => read.cells.find((c) => c.season === season)!.values[field.key],
              );
              if (values.every((v) => v == null)) return null;
              const constant = read.constants.some((c) => c.key === field.key);
              return (
                <tr key={field.key} className="border-t border-line align-top">
                  <th scope="row" className="py-2 pr-3 text-left font-normal">
                    <span className="text-[13px]">{field.label}</span>
                    {constant ? (
                      <span className="ml-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
                        holds
                      </span>
                    ) : null}
                  </th>
                  {values.map((value, i) => (
                    <td key={YEAR_ORDER[i]} className="py-2 pr-3 text-[13px] leading-snug">
                      {value ?? <span className="text-dim">—</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-2 border-t border-line pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
          Between one season and the next
        </p>
        {read.transitions.map((t) => (
          <p key={`${t.from}-${t.to}`} className="text-sm leading-relaxed text-muted">
            {t.reading}
          </p>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-dim">
        Fields are compared as the reviewers wrote them. Nothing here reads a direction out of the
        prose — "deeper on bright days" is a comparison the record makes, not a depth this app
        knows, and turning it into a number would be inventing a fish.
      </p>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* The disagreement                                                    */
/* ------------------------------------------------------------------ */

export function CalendarConflictCard({
  input,
  species,
  overlays,
}: {
  input: ScenarioInput;
  species: SpeciesRecord;
  overlays: OverlayState;
}) {
  const conflict = useMemo(
    () =>
      overlays.status === "ready" ? calendarConflict(input, species, overlays.overlays) : null,
    [input, species, overlays],
  );

  /* Silence is correct when there is nothing to compare. A card that appears
     on every reading to say "nothing to report" is a card people stop seeing. */
  if (!conflict || conflict.status === "not-enough") return null;

  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-border)]",
        conflict.status === "conflict" ? "bg-elevated ring-1 ring-warn/50" : "bg-elevated",
      )}
    >
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
        {conflict.status === "conflict"
          ? "The season and the thermometer disagree"
          : "The season and the thermometer agree"}
      </h3>
      <p className="mt-3 text-sm leading-relaxed">{conflict.reading}</p>
    </section>
  );
}
