import { useEffect, useState } from "react";
import { Fish, Thermometer, Waves, Wind } from "lucide-react";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { labelOf } from "@/lib/protocol/vocab";
import { loadScenarios, useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The chain, as it currently stands, above whichever reading mode is open.
 *
 * It shows what has actually been declared rather than a separate idea of the
 * angler's skill level — the pathway selector directly below already owns that,
 * and two competing "levels" on one screen only ever disagreed with each other.
 */

type LinkState = { label: string; value: string; declared: boolean };

export function TripContextBar() {
  const session = useSession();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    session.hydrate();
    setSavedCount(loadScenarios().length);
    // Read once on mount by design: this bar then re-renders from the session
    // store, which is the live source for everything below.
  }, []);

  const species = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;
  const waterName = session.water.waterName?.trim();
  const holding = session.waterType === "flowing" ? session.holdingRiver : session.holdingStill;

  const links: (LinkState & { icon: typeof Waves })[] = [
    {
      icon: Waves,
      label: "01 · Water",
      value: waterName || labelOf(session.waterType),
      declared: Boolean(session.water.waterType),
    },
    {
      icon: Fish,
      label: "02 · Species",
      value: species?.commonNames[0] ?? "Not chosen",
      declared: Boolean(species),
    },
    {
      icon: Thermometer,
      label: "03 · Season & temperature",
      value: [
        session.season === "unknown" ? null : labelOf(session.season),
        session.tempF != null
          ? `${session.tempF}°F`
          : session.tempRangeF
            ? `${session.tempRangeF[0]}–${session.tempRangeF[1]}°F`
            : null,
      ]
        .filter(Boolean)
        .join(" · ") || "Not declared",
      declared: session.season !== "unknown" || session.tempF != null || session.tempRangeF != null,
    },
    {
      icon: Wind,
      label: "04 · Holding water",
      value: holding ? labelOf(holding) : "Not declared",
      declared: Boolean(holding),
    },
  ];

  const declared = links.filter((link) => link.declared).length;

  return (
    <section className="no-print mx-auto max-w-6xl px-4 pt-5 sm:px-6" aria-label="Active trip context">
      <div className="rounded-[var(--radius-sm)] bg-elevated shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg">
            <span className="text-mark">Active trip</span>
            <span className="mx-2 text-dim">·</span>
            {declared} of {links.length} links declared
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
            {savedCount} saved reading{savedCount === 1 ? "" : "s"} on this device
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link, index) => {
            const Icon = link.icon;
            const hinge = index === 1;
            return (
              <li
                key={link.label}
                className={cn(
                  "flex items-center gap-3 border-b border-line px-4 py-3.5 last:border-b-0 sm:border-b-0",
                  index > 0 && "lg:border-l lg:border-line",
                  index === 1 && "sm:border-l sm:border-line",
                  index === 3 && "sm:border-l sm:border-line",
                  hinge && "bg-accent/5",
                )}
              >
                <Icon
                  className={cn("size-4 shrink-0", link.declared ? "text-mark" : "text-dim")}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-mono text-[9px] uppercase tracking-[0.14em]",
                      hinge ? "text-mark" : "text-dim",
                    )}
                  >
                    {link.label}
                    {hinge ? " · the hinge" : ""}
                  </p>
                  <p
                    className={cn(
                      "mt-1 truncate text-sm",
                      link.declared ? "text-fg" : "text-dim",
                    )}
                    title={link.value}
                  >
                    {link.value}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
