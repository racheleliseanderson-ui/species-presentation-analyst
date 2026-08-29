import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chrome";
import { REFUSES } from "@/lib/protocol/vocab";

export const Route = createFileRoute("/boundary")({
  head: () => ({
    meta: [
      { title: "Limits & sources · Species & Presentation Analyst" },
      {
        name: "description",
        content:
          "What Species & Presentation Analyst will not tell you, and why: no bite scores, no hotspots, no invented biology.",
      },
    ],
  }),
  component: Boundary,
});

function Boundary() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Chrome />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">The gaps are printed on the dial</p>
        <h1 className="mt-4 font-display text-5xl">What we will not tell you</h1>
        <p className="mt-5 text-base text-muted">
          Species & Presentation Analyst explains biological plausibility. It does not compete with catch-prediction products. The list below is an editorial stance we have chosen, not a shortcoming we plan to fix. These limits are product rules, not preferences.
        </p>
        <ul className="mt-8 space-y-3">
          {REFUSES.map((r) => (
            <li key={r} className="instrument-rule rounded-[var(--radius-md)] bg-elevated px-5 py-4 text-sm">
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          No unreviewed species falls through to generic AI-written text. If we have no reviewed record for a fish, we say so and stop.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-11 items-center text-sm text-fg"
        >
          Back to the reading
        </Link>
      </main>
    </div>
  );
}
