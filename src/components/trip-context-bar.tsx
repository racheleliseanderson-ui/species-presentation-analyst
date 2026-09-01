import { useEffect, useState } from "react";
import { ArrowRight, Fish, Waves } from "lucide-react";
import { SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { labelOf } from "@/lib/protocol/vocab";
import { loadScenarios, useSession } from "@/lib/store";

export function TripContextBar() {
  const session = useSession();
  const [savedCount, setSavedCount] = useState(0);
  useEffect(() => {
    session.hydrate();
    setSavedCount(loadScenarios().length);
  }, []);

  const species = session.speciesId ? SPECIES_BY_ID[session.speciesId] : null;
  const waterName = session.water.waterName?.trim();
  const level = savedCount >= 5 ? "advanced" : savedCount >= 2 ? "competent" : "beginner";

  return (
    <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6" aria-label="Active trip context">
      <div className="rounded-[var(--radius-sm)] bg-elevated shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg">
            <span className="text-mark">Active trip</span>
            <span className="mx-2 text-dim">·</span>
            {waterName || "Water not named"}
            <span className="mx-2 text-dim">·</span>
            {species?.commonNames[0] || "Species not named"}
            <span className="mx-2 text-dim">·</span>
            {labelOf(session.season)}
          </p>
          <a
            href="https://ops.hookthehorizon.blog/"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark no-underline hover:text-fg"
          >
            Return to Field Ops →
          </a>
        </div>

        <div className="grid md:grid-cols-[0.8fr_1.4fr_0.8fr]">
          <div className="flex items-center gap-3 px-4 py-4 text-muted">
            <Waves className="size-4 shrink-0 text-mark" />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">01 · Water</p>
              <p className="mt-1 text-sm">{waterName || labelOf(session.waterType)}</p>
            </div>
            <ArrowRight className="ml-auto hidden size-3.5 text-dim md:block" />
          </div>
          <div className="flex items-center gap-3 border-y border-line bg-accent/5 px-4 py-4 md:border-x md:border-y-0">
            <Fish className="size-5 shrink-0 text-mark" />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-mark">02 · Species · the hinge</p>
              <p className="mt-1 font-display text-lg text-fg">
                {species?.commonNames[0] || "Know the fish before choosing the system"}
              </p>
            </div>
            <ArrowRight className="ml-auto hidden size-3.5 text-mark md:block" />
          </div>
          <div className="px-4 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">03 · Presentation</p>
            <p className="mt-1 text-sm text-muted">
              {session.step === "readout" ? "Reading ready" : "Follows the species read"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.13em] text-dim">
          <span className={level === "beginner" ? "text-mark" : ""}>Beginner · notice</span>
          <span className={level === "competent" ? "text-mark" : ""}>Competent · compare</span>
          <span className={level === "advanced" ? "text-mark" : ""}>Advanced · predict</span>
          <span className="ml-auto">{savedCount} saved reading{savedCount === 1 ? "" : "s"} on this device</span>
        </div>
      </div>
    </section>
  );
}
