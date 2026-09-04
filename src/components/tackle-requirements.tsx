import type { Interpretation } from "@/lib/protocol/types";

/**
 * Tackle requirements, stated as requirements rather than products.
 *
 * The engine has always computed these — they were carried in the packet and
 * shown as four unexplained words on the presentation card. The last link in
 * the chain (presentation → what the tackle has to do) deserves to be readable
 * on its own, because it is the part an angler checks against the rod already
 * in their hand.
 *
 * Nothing here names a brand, model or price. It says what the gear has to
 * achieve; Tackle Link is where that becomes a specific setup.
 */

const AXES: {
  key: string;
  label: string;
  /** Why this requirement exists at all. */
  meaning: string;
}[] = [
  {
    key: "depthControl",
    label: "Depth control",
    meaning:
      "How precisely you have to put the bait at a chosen depth and hold it there. High means the depth is the presentation — miss it and the family stops working.",
  },
  {
    key: "sensitivity",
    label: "Sensitivity",
    meaning:
      "How much of the take you have to feel rather than see. High means the eat arrives as a tick or a pause, not a pull.",
  },
  {
    key: "castingDistance",
    label: "Casting distance",
    meaning:
      "How far you have to stay from the fish for the presentation to survive. Short means position and stealth matter more than reach.",
  },
  {
    key: "lureWeightBand",
    label: "Weight range",
    meaning:
      "The weight the presentation is balanced around. Outside this band the mechanics change even if the bait looks the same.",
  },
  {
    key: "coverResistance",
    label: "Cover resistance",
    meaning:
      "How much wood, weed or rock the setup has to fish through without hanging or breaking off.",
  },
  {
    key: "lineVisibilityPreference",
    label: "Line visibility",
    meaning:
      "Whether a low-visibility terminal end is doing real work here, or whether strength and abrasion resistance matter more.",
  },
  {
    key: "retieFrequency",
    label: "Retie frequency",
    meaning:
      "How often the connection is being loaded or abraded — and therefore how often it should be checked and rebuilt on the water.",
  },
];

function reader(value: string): string {
  return value.replaceAll("_", " ");
}

export function TackleRequirements({ result }: { result: Interpretation }) {
  const top = result.presentations[0];
  const equipment = result.equipment as Record<string, string>;
  const rows = AXES.filter((axis) => equipment[axis.key]);

  return (
    <section
      className="rounded-[var(--radius-lg)] bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8"
      aria-labelledby="tackle-requirements-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 id="tackle-requirements-heading" className="font-display text-2xl">
          What the tackle has to do
        </h3>
        <p className="text-sm text-muted">Requirements, not a shopping list.</p>
      </div>
      <p className="mt-3 max-w-3xl text-sm text-fg">
        {top
          ? `These follow from ${top.label}, not from the species. Change the presentation family and these change with it.`
          : "No presentation family is ranked for this combination, so there is nothing for the tackle to deliver yet."}
      </p>

      {rows.length > 0 && (
        <dl className="mt-5 grid gap-2 sm:grid-cols-2">
          {rows.map((axis) => (
            <div key={axis.key} className="rounded-[var(--radius-md)] bg-subtle px-4 py-3">
              <dt className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  {axis.label}
                </span>
                <span className="font-medium text-fg">{reader(equipment[axis.key])}</span>
              </dt>
              <dd className="mt-1.5 text-xs leading-relaxed text-muted">{axis.meaning}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          The connection
        </h4>
        <p className="mt-2 max-w-3xl text-sm text-fg">{result.connection.intent}</p>
        {result.connection.jobUndeclared && (
          <p className="mt-2 max-w-3xl border-l-2 border-line pl-3 text-xs leading-relaxed text-muted">
            {result.connection.jobUndeclared}
          </p>
        )}
        {result.connection.retieFrequency && (
          <p className="mt-2 text-xs text-muted">
            Expect to retie this joint{" "}
            <span className="text-fg">
              {result.connection.retieFrequency === "frequent"
                ? "often"
                : result.connection.retieFrequency === "rare"
                  ? "rarely"
                  : "now and then"}
            </span>
            .
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-2">
          {result.connection.priorities.map((priority) => (
            <li
              key={priority}
              className="rounded-full bg-subtle px-3 py-1.5 text-xs text-fg shadow-[var(--shadow-border)]"
            >
              {reader(priority)}
            </li>
          ))}
        </ul>
      </div>

      {result.rigQuestion && (
        <div className="instrument-rule mt-5 rounded-[var(--radius-md)] bg-subtle px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
            Check your rig can do this
          </p>
          <p className="mt-1.5 text-sm text-fg">{result.rigQuestion}</p>
        </div>
      )}
    </section>
  );
}
