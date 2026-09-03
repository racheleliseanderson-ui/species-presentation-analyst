import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chrome";
import { ConnectionStatus } from "@/components/connection-status";
import { Instrument } from "@/components/instrument";
import { QuickReadV2 } from "@/components/quick-read-v2";
import { SelectedSpeciesProfile } from "@/components/species-profile";
import { NEXT_REVIEW, REVIEWED_AT } from "@/lib/protocol/vocab";
import { resolveSpeciesRef } from "@/lib/knowledge/species-slug";
import { SPECIES } from "@/lib/knowledge/species-catalog";
import { SITE_ORIGIN, canonicalFor } from "@/lib/site";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";
import { TripContextBar } from "@/components/trip-context-bar";

/**
 * `?species=<slug>` preselects a fish.
 *
 * It is how a species page opens the reading: the reader has already decided
 * what they are fishing for, and making them find it again in a search box is
 * the kind of small tax that ends a session. The parameter is validated against
 * the catalog, so an unknown value leaves the reading where it was rather than
 * clearing it.
 *
 * `canonicalFor("/")` drops the search string on purpose. This is one document
 * with a preselected field, not a hundred and eleven copies of the home page.
 */
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { species?: string } => {
    const value = typeof search.species === "string" ? search.species : "";
    return value ? { species: value.slice(0, 80) } : {};
  },
  head: () => ({
    meta: [
      { property: "og:url", content: `${SITE_ORIGIN}/` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ],
    links: [{ rel: "canonical", href: canonicalFor("/") }],
  }),
  component: Home,
});

export type ExperienceMode = "beginner" | "competent" | "advanced";

const EXPERIENCE_KEY = "hth-sp-experience-v1";

const PATHS: {
  id: ExperienceMode;
  label: string;
  description: string;
}[] = [
  {
    id: "beginner",
    label: "Beginner",
    description:
      "One screen. Answer what you know, get the presentation, and the app asks for more only when it would change the answer.",
  },
  {
    id: "competent",
    label: "Competent",
    description:
      "Build the chain yourself — water, conditions, holding water — and compare families against each other.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description:
      "Everything competent has, with the weighting trace, sources and positioning evidence opened rather than folded away.",
  },
];

function Home() {
  const [mode, setMode] = useState<ExperienceMode>("beginner");
  const { species: requestedSpecies } = Route.useSearch();
  const session = useSession();
  const { hydrate, patch } = session;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!requestedSpecies) return;
    const ref = resolveSpeciesRef(requestedSpecies);
    if (!ref) return;
    patch({ speciesId: ref.species.id, step: "water" });
  }, [requestedSpecies, patch]);

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
      <ConnectionStatus />
      <TripContextBar />

      <div className="no-print mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <section aria-labelledby="learning-path-title">
          <h2 id="learning-path-title" className="font-display text-xl text-fg">
            Choose how much of the chain you want to work
          </h2>
          <p className="mt-1 text-sm text-muted">
            Water <span aria-hidden>→</span> <strong className="text-fg">Species</strong>{" "}
            <span aria-hidden>→</span> Season <span aria-hidden>→</span> Holding water{" "}
            <span aria-hidden>→</span> Forage <span aria-hidden>→</span> Presentation{" "}
            <span aria-hidden>→</span> Tackle
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-3" role="radiogroup" aria-label="Experience pathway">
            {PATHS.map((path, index) => {
              const on = mode === path.id;
              return (
                <button
                  key={path.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => chooseMode(path.id)}
                  className={cn(
                    "min-h-24 rounded-[var(--radius-md)] px-4 py-3 text-left shadow-[var(--shadow-border)]",
                    on
                      ? "bg-accent text-accent-fg"
                      : "bg-elevated text-fg hover:shadow-[var(--shadow-border-hover)]",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.14em]",
                      on ? "text-accent-fg/75" : "text-dim",
                    )}
                  >
                    Path {index + 1}
                  </span>
                  <span className="mt-1 block font-display text-lg">{path.label}</span>
                  <span
                    className={cn(
                      "mt-1 block text-xs leading-relaxed",
                      on ? "text-accent-fg/80" : "text-muted",
                    )}
                  >
                    {path.description}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted">
            Your pathway changes how much is shown, not the biology. None of them adds a bite
            score or a hotspot. This app doesn't have those.
          </p>
        </section>
      </div>

      {mode === "beginner" ? (
        <QuickReadV2 onOpenFull={() => chooseMode("competent")} />
      ) : (
        <Instrument advanced={mode === "advanced"} />
      )}
      <SelectedSpeciesProfile />

      <footer className="border-t border-line px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Northern Lantern House Labs
            </p>
            <p className="mt-2 text-sm text-muted">Species &amp; Presentation Analyst</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              to="/species"
              className="inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:text-fg"
            >
              All {SPECIES.length} species records
            </Link>
            <Link
              to="/boundary"
              className="inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:text-fg"
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
