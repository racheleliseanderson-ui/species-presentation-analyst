import { useEffect, useState } from "react";
import { normalizeTemperatureRangeF } from "@/lib/engine/temperature";
import type { TempMode } from "@/lib/engine/temp-mode";
import type { Session } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Water temperature, declared honestly.
 *
 * Three answers, because those are the three an angler actually has: measured,
 * roughly known, or unknown. A range stays a range all the way through the
 * engine — it is never collapsed to a midpoint, because a range that straddles
 * a thermal boundary is a different situation from a temperature in the middle
 * of it, and the reading says so.
 *
 * Shared by both reading modes. The full analysis used to accept only an exact
 * number, which left the advanced path with the weaker input.
 */

export function TemperatureInput({
  session,
  onPatch,
  mode,
  onModeChange,
  className,
}: {
  session: Pick<Session, "tempF" | "tempRangeF" | "tempSource">;
  onPatch: (partial: Partial<Session>) => void;
  mode: TempMode;
  onModeChange: (mode: TempMode) => void;
  className?: string;
}) {
  const [low, setLow] = useState(() => (session.tempRangeF ? String(session.tempRangeF[0]) : ""));
  const [high, setHigh] = useState(() => (session.tempRangeF ? String(session.tempRangeF[1]) : ""));

  // A range carried in from another Hook app arrives after mount.
  useEffect(() => {
    if (!session.tempRangeF) return;
    setLow(String(session.tempRangeF[0]));
    setHigh(String(session.tempRangeF[1]));
  }, [session.tempRangeF]);

  function syncRange(nextLow: string, nextHigh: string) {
    if (!nextLow.trim() || !nextHigh.trim()) {
      onPatch({ tempF: null, tempRangeF: null, tempSource: "unknown" });
      return;
    }
    const range = normalizeTemperatureRangeF([Number(nextLow), Number(nextHigh)]);
    onPatch({ tempF: null, tempRangeF: range, tempSource: range ? "estimated" : "unknown" });
  }

  function chooseMode(next: TempMode) {
    onModeChange(next);
    if (next === "unknown") onPatch({ tempF: null, tempRangeF: null, tempSource: "unknown" });
    else if (next === "exact") onPatch({ tempRangeF: null });
    else syncRange(low, high);
  }

  return (
    <div className={className}>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        Water temperature
      </span>
      <div
        className="mt-2 grid gap-2 sm:grid-cols-3"
        role="radiogroup"
        aria-label="What you know about water temperature"
      >
        {(
          [
            ["unknown", "I don't know"],
            ["exact", "I measured it"],
            ["range", "I know roughly"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            onClick={() => chooseMode(id)}
            className={cn(
              "min-h-12 rounded-[var(--radius-sm)] px-4 py-2.5 text-left text-sm shadow-[var(--shadow-border)]",
              mode === id
                ? "bg-accent text-accent-fg"
                : "bg-elevated text-fg hover:shadow-[var(--shadow-border-hover)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "exact" && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            aria-label="Measured water temperature in Fahrenheit"
            value={session.tempF ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              onPatch({
                tempF: value === "" ? null : Number(value),
                tempRangeF: null,
                tempSource: value === "" ? "unknown" : "user_measured",
              });
            }}
            placeholder="°F"
            className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-elevated px-3 font-mono text-sm text-fg shadow-[var(--shadow-border)]"
          />
          <p className="text-sm text-muted">
            Measured water temperature. Air temperature is never substituted for it.
          </p>
        </div>
      )}

      {mode === "range" && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              aria-label="Approximate low water temperature in Fahrenheit"
              value={low}
              onChange={(event) => {
                setLow(event.target.value);
                syncRange(event.target.value, high);
              }}
              placeholder="Low °F"
              className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-elevated px-3 font-mono text-sm text-fg shadow-[var(--shadow-border)]"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              inputMode="decimal"
              aria-label="Approximate high water temperature in Fahrenheit"
              value={high}
              onChange={(event) => {
                setHigh(event.target.value);
                syncRange(low, event.target.value);
              }}
              placeholder="High °F"
              className="min-h-12 w-28 rounded-[var(--radius-sm)] bg-elevated px-3 font-mono text-sm text-fg shadow-[var(--shadow-border)]"
            />
          </div>
          <p className="mt-2 text-xs text-dim">
            The range stays a range. If it crosses a thermal boundary the reading says so rather
            than averaging it into a single temperature.
          </p>
        </div>
      )}

      {mode === "unknown" && (
        <p className="mt-3 text-xs text-dim">
          Unknown is a valid answer. Temperature simply stops contributing to the ranking, and the
          reading says what it is missing.
        </p>
      )}
    </div>
  );
}
