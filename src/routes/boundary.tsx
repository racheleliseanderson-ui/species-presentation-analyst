import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chrome";
import { SEED_DOCTRINE, SEED_WAVES, nextSeedWave } from "@/lib/knowledge/seed-queue";
import { SPECIES, SPECIES_BY_ID } from "@/lib/knowledge/species-catalog";
import { useDossierCoverage } from "@/lib/knowledge/use-species-overlays";
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
  const coverage = useDossierCoverage(SPECIES.length);
  const next = nextSeedWave();
  const landed = SEED_WAVES.filter((wave) => wave.status === "landed");
  const nextNames = (next?.speciesIds ?? [])
    .map((id) => SPECIES_BY_ID[id]?.commonNames[0])
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Chrome />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">The gaps are printed on the dial</p>
        <h1 className="mt-4 font-display text-5xl">What this won't tell you</h1>
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

        <section className="mt-12 border-t border-line pt-10" aria-labelledby="catalog-knowledge-heading">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">Catalog knowledge</p>
          <h2 id="catalog-knowledge-heading" className="mt-4 font-display text-3xl">
            What we actually know
          </h2>
          <p className="mt-4 text-sm text-muted">
            Enrichment is a ranked queue of lookalike groups, not a race to fill seventy-five encyclopedia pages. A species becomes knowable only when identification, behavior, diet, and seasonal calendar are reviewed together from agency or peer-reviewed sources.
          </p>
          {coverage.status === "ready" ? (
            <p className="mt-5 text-sm text-fg">
              {coverage.coverage.completeOverlays} of {coverage.speciesTotal} species have that full overlay set.
              Identification {coverage.coverage.identification} · behavior {coverage.coverage.behavior} · diet {coverage.coverage.diet} · season {coverage.coverage.seasonal_calendar}.
              Fight and food value stay unreviewed. Live limits stay outside the static catalog.
            </p>
          ) : (
            <p className="mt-5 text-sm text-muted">
              {coverage.status === "loading"
                ? "Counting the reviewed overlays…"
                : "The live overlay count could not be read right now. The catalog holds " +
                  `${coverage.speciesTotal} reviewed species; how many carry the full overlay set is what is temporarily unavailable, not the records themselves.`}
            </p>
          )}
          <ul className="mt-6 space-y-3">
            {landed.map((wave) => (
              <li key={wave.id} className="rounded-[var(--radius-md)] bg-elevated px-5 py-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-dim">Landed · wave {wave.id}</p>
                <p className="mt-1 text-sm font-medium text-fg">{wave.title}</p>
                <p className="mt-1 text-sm text-muted">{wave.reason}</p>
              </li>
            ))}
            {next && (
              <li className="rounded-[var(--radius-md)] bg-subtle px-5 py-4 shadow-[var(--shadow-border)]">
                <p className="font-mono text-[9px] uppercase tracking-wider text-mark">Next · wave {next.id}</p>
                <p className="mt-1 text-sm font-medium text-fg">{next.title}</p>
                <p className="mt-1 text-sm text-muted">{next.reason}</p>
                <p className="mt-2 text-sm text-fg">{nextNames}</p>
              </li>
            )}
          </ul>
          <p className="mt-6 text-xs leading-5 text-dim">
            {SEED_DOCTRINE.unit} {SEED_DOCTRINE.usefulFirst} We do not fill remaining species with model text.
            Deferred until the high-use set is knowable: fight, table quality, gear ranges, and live regulations.
          </p>
        </section>

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
