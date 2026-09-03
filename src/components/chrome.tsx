import { Link } from "@tanstack/react-router";
import { FLEET_TARGETS } from "@/lib/hth-packet";

/**
 * App chrome. Appearance and accessibility live in the single floating control
 * mounted in the root document, not here — there is one appearance setting and
 * one place to change it.
 */
export function Chrome() {
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
              Species &amp; Presentation
            </span>
            <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Hook the Horizon · field intelligence
            </span>
          </span>
        </Link>
        <nav aria-label="Secondary" className="flex items-center gap-1">
          <Link
            to="/boundary"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-xs)] px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:bg-subtle hover:text-fg"
          >
            Limits &amp; sources
          </Link>
          <a
            href={FLEET_TARGETS.ops.url}
            className="hidden min-h-11 items-center rounded-[var(--radius-xs)] px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-dim no-underline hover:bg-subtle hover:text-fg sm:inline-flex"
          >
            {FLEET_TARGETS.ops.short} <span aria-hidden>&nbsp;↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
