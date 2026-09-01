import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chrome";
import { Instrument } from "@/components/instrument";
import { QuickReadV2 } from "@/components/quick-read-v2";
import { SelectedSpeciesProfile } from "@/components/species-profile";
import { NEXT_REVIEW, REVIEWED_AT } from "@/lib/protocol/vocab";
import { cn } from "@/lib/utils";
import { TripContextBar } from "@/components/trip-context-bar";

export const Route = createFileRoute("/")({ component: Home });

type ExperienceMode = "beginner" | "competent" | "advanced";

const EXPERIENCE_KEY = "hth-sp-experience-v1";

const PATHS: {
  id: ExperienceMode;
  label: string;
  description: string;
}[] = [
  {
    id: "beginner",
    label: "Beginner",
    description: "A guided reading with the next observation explained in plain language.",
  },
  {
    id: "competent",
    label: "Competent",
    description: "Build the full Water → Species → Presentation chain yourself.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Inspect assumptions, invalidators, weighting, sources, and the species dossier.",
  },
];

function Home() {
  const [mode, setMode] = useState<ExperienceMode>("beginner");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(EXPERIENCE_KEY);
      if (saved === "beginner" || saved === "competent" || saved === "advanced") {
        setMode(saved);
      }
    } catch {
      /* device storage unavailable */
    }
  }, []);

  const chooseMode = (next: ExperienceMode) => {
    setMode(next);
    try {
      window.localStorage.setItem(EXPERIENCE_KEY, next);
    } catch {
      /* device storage unavailable */
    }
  };

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a href="#main" className="skip-link">
        Skip to reading
      </a>
      <Chrome />
      <TripContextBar />

      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <section aria-labelledby="learning-path-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="learning-path-title" className="font-display text-xl text-fg">
                Choose how much of the chain you want to work
              </h2>
              <p className="mt-1 text-sm text-muted">
                Water context <span aria-hidden>→</span> <strong className="text-fg">Species</strong>{" "}
                <span aria-hidden>→</span> Presentation family <span aria-hidden>→</span> Field Ops
              </p>
            </div>
            <a
              href="https://ops.hookthehorizon.blog/"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark no-underline hover:text-fg"
            >
              Return to Field Ops
            </a>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3" aria-label="Experience pathway">
            {PATHS.map((path, index) => {
              const on = mode === path.id;
              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => chooseMode(path.id)}
                  aria-pressed={on}
                  className={cn(
                    "min-h-24 rounded-[var(--radius-md)] px-4 py-3 text-left shadow-[var(--shadow-border)]",
                    on ? "bg-accent text-accent-fg" : "bg-elevated text-fg hover:shadow-[var(--shadow-border-hover)]",
                  )}
                >
                  <span className={cn("font-mono text-[10px] uppercase tracking-[0.14em]", on ? "text-accent-fg/75" : "text-dim")}>Path {index + 1}</span>
                  <span className="mt-1 block font-display text-lg">{path.label}</span>
                  <span className={cn("mt-1 block text-xs leading-relaxed", on ? "text-accent-fg/80" : "text-muted")}>{path.description}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted">
            Your pathway changes the amount of guidance, not the biology. No pathway unlocks a bite score, hotspot, or product ranking.
          </p>
        </section>
      </div>

      {mode === "beginner" ? (
        <QuickReadV2 onOpenFull={() => chooseMode("competent")} />
      ) : (
        <Instrument />
      )}
      <SelectedSpeciesProfile />

      <footer className="border-t border-line px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Northern Lantern House Labs
            </p>
            <p className="mt-2 text-sm text-muted">Species & Presentation Analyst</p>
            <Link to="/" className="mt-2 inline-block text-sm text-muted no-underline hover:text-fg">
              Home
            </Link>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              to="/boundary"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:text-fg"
            >
              Limits &amp; sources · what this will not tell you
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
              Reviewed {REVIEWED_AT} · next review {NEXT_REVIEW} · saved on this device
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
