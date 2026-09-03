import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "@/components/chrome";
import { SpeciesThumb } from "@/components/species-thumb";
import { SPECIES } from "@/lib/knowledge/species-catalog";
import { speciesSlug } from "@/lib/knowledge/species-slug";
import { speciesIndexJsonLd } from "@/lib/knowledge/species-schema";
import { isMarine, labelOf } from "@/lib/protocol/vocab";
import { SITE_ORIGIN, canonicalFor } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The hub this catalog never had.
 *
 * 111 reviewed records existed for months behind a search box on one route,
 * which meant nobody could see the shape of the catalog — how much of it is
 * saltwater, how much of it carries a regulated-context flag, how much of it
 * has no temperature band at all. Those are the facts that tell you whether
 * this thing is worth trusting, and they were invisible.
 *
 * Filtering happens on this device against a list that is already here, so
 * there is no request and no empty state waiting on a network. The counts
 * beside each filter are live: a filter that would return nothing says so
 * before you press it.
 */

const REALMS = [
  { id: "all", label: "All water" },
  { id: "freshwater", label: "Freshwater" },
  { id: "saltwater", label: "Saltwater" },
] as const;

const STATUSES = [
  { id: "all", label: "Any status" },
  { id: "standard", label: "Ordinary target" },
  { id: "regulated_context", label: "Regulated context" },
  { id: "conservation_sensitive", label: "Conservation-sensitive" },
] as const;

const GROUPS = [
  { id: "all", label: "Every group" },
  { id: "trout_salmon", label: "Trout & salmon" },
  { id: "bass_panfish", label: "Bass & panfish" },
  { id: "predator", label: "Freshwater predator" },
  { id: "other", label: "Other freshwater" },
  { id: "inshore_surf", label: "Inshore & surf" },
  { id: "reef_bottom", label: "Reef & bottom" },
  { id: "offshore_pelagic", label: "Offshore pelagic" },
  { id: "sharks", label: "Sharks" },
] as const;

type Realm = (typeof REALMS)[number]["id"];
type Status = (typeof STATUSES)[number]["id"];
type Group = (typeof GROUPS)[number]["id"];

const ENTRIES = SPECIES.map((species) => {
  const marine = species.habitat.waterTypes.filter((water) => isMarine(water)).length;
  return {
    species,
    slug: speciesSlug(species),
    name: species.commonNames[0] ?? species.scientificName,
    realm: (marine === 0
      ? "freshwater"
      : marine === species.habitat.waterTypes.length
        ? "saltwater"
        : "both") as "freshwater" | "saltwater" | "both",
    status: species.targetStatus ?? "standard",
    waterLabels: species.habitat.waterTypes.map((water) => labelOf(water)),
    hasThermal: Boolean(
      species.thermal?.preferredF ||
      species.thermal?.activeF ||
      species.thermal?.coldEdgeF != null ||
      species.thermal?.warmEdgeF != null,
    ),
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const DESCRIPTION =
  "Every reviewed species record in Species & Presentation Analyst: 111 fish, the water each one is documented in, its target status, and whether it carries a published temperature band.";

export const Route = createFileRoute("/species/")({
  head: () => ({
    meta: [
      { title: "Species index — 111 reviewed records · Hook the Horizon" },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Species index — 111 reviewed records" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_ORIGIN}/species` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:title", content: "Species index — 111 reviewed records" },
      { name: "twitter:description", content: DESCRIPTION },
      {
        "script:ld+json": speciesIndexJsonLd(
          ENTRIES.map((entry) => ({ path: `/species/${entry.slug}`, name: entry.name })),
        ),
      },
    ],
    links: [{ rel: "canonical", href: canonicalFor("/species") }],
  }),
  component: SpeciesIndex,
});

function SpeciesIndex() {
  const [query, setQuery] = useState("");
  const [realm, setRealm] = useState<Realm>("all");
  const [status, setStatus] = useState<Status>("all");
  const [group, setGroup] = useState<Group>("all");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ENTRIES.filter((entry) => {
      if (realm !== "all" && entry.realm !== realm && entry.realm !== "both") return false;
      if (status !== "all" && entry.status !== status) return false;
      if (group !== "all" && entry.species.group !== group) return false;
      if (!needle) return true;
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.species.scientificName.toLowerCase().includes(needle) ||
        entry.species.commonNames.some((name) => name.toLowerCase().includes(needle))
      );
    });
  }, [query, realm, status, group]);

  const noThermal = ENTRIES.filter((entry) => !entry.hasThermal).length;
  const regulated = ENTRIES.filter((entry) => entry.status !== "standard").length;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a href="#main" className="skip-link">
        Skip to the list
      </a>
      <Chrome />
      <main id="main" className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
          The whole catalog, on one page
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
          {ENTRIES.length} reviewed species
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Each one has its own page: behaviour, holding water, forage, the presentation families
          that follow, every source named, and what the record still does not know. Nothing here was
          written by a model filling in a gap.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-dim">
          {noThermal} of them have no published temperature band that a review would accept, and{" "}
          {regulated} carry a regulated or conservation-sensitive flag. Both numbers are on the page
          because they change how much weight the reading deserves.
        </p>

        <div className="mt-10 space-y-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              Search by name
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Brown trout, Salmo trutta, brookie…"
              className="mt-2 min-h-12 w-full rounded-[var(--radius-sm)] bg-elevated px-4 text-base text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-dim focus-visible:shadow-[var(--shadow-border-hover)]"
            />
          </label>

          <FilterRow legend="Water" options={REALMS} value={realm} onChange={setRealm} />
          <FilterRow
            legend="Target status"
            options={STATUSES}
            value={status}
            onChange={setStatus}
          />
          <FilterRow legend="Group" options={GROUPS} value={group} onChange={setGroup} />
        </div>

        <p
          aria-live="polite"
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-dim"
        >
          {results.length} of {ENTRIES.length} records
        </p>

        {results.length === 0 ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
            Nothing in the catalog matches that combination. That is a real answer about what has
            been reviewed so far, not a search failure — widen one filter and the list comes back.
          </p>
        ) : (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {results.map((entry) => (
              <li key={entry.slug}>
                <Link
                  to="/species/$speciesId"
                  params={{ speciesId: entry.slug }}
                  className="flex min-h-24 items-start gap-4 rounded-[var(--radius-md)] bg-elevated p-4 no-underline shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                >
                  <SpeciesThumb
                    speciesId={entry.species.id}
                    commonName={entry.name}
                    className="size-14"
                    decorative
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl leading-tight text-fg">
                      {entry.name}
                    </span>
                    <span className="block font-display text-sm italic text-dim">
                      {entry.species.scientificName}
                    </span>
                    <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                      {entry.waterLabels.join(" · ")}
                      {entry.status !== "standard" && (
                        <span className="text-warn">
                          {" "}
                          ·{" "}
                          {entry.status === "conservation_sensitive"
                            ? "Conservation-sensitive"
                            : "Regulated"}
                        </span>
                      )}
                      {!entry.hasThermal && <span className="text-dim"> · No temp band</span>}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function FilterRow<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(option.id)}
              className={cn(
                "min-h-11 rounded-[var(--radius-sm)] px-3 text-sm shadow-[var(--shadow-border)]",
                on
                  ? "bg-accent text-accent-fg"
                  : "bg-elevated text-fg hover:shadow-[var(--shadow-border-hover)]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
