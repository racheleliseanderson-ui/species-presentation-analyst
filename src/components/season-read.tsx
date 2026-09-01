import { responseRead, seasonRead } from "@/lib/engine/condition-read";
import type { OverlayState } from "@/lib/knowledge/overlays";
import type { ScenarioInput } from "@/lib/protocol/types";
import { labelOf } from "@/lib/protocol/vocab";
import { cn } from "@/lib/utils";

/**
 * Season → position, and conditions → response.
 *
 * This is the middle of the decision chain, and until now it lived only inside
 * a collapsed species-reference accordion at the bottom of the page — reviewed
 * seasonal calendars that answered "where is it and what is it eating right
 * now" were sitting one step away from the reading that needed them.
 */

export function SeasonRead({
  input,
  overlays,
  compact = false,
}: {
  input: ScenarioInput;
  overlays: OverlayState;
  compact?: boolean;
}) {
  if (overlays.status !== "ready") {
    return (
      <Shell title="Where it should be, this season">
        <p className="text-sm text-muted">{overlayNote(overlays.status)}</p>
      </Shell>
    );
  }
  const read = seasonRead(input, overlays.overlays);

  if (read.status === "no_season") {
    return (
      <Shell title="Where it should be, this season">
        <p className="text-sm text-muted">
          Season is undeclared, so the reviewed seasonal calendar is not applied and season is not
          used to rank presentations. Set a season or a trip date and this fills in.
        </p>
      </Shell>
    );
  }

  if (read.status === "no_calendar") {
    return (
      <Shell title="Where it should be, this season">
        <p className="text-sm text-muted">
          No reviewed seasonal calendar exists for this species yet. The gap stays a gap — we will
          not write one from a general-purpose model.
        </p>
      </Shell>
    );
  }

  if (read.status === "no_entry") {
    return (
      <Shell title="Where it should be, this season">
        <p className="text-sm text-fg">{read.overview}</p>
        <p className="mt-3 text-sm text-muted">
          The reviewed calendar for this species covers{" "}
          {read.covered.map((season) => labelOf(season)).join(", ")} — not the season you declared.
        </p>
      </Shell>
    );
  }

  const rows = compact ? read.rows.slice(0, 4) : read.rows;

  return (
    <Shell
      title={`Where it should be · ${labelOf(read.declared)}`}
      note={
        read.exact
          ? undefined
          : `The reviewed calendar covers this period as ${labelOf(read.matched)}. Read it as the nearest reviewed entry, not as a statement about ${labelOf(read.declared).toLowerCase()} specifically.`
      }
    >
      <p className="text-sm text-fg">{read.overview}</p>

      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map((item) => (
          <div key={item.label} className="rounded-[var(--radius-sm)] bg-subtle px-3 py-2.5">
            <dt className="font-mono text-[9px] uppercase tracking-wider text-dim">{item.label}</dt>
            <dd className="mt-1 text-sm text-fg">{item.value}</dd>
          </div>
        ))}
      </dl>

      {read.presentationImplication && (
        <p className="instrument-rule mt-4 rounded-[var(--radius-md)] bg-subtle px-4 py-3 text-sm text-fg">
          <span className="text-dim">What that implies for presentation. </span>
          {read.presentationImplication}
        </p>
      )}

      {read.conservationNote && (
        <p className="mt-3 rounded-[var(--radius-sm)] bg-subtle px-4 py-3 text-sm text-warn">
          {read.conservationNote}
        </p>
      )}

      {!compact && read.invalidators.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-[9px] uppercase tracking-wider text-dim">
            Seasonal mistakes this record calls out
          </p>
          <ul className="mt-2 space-y-1">
            {read.invalidators.map((item) => (
              <li key={item} className="text-sm text-muted">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!compact && read.sources.length > 0 && (
        <p className="mt-4 text-xs leading-5 text-dim">
          {read.sources
            .map((source) => `${source.class.replaceAll("_", " ")} · ${source.label}`)
            .join(" · ")}
        </p>
      )}
    </Shell>
  );
}

export function ResponseRead({
  input,
  overlays,
}: {
  input: ScenarioInput;
  overlays: OverlayState;
}) {
  if (overlays.status !== "ready") {
    return (
      <Shell title="What it is responding to">
        <p className="text-sm text-muted">{overlayNote(overlays.status)}</p>
      </Shell>
    );
  }
  const read = responseRead(input, overlays.overlays);
  if (read.notes.length === 0) {
    return (
      <Shell title="What it is responding to">
        <p className="text-sm text-muted">
          No reviewed behavior or diet dossier exists for this species yet, so there is nothing
          honest to say about how it responds to light, clarity or weather.
        </p>
      </Shell>
    );
  }

  return (
    <Shell title="What it is responding to">
      <ul className="space-y-3">
        {read.notes.map((note) => (
          <li key={note.id} className="border-l-2 border-line pl-3">
            <p className="font-mono text-[9px] uppercase tracking-wider text-mark">{note.trigger}</p>
            <p className="mt-1 text-sm text-fg">{note.text}</p>
          </li>
        ))}
      </ul>
      {read.unreviewed.length > 0 && (
        <p className="mt-4 text-xs leading-5 text-dim">
          Declared but not reviewed on this record: {read.unreviewed.join(" · ")}. Missing research
          stays missing.
        </p>
      )}
    </Shell>
  );
}

/**
 * A record that has not loaded is not the same claim as a record that has not
 * been researched, and this app is not allowed to blur the two.
 */
function overlayNote(status: OverlayState["status"]): string {
  return status === "loading"
    ? "Reading the reviewed record for this species…"
    : "The reviewed record could not be loaded right now. This is a connection problem, not a gap in the research — nothing is being withheld.";
}

function Shell({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6",
        className,
      )}
    >
      <h3 className="font-display text-2xl">{title}</h3>
      {note && <p className="mt-1 text-xs leading-relaxed text-dim">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}
