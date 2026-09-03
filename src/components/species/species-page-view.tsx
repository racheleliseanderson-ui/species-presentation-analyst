import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Absent, Chip, Panel, Prose, Rows, Section } from "@/components/species/parts";
import { SpeciesThumb } from "@/components/species-thumb";
import { FLEET_TARGETS, packetUrl } from "@/lib/hth-packet";
import { buildSpeciesReferencePacket } from "@/lib/protocol/packet";
import type { SpeciesPageModel } from "@/lib/knowledge/species-page";
import { cn } from "@/lib/utils";

/**
 * One reviewed species, as a document.
 *
 * The order is the order a person actually asks the questions: what is it,
 * what is the record allowed to claim about targeting it, what does it not
 * know, where does it live, what does it eat, when, how would you fish for it,
 * and who said so.
 *
 * The unknowns sit third, above the biology, and that placement is the point of
 * the page. Every competitor publishes a confident species page. The reason to
 * read this one is that it tells you where its own evidence stops before it
 * spends four screens on what it does have.
 *
 * Sections render only when the record has something in them. A fish with one
 * sourced paragraph about pupping gets a short page that says why it is short,
 * rather than a full-length page padded out to look the same as the others.
 */

const SOURCE_CLASS_LABEL: Record<string, string> = {
  agency: "Agency",
  peer_reviewed: "Peer reviewed",
  synthesis: "Synthesis",
};

export function SpeciesPageView({ model }: { model: SpeciesPageModel }) {
  const declaredGaps = model.allGaps.filter((gap) => gap.origin === "declared");
  const structuralGaps = model.allGaps.filter((gap) => gap.origin === "structural");

  const handoffs = useMemo(() => {
    const build = (key: "hatch" | "tackle" | "water") => ({
      key,
      target: FLEET_TARGETS[key],
      href: packetUrl(key, buildSpeciesReferencePacket(model.species, { intent: key })),
    });
    return [build("hatch"), build("tackle"), build("water")];
  }, [model.species]);

  const HANDOFF_PURPOSE: Record<string, string> = {
    hatch: "What this fish is likely eating on that kind of water, at that time of year.",
    tackle: "Whether the line and terminal end you already own can deliver these families.",
    water: "Where water like this exists, and what it is doing right now.",
  };

  return (
    <main id="main" className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.16em]">
        <Link to="/species" className="text-dim no-underline hover:text-fg">
          All species
        </Link>
        <span aria-hidden className="px-2 text-dim">
          /
        </span>
        <span className="text-mark">{model.commonName}</span>
      </nav>

      {/* ---------------------------------------------------------------- */}

      <header className="mt-6 border-b border-line pb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mark">
          {model.groupLabel} ·{" "}
          {model.realm === "both"
            ? "Fresh and salt"
            : model.realm === "saltwater"
              ? "Saltwater"
              : "Freshwater"}
        </p>
        <div className="mt-3 flex flex-wrap items-start gap-5">
          <SpeciesThumb
            speciesId={model.species.id}
            commonName={model.commonName}
            className="size-20 sm:size-28"
            decorative
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-4xl leading-[1.05] sm:text-6xl">{model.commonName}</h1>
            <p className="mt-2 font-display text-xl italic text-muted sm:text-2xl">
              {model.scientificName}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg">{model.standfirst}</p>

        {model.alsoCalled.length > 0 && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
              Also called{" "}
            </span>
            {model.alsoCalled.join(", ")}.
          </p>
        )}

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Record summary">
          {model.waterTypes.map((water) => (
            <li key={water.id}>
              <Chip tone="mark">{water.label}</Chip>
            </li>
          ))}
          <li>
            <Chip>{model.status.short}</Chip>
          </li>
          <li>
            <Chip>{model.overlayCount} of 4 overlays reviewed</Chip>
          </li>
          <li>
            <Chip>Reviewed {model.reviewedAt}</Chip>
          </li>
        </ul>

        <a
          href="#unknowns"
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-fg underline decoration-mark decoration-2 underline-offset-4"
        >
          {model.allGaps.length} things this record does not know
          <span aria-hidden>↓</span>
        </a>
      </header>

      {/* --- status ------------------------------------------------------ */}

      {model.status.status !== "standard" && <StatusCallout model={model} />}

      {/* --- onward ------------------------------------------------------ */}

      <section aria-labelledby="carry-title" className="mt-10">
        <h2 id="carry-title" className="font-display text-2xl">
          Take this somewhere
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          This page is the record. The reading is what happens when you add water, a season and a
          temperature to it — that is where the families below get ranked against each other instead
          of just listed.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link
            to="/"
            search={{ species: model.slug }}
            className="flex min-h-24 flex-col justify-between rounded-[var(--radius-md)] bg-accent px-4 py-3 text-accent-fg no-underline"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent-fg/75">
              Start a reading
            </span>
            <span className="mt-1 font-display text-xl">Read {model.commonName} on your water</span>
            <span className="mt-1 text-xs leading-snug text-accent-fg/80">
              Opens the analyst with this fish already picked.
            </span>
          </Link>
          {handoffs.map((handoff) => (
            <a
              key={handoff.key}
              href={handoff.href}
              className="flex min-h-24 flex-col justify-between rounded-[var(--radius-md)] bg-elevated px-4 py-3 no-underline shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                {handoff.target.step}
              </span>
              <span className="mt-1 flex items-center justify-between gap-2 font-medium text-fg">
                {handoff.target.name}
                <ArrowUpRight className="size-4 shrink-0 text-mark" aria-hidden />
              </span>
              <span className="mt-1 text-xs leading-snug text-muted">
                {HANDOFF_PURPOSE[handoff.key]}
              </span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-dim">
          Those three links carry the fish and nothing else. No conditions were declared on this
          page, so none travel, and the link says so rather than sending an empty reading.
        </p>
      </section>

      {/* --- unknowns ---------------------------------------------------- */}

      <UnknownsSection model={model} declared={declaredGaps} structural={structuralGaps} />

      {/* --- body -------------------------------------------------------- */}

      <div className="mt-16 space-y-16">
        <WhereSection model={model} />
        <TemperatureSection model={model} />
        <BehaviourSection model={model} />
        <ForageSection model={model} />
        <SeasonSection model={model} />
        <IdentificationSection model={model} />
        <PresentationSection model={model} />
        <PopulationSection model={model} />
        <SourcesSection model={model} />
        <RelatedSection model={model} />
      </div>
    </main>
  );
}

/* ========================================================================== */

function StatusCallout({ model }: { model: SpeciesPageModel }) {
  const { status } = model;
  return (
    <section
      aria-labelledby="status-title"
      className={cn(
        "mt-10 rounded-[var(--radius-lg)] p-5 sm:p-6",
        status.unresolved
          ? "bg-elevated shadow-[inset_4px_0_0_0_var(--warn),var(--shadow-border)]"
          : "bg-elevated shadow-[inset_4px_0_0_0_var(--mark),var(--shadow-border)]",
      )}
    >
      <p
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.18em]",
          status.unresolved ? "text-warn" : "text-mark",
        )}
      >
        {status.unresolved ? "Open question · not settled here" : "Before you target this fish"}
      </p>
      <h2 id="status-title" className="mt-2 font-display text-2xl sm:text-3xl">
        {status.unresolved ? "The sources under this record disagree" : status.label}
      </h2>
      {status.unresolved && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg">
          Two bodies of evidence point different ways about how much pressure this fish can take,
          and the record does not pick a winner. Both positions are written out below in full. What
          to do about it is a person&rsquo;s call, and the reviewer left it to one on purpose rather
          than letting a lookup decide.
        </p>
      )}
      {status.note && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg">{status.note}</p>
      )}
      {status.jurisdictionScope && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
            Where this applies{" "}
          </span>
          {status.jurisdictionScope}
        </p>
      )}
      {status.contextNote && (
        <div className="mt-4 rounded-[var(--radius-md)] bg-subtle p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
            The reviewed context, unedited
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-[1.7] text-fg">{status.contextNote}</p>
        </div>
      )}
      {status.verifyLocalRules && (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Rules for this fish change at a state line and sometimes inside one. Check the ones that
          apply to the exact water you are standing on before you act on anything here — this record
          is biology, not permission.
        </p>
      )}
    </section>
  );
}

/* ========================================================================== */

function UnknownsSection({
  model,
  declared,
  structural,
}: {
  model: SpeciesPageModel;
  declared: SpeciesPageModel["allGaps"];
  structural: SpeciesPageModel["allGaps"];
}) {
  const byArea = (list: SpeciesPageModel["allGaps"]) => {
    const map = new Map<string, SpeciesPageModel["allGaps"]>();
    for (const gap of list) {
      const current = map.get(gap.area) ?? [];
      current.push(gap);
      map.set(gap.area, current);
    }
    return [...map.entries()];
  };

  return (
    <Section
      id="unknowns"
      kicker="The half nobody publishes"
      title="What this record does not know"
      className="mt-16"
      lede={
        <>
          <p>
            Everything else on this page comes from a named agency or peer-reviewed source. This is
            the other side of that: the questions a reviewer went looking for an answer to and came
            back without, and the fields the record leaves empty because filling them would mean
            guessing.
          </p>
          <p className="mt-3">
            It is here rather than at the bottom because a page that only shows what it knows is
            easy to read as a page that knows everything. For {model.commonName} there are{" "}
            {model.allGaps.length} of them.
          </p>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <GapColumn
          heading="Named by a reviewer"
          note="Somebody looked for this and wrote down that they did not find it."
          groups={byArea(declared)}
          tone="warn"
        />
        <GapColumn
          heading="Absent from the record"
          note="No reviewer wrote a gap here. The field is simply empty, which is its own answer."
          groups={byArea(structural)}
          tone="quiet"
        />
      </div>
    </Section>
  );
}

function GapColumn({
  heading,
  note,
  groups,
  tone,
}: {
  heading: string;
  note: string;
  groups: [string, SpeciesPageModel["allGaps"]][];
  tone: "warn" | "quiet";
}) {
  if (groups.length === 0) {
    return (
      <Panel tone="subtle">
        <h3 className="font-display text-xl">{heading}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Nothing in this column for this fish.
        </p>
      </Panel>
    );
  }
  const count = groups.reduce((total, [, items]) => total + items.length, 0);
  return (
    <Panel
      className={cn(tone === "warn" && "shadow-[inset_3px_0_0_0_var(--warn),var(--shadow-border)]")}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl">{heading}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{count}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{note}</p>
      <dl className="mt-5 space-y-5">
        {groups.map(([area, items]) => {
          const sentences = items.filter((gap) => gap.phrasing === "sentence");
          const phrases = items.filter((gap) => gap.phrasing === "phrase");
          return (
            <div key={area}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
                {area}
              </dt>
              <dd>
                {sentences.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {sentences.map((gap) => (
                      <p key={gap.text} className="text-sm leading-relaxed text-fg">
                        {gap.text}
                      </p>
                    ))}
                  </div>
                )}
                {phrases.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm leading-relaxed text-muted">Nobody has sourced:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-mark">
                      {phrases.map((gap) => (
                        <li key={gap.text} className="text-sm leading-relaxed text-fg">
                          {gap.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </Panel>
  );
}

/* ========================================================================== */

function WhereSection({ model }: { model: SpeciesPageModel }) {
  return (
    <Section
      id="where"
      kicker="Where the record puts it"
      title="Water and range"
      lede={model.geographic}
    >
      <div className="space-y-6">
        {model.positioning.water.map((water) => (
          <Panel key={water.waterType}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl">{water.label}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                {water.holding.length} reviewed holding{" "}
                {water.holding.length === 1 ? "class" : "classes"}
              </span>
            </div>
            {water.holding.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {water.holding.map((holding) => (
                  <li key={holding.id}>
                    <Chip>{holding.label}</Chip>
                  </li>
                ))}
              </ul>
            ) : (
              <Absent>
                No holding-water class is reviewed for this water type, so the reading cannot narrow
                where in it the fish sits.
              </Absent>
            )}
          </Panel>
        ))}

        <div className="space-y-4">
          <p className="max-w-2xl text-base leading-relaxed text-fg">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark">
              Depth
            </span>
            <span className="mt-1 block text-muted">{model.positioning.depthTendency}</span>
          </p>
          {model.positioning.currentPreference ? (
            <p className="max-w-2xl text-base leading-relaxed text-fg">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark">
                Moving water
              </span>
              <span className="mt-1 block text-muted">{model.positioning.currentPreference}</span>
            </p>
          ) : (
            <Absent>
              How this fish uses current or tide is not resolved from a source. The reading leaves
              that axis alone rather than filling it in from a relative.
            </Absent>
          )}
          {model.positioning.lightResponse ? (
            <p className="max-w-2xl text-base leading-relaxed text-fg">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mark">
                Light
              </span>
              <span className="mt-1 block text-muted">{model.positioning.lightResponse}</span>
            </p>
          ) : (
            <Absent>No sourced account of how light or time of day changes its behaviour.</Absent>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ========================================================================== */

function TemperatureSection({ model }: { model: SpeciesPageModel }) {
  return (
    <Section
      id="temperature"
      kicker="Thermal band"
      title="Temperature"
      lede={
        model.thermal.reviewed
          ? "Temperature is the axis that moves the reading most, so it is worth knowing exactly what kind of figure this is."
          : undefined
      }
    >
      {model.thermal.reviewed ? (
        <div className="space-y-5">
          <Rows rows={model.thermal.rows.map((row) => ({ label: row.label, value: row.value }))} />
          {model.thermal.basisNote && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              {model.thermal.basisNote}
            </p>
          )}
          {model.thermal.sourceNote && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              {model.thermal.sourceNote}
            </p>
          )}
        </div>
      ) : (
        <Panel tone="subtle">
          <h3 className="font-display text-xl">No reviewed temperature band</h3>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
            Nobody publishes a preferred or active temperature range for {model.commonName} that a
            review would accept. Borrowing one from a related fish would look like knowledge and
            behave like a guess, so the reading runs without it and says which parts of the answer
            that weakens.
          </p>
        </Panel>
      )}
    </Section>
  );
}

/* ========================================================================== */

function BehaviourSection({ model }: { model: SpeciesPageModel }) {
  if (!model.behavior.present) {
    return (
      <Section id="behaviour" kicker="How it uses water" title="Behaviour">
        <Panel tone="subtle">
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            No behaviour dossier has been reviewed for {model.commonName}. What the catalog holds
            about how this fish uses water is the habitat record above, and that is the whole of it.
          </p>
        </Panel>
      </Section>
    );
  }

  const opening = [model.behavior.social, model.behavior.feeding, model.behavior.diel].filter(
    Boolean,
  ) as string[];

  return (
    <Section
      id="behaviour"
      kicker="How it uses water"
      title="Behaviour"
      lede={
        model.behavior.status === "partial"
          ? "This dossier is marked partial. It holds what was sourced and stops where the sourcing did."
          : undefined
      }
    >
      <div className="space-y-8">
        {opening.length > 0 && (
          <div className="max-w-2xl space-y-4">
            {opening.map((text) => (
              <p key={text} className="text-lg leading-relaxed text-fg">
                {text}
              </p>
            ))}
          </div>
        )}
        <Prose lines={model.behavior.prose} />
        {model.exceptions.length > 0 && (
          <Panel tone="subtle">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-warn">
              Where the general rule stops
            </h3>
            <ul className="mt-3 space-y-2">
              {model.exceptions.map((exception) => (
                <li key={exception} className="max-w-2xl text-sm leading-relaxed text-fg">
                  {exception}
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </Section>
  );
}

/* ========================================================================== */

function ForageSection({ model }: { model: SpeciesPageModel }) {
  const { forage } = model;
  return (
    <Section
      id="forage"
      kicker="What it can eat"
      title="Forage"
      lede="A capacity list, not a report from this week. What is actually available on your water is a separate question, and Hatch Match is the tool that asks it."
    >
      <div className="space-y-8">
        <ul className="flex flex-wrap gap-2">
          {forage.classes.map((entry) => (
            <li key={entry.id}>
              <Chip tone="mark">{entry.label}</Chip>
            </li>
          ))}
        </ul>

        {forage.present ? (
          <div className="space-y-8">
            {forage.primaryNote && (
              <p className="max-w-2xl text-lg leading-relaxed text-fg">{forage.primaryNote}</p>
            )}
            <Rows
              rows={[
                ...(forage.style ? [{ label: "Feeding style", value: forage.style }] : []),
                ...(forage.zone ? [{ label: "Feeding zone", value: forage.zone }] : []),
              ]}
            />
            {forage.seasonal.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
                  Through the year
                </h3>
                <Rows
                  className="mt-3"
                  rows={forage.seasonal.map((entry) => ({
                    label: entry.season,
                    value: entry.emphasis,
                  }))}
                />
              </div>
            )}
            {forage.lifeStage.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
                  By life stage
                </h3>
                <Rows
                  className="mt-3"
                  rows={forage.lifeStage.map((entry) => ({
                    label: entry.label,
                    value: entry.text,
                  }))}
                />
              </div>
            )}
            <Prose lines={forage.shifts} />
            {forage.observedForageRule && <Absent>{forage.observedForageRule}</Absent>}
          </div>
        ) : (
          <Panel tone="subtle">
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              No diet dossier has been reviewed for {model.commonName}. The classes above come from
              the species record — they say what this fish is built to eat, not what it has been
              observed eating in a particular season.
            </p>
          </Panel>
        )}
      </div>
    </Section>
  );
}

/* ========================================================================== */

function SeasonSection({ model }: { model: SpeciesPageModel }) {
  const { season } = model;
  return (
    <Section id="season" kicker="Through the year" title="Season" lede={season.overview}>
      <div className="space-y-8">
        {season.entries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {season.entries.map((entry) => (
              <Panel key={entry.season}>
                <h3 className="font-display text-2xl">{entry.label}</h3>
                <dl className="mt-4 space-y-3">
                  {entry.lines.map((row) => (
                    <div key={row.label}>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-sm leading-relaxed text-fg">{row.text}</dd>
                    </div>
                  ))}
                </dl>
                {entry.presentationImplication && (
                  <p className="mt-4 rounded-[var(--radius-sm)] bg-subtle px-3 py-2.5 text-sm leading-relaxed text-fg">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-mark">
                      What that changes
                    </span>
                    <span className="mt-1 block text-muted">{entry.presentationImplication}</span>
                  </p>
                )}
                {entry.invalidators.length > 0 && (
                  <div className="mt-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-warn">
                      What would count against it
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {entry.invalidators.map((text) => (
                        <li key={text} className="text-sm leading-relaxed text-muted">
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {entry.conservationNote && (
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {entry.conservationNote}
                  </p>
                )}
              </Panel>
            ))}
          </div>
        ) : (
          <Panel tone="subtle">
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              No seasonal calendar has been reviewed for {model.commonName}. Season still moves the
              reading through temperature and the species record; there is just no month-by-month
              account to show you.
            </p>
          </Panel>
        )}

        {season.spawning ? (
          <Panel tone="subtle">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
              Spawning · {season.spawning.seasons.join(", ")}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg">{season.spawning.note}</p>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-dim">
              Recorded as conservation context. No spawning site, staging concentration or migration
              bottleneck is named anywhere in this catalog, because naming one is how a population
              gets fished out.
            </p>
          </Panel>
        ) : (
          <Absent>
            No spawning account is recorded. Sometimes that means no source was found. Sometimes it
            means the only available account describes an aggregation, and this catalog does not
            write those down.
          </Absent>
        )}
      </div>
    </Section>
  );
}

/* ========================================================================== */

function IdentificationSection({ model }: { model: SpeciesPageModel }) {
  const ident = model.identification;
  if (!ident.present) {
    return (
      <Section id="identification" kicker="Telling it apart" title="Identification">
        <Panel tone="subtle">
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            No identification dossier has been reviewed for {model.commonName}. The catalog can name
            this fish; it cannot yet tell you how to be sure the one in your hands is it.
          </p>
        </Panel>
      </Section>
    );
  }

  return (
    <Section
      id="identification"
      kicker="Telling it apart"
      title="Identification"
      lede={ident.coloration}
    >
      <div className="space-y-8">
        {ident.traits.length > 0 && (
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
              What to look at
            </h3>
            <ul className="mt-3 space-y-3">
              {ident.traits.map((trait) => (
                <li
                  key={trait}
                  className="max-w-2xl border-l-2 border-line-strong pl-4 text-base leading-relaxed text-fg"
                >
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Rows rows={ident.size.map((row) => ({ label: row.label, value: row.value }))} />

        {ident.similar.length > 0 && (
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
              What it gets confused with
            </h3>
            <dl className="mt-3 space-y-5">
              {ident.similar.map((entry) => (
                <div key={entry.name} className="max-w-2xl">
                  <dt className="font-display text-xl">
                    {entry.slug ? (
                      <Link
                        to="/species/$speciesId"
                        params={{ speciesId: entry.slug }}
                        className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-mark"
                      >
                        {entry.name}
                      </Link>
                    ) : (
                      entry.name
                    )}
                  </dt>
                  <dd className="mt-1 text-base leading-relaxed text-muted">{entry.distinction}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ========================================================================== */

function PresentationSection({ model }: { model: SpeciesPageModel }) {
  const anyFamilies = model.positioning.water.some((water) => water.presentations.length > 0);

  return (
    <Section
      id="presentation"
      kicker="What follows from all of that"
      title="Presentation families"
      lede={
        anyFamilies
          ? "These are the families the record will consider for this fish, and what each one has to do. They are not ranked here — ranking needs a season, a temperature and a piece of holding water, which is what the reading is for."
          : undefined
      }
    >
      <div className="space-y-10">
        {model.positioning.water.map((water) => (
          <div key={water.waterType}>
            <h3 className="font-display text-2xl">{water.label}</h3>
            {water.presentations.length === 0 ? (
              <Absent>
                The record documents {model.commonName} in {water.label.toLowerCase()} but has no
                reviewed presentation family for it. Presence and a method are different claims and
                only the first one is made here.
              </Absent>
            ) : (
              <div className="mt-4 grid gap-3">
                {water.presentations.map((family) => (
                  <Panel key={family.id}>
                    <h4 className="font-display text-xl">{family.label}</h4>
                    <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
                      {family.job}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {family.mechanics.map((mechanic) => (
                        <li key={mechanic}>
                          <Chip>{mechanic}</Chip>
                        </li>
                      ))}
                    </ul>
                    <details className="group mt-4">
                      <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-[0.14em] text-dim hover:text-fg">
                        What it asks of the tackle
                        <span aria-hidden className="ml-2 group-open:hidden">
                          +
                        </span>
                        <span aria-hidden className="ml-2 hidden group-open:inline">
                          −
                        </span>
                      </summary>
                      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                        {family.requirements.map((requirement) => (
                          <div
                            key={requirement.key}
                            className="rounded-[var(--radius-sm)] bg-subtle px-3 py-2"
                          >
                            <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                              {requirement.label}
                            </dt>
                            <dd className="mt-0.5 text-sm text-fg">{requirement.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  </Panel>
                ))}
              </div>
            )}
          </div>
        ))}

        <div>
          <h3 className="font-display text-2xl">What moves them for this fish</h3>
          {model.overrides.length > 0 ? (
            <>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
                Reviewed rules that push particular families up when the conditions match. Each one
                names the conditions it needs and why it exists, so you can disagree with it.
              </p>
              <ul className="mt-5 space-y-4">
                {model.overrides.map((rule) => (
                  <li key={rule.id}>
                    <Panel tone="subtle">
                      <p className="max-w-2xl text-base leading-relaxed text-fg">{rule.note}</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                            When
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            {rule.when.length > 0 ? rule.when.join(" · ") : "Any conditions"}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                            Moves up
                          </p>
                          <p className="mt-1 text-sm text-muted">{rule.families.join(", ")}</p>
                        </div>
                      </div>
                      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                        Reviewed {rule.reviewedAt}
                      </p>
                    </Panel>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Absent>
              No species-specific rule is reviewed for {model.commonName}. Its ranking comes from
              the shared model — season, temperature, water type, holding water, forage — with
              nothing added for this fish in particular. That is a gap, not a claim that nothing is
              special about it.
            </Absent>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ========================================================================== */

function PopulationSection({ model }: { model: SpeciesPageModel }) {
  if (model.populations.length === 0) return null;
  return (
    <Section
      id="population"
      kicker="Not every population is the same fish"
      title="Regional population context"
      lede="Broad archetypes, never named reaches. A profile is used only when you declare it or when a reviewed reading carries it in — geography never silently picks one for you."
    >
      <div className="space-y-4">
        {model.populations.map((profile) => (
          <Panel key={profile.id}>
            <h3 className="font-display text-2xl">{profile.label}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              <li>
                <Chip>{profile.lifeHistory}</Chip>
              </li>
              <li>
                <Chip>{profile.origin}</Chip>
              </li>
              {profile.waterTypes.map((water) => (
                <li key={water}>
                  <Chip>{water}</Chip>
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg">
              {profile.positioning}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{profile.note}</p>
            {profile.invalidators.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {profile.invalidators.map((text) => (
                  <li key={text} className="max-w-2xl text-sm leading-relaxed text-muted">
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        ))}
      </div>
    </Section>
  );
}

/* ========================================================================== */

function SourcesSection({ model }: { model: SpeciesPageModel }) {
  return (
    <Section
      id="sources"
      kicker="Where every sentence came from"
      title="Sources"
      lede={`Reviewed ${model.reviewedAt}, next review ${model.nextReviewAt}. Each entry says which part of the page leans on it, so you can check the claim you care about rather than the whole list.`}
    >
      <ol className="space-y-4">
        {model.sources.map((source) => (
          <li
            key={`${source.label}-${source.url ?? ""}`}
            className="border-l-2 border-line-strong pl-4"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-mark">
              {SOURCE_CLASS_LABEL[source.class] ?? source.class}
            </p>
            <p className="mt-1 max-w-2xl text-base leading-relaxed text-fg">
              {source.url ? (
                <a
                  href={source.url}
                  rel="noopener nofollow"
                  className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-mark"
                >
                  {source.label}
                </a>
              ) : (
                source.label
              )}
            </p>
            <p className="mt-1 text-sm text-muted">
              Used for {source.usedFor.join("; ").toLowerCase()}. Read {source.reviewedAt}
              {source.nextReviewAt ? `, next check ${source.nextReviewAt}` : ""}.
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-dim">
        A source with no link predates the rule that one has to carry a URL. It is still a real
        citation and still checkable; it just takes a search rather than a click, and that is worth
        knowing before you rely on it.
      </p>
    </Section>
  );
}

/* ========================================================================== */

function RelatedSection({ model }: { model: SpeciesPageModel }) {
  if (model.related.length === 0) return null;
  return (
    <Section id="related" kicker="Nearby records" title="Other fish worth opening">
      <div className="space-y-10">
        {model.related.map((group) => (
          <div key={group.heading}>
            <h3 className="font-display text-2xl">{group.heading}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{group.reason}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/species/$speciesId"
                    params={{ speciesId: item.slug }}
                    className="flex min-h-16 flex-col justify-center rounded-[var(--radius-md)] bg-elevated px-4 py-3 no-underline shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                  >
                    <span className="font-medium text-fg">{item.name}</span>
                    <span className="font-display text-sm italic text-dim">
                      {item.scientificName}
                    </span>
                    <span className="mt-1 text-xs leading-snug text-muted">{item.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
