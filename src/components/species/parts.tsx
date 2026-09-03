import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The furniture a species page is built from.
 *
 * Kept separate from the page itself so the 111 documents share one set of
 * rhythms — heading scale, panel inset, the mono eyebrow — while the page
 * decides which of them a given record has enough content to earn.
 */

export function Section({
  id,
  kicker,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  kicker?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-20", className)}>
      {kicker && (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mark">{kicker}</p>
      )}
      <h2 id={`${id}-title`} className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        {title}
      </h2>
      {lede && <div className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{lede}</div>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Panel({
  children,
  className,
  tone = "elevated",
}: {
  children: ReactNode;
  className?: string;
  tone?: "elevated" | "subtle" | "bare";
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] p-5 sm:p-6",
        tone === "elevated" && "bg-elevated shadow-[var(--shadow-border)]",
        tone === "subtle" && "bg-subtle shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A label/value pair. Used where the record really is a set of figures. */
export function Rows({
  rows,
  className,
}: {
  rows: { label: string; value: ReactNode }[];
  className?: string;
}) {
  if (rows.length === 0) return null;
  return (
    <dl className={cn("grid gap-px overflow-hidden rounded-[var(--radius-md)] bg-line", className)}>
      {rows.map((row) => (
        <div key={row.label} className="bg-elevated px-4 py-3 sm:flex sm:items-baseline sm:gap-6">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:w-44 sm:shrink-0">
            {row.label}
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-fg sm:mt-0">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Prose written as prose.
 *
 * The dossiers hold whole sentences from a source, and printing them as
 * `label: value` rows turned reasoning into a spreadsheet. Each entry gets its
 * own paragraph with the label as a quiet lead-in instead.
 */
export function Prose({ lines }: { lines: { label: string; text: string }[] }) {
  if (lines.length === 0) return null;
  return (
    <div className="space-y-4">
      {lines.map((entry) => (
        <p key={entry.label} className="max-w-2xl text-base leading-relaxed text-fg">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark">
            {entry.label}
          </span>
          <span className="mt-1 block text-muted">{entry.text}</span>
        </p>
      ))}
    </div>
  );
}

export function Chip({
  children,
  tone = "quiet",
}: {
  children: ReactNode;
  tone?: "quiet" | "mark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
        tone === "mark" ? "bg-subtle text-mark" : "bg-subtle text-dim",
      )}
    >
      {children}
    </span>
  );
}

/** A short line stating that something is absent, wherever it would have been. */
export function Absent({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-2xl border-l-2 border-line-strong pl-4 text-sm leading-relaxed text-muted">
      {children}
    </p>
  );
}
