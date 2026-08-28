import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { applyTheme, readTheme, THEMES, type ThemeId } from "@/lib/theme";
import { APP_VERSION, INSTRUMENT_ID } from "@/lib/protocol/vocab";
import { cn } from "@/lib/utils";

export function Chrome() {
  const [theme, setTheme] = useState<ThemeId>("dark");

  useEffect(() => {
    const t = readTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3 text-fg no-underline">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-mark bg-elevated font-mono text-[11px] font-medium tracking-wider text-mark"
          >
            SP
          </span>
          <span className="min-w-0">
            <span className="block truncate font-sans text-sm font-medium tracking-tight">
              Species & Presentation
            </span>
            <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Hook the Horizon · field instrument
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="/?install=1"
            className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:text-fg sm:inline"
          >
            Install
          </a>
          <Link
            to="/boundary"
            className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:text-fg sm:inline"
          >
            Boundary
          </Link>
          <div
            className="flex rounded-[var(--radius-sm)] bg-subtle p-0.5 shadow-[var(--shadow-border)]"
            role="radiogroup"
            aria-label="Appearance"
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={theme === t.id}
                onClick={() => {
                  setTheme(t.id);
                  applyTheme(t.id);
                }}
                className={cn(
                  "min-h-9 rounded-[6px] px-2 font-mono text-[10px] uppercase tracking-wider sm:px-2.5",
                  theme === t.id ? "bg-elevated text-mark" : "text-dim hover:text-fg",
                )}
              >
                <span className="sm:hidden">{t.n}</span>
                <span className="hidden sm:inline">
                  {t.n} {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl justify-between px-4 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:px-6">
        <span>{INSTRUMENT_ID}</span>
        <span>v {APP_VERSION} · local-only</span>
      </div>
    </header>
  );
}
