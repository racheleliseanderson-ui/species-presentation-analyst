import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chrome";
import { Instrument } from "@/components/instrument";
import { QuickRead } from "@/components/quick-read";
import { FLEET } from "@/lib/protocol/packet";
import { NEXT_REVIEW, REVIEWED_AT } from "@/lib/protocol/vocab";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

type ExperienceMode = "quick" | "full";

function Home() {
  const [mode, setMode] = useState<ExperienceMode>("quick");

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a href="#main" className="skip-link">
        Skip to reading
      </a>
      <Chrome />

      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <div className="inline-flex rounded-full bg-subtle p-1 shadow-[var(--shadow-border)]" aria-label="Analysis depth">
          <button
            type="button"
            onClick={() => setMode("quick")}
            aria-pressed={mode === "quick"}
            className={cn(
              "min-h-10 rounded-full px-4 text-sm",
              mode === "quick" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            Quick Read
          </button>
          <button
            type="button"
            onClick={() => setMode("full")}
            aria-pressed={mode === "full"}
            className={cn(
              "min-h-10 rounded-full px-4 text-sm",
              mode === "full" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            Full Analysis
          </button>
        </div>
      </div>

      {mode === "quick" ? <QuickRead onOpenFull={() => setMode("full")} /> : <Instrument />}

      <footer className="border-t border-line px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">The fleet</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {FLEET.map((f) => (
                <li key={f.href}>
                  <a href={f.href} className="text-muted no-underline hover:text-fg">
                    {f.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              to="/boundary"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:text-fg"
            >
              Boundary · what this will not tell you
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
              Reviewed {REVIEWED_AT} · next {NEXT_REVIEW} · saved on this device
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
