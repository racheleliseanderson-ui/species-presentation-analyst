import {
  ACROSS_FLEET,
  HOUSE_LEGAL_URL,
  HOUSE_NAME,
  HOUSE_SUPPORT_URL,
  HOUSE_URL,
  THIS_APP,
  THIS_PUBLICATION,
  type FleetLink,
} from "@/lib/fleet";

/**
 * The house footer, on every route.
 *
 * Addresses come from `src/lib/fleet.ts` and nowhere else. That file is the
 * same in every app in the house, so an instrument that moves is one edit
 * repeated, not a hunt through a different hard-coded list per repo.
 *
 * This app's own entry is text rather than a link: a link that reloads the page
 * you are already on is a small waste of a tap, and `aria-current="page"` says
 * the same thing to a screen reader that the styling says to everyone else.
 *
 * Every target is at least 44px tall, which is why the links are laid out as
 * blocks with vertical padding rather than as a run of inline text.
 */

const LINK_CLASS =
  "inline-flex min-h-11 items-center rounded-[var(--radius-xs)] px-2 py-2 text-sm text-muted no-underline hover:bg-subtle hover:text-fg";

function FleetAnchor({ link }: { link: FleetLink }) {
  const current = link.name === THIS_APP;
  if (current) {
    return (
      <span
        aria-current="page"
        className="inline-flex min-h-11 items-center rounded-[var(--radius-xs)] bg-subtle px-2 py-2 text-sm text-fg"
      >
        {link.name}
        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
          you are here
        </span>
      </span>
    );
  }
  return (
    <a href={link.url} className={LINK_CLASS}>
      {link.name}
    </a>
  );
}

export function FleetFooter() {
  return (
    <footer
      className="no-print border-t border-line bg-elevated"
      aria-labelledby="fleet-footer-heading"
      data-print="hide"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 id="fleet-footer-heading" className="sr-only">
          Northern Lantern House and the rest of the fleet
        </h2>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <section aria-labelledby="fleet-this-publication">
            <h3
              id="fleet-this-publication"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim"
            >
              This publication
            </h3>
            <p className="mt-2">
              <a
                href={THIS_PUBLICATION.publication.url}
                className={`${LINK_CLASS} font-display text-lg text-fg`}
              >
                {THIS_PUBLICATION.publication.name}
              </a>
            </p>
            <ul className="mt-1 flex flex-col">
              {THIS_PUBLICATION.apps.map((app) => (
                <li key={app.url}>
                  <FleetAnchor link={app} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="fleet-across">
            <h3
              id="fleet-across"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim"
            >
              Across the fleet
            </h3>
            <ul className="mt-2 grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              {ACROSS_FLEET.map((group) => (
                <li key={group.publication.url}>
                  <a href={group.publication.url} className={`${LINK_CLASS} font-medium text-fg`}>
                    {group.publication.name}
                  </a>
                  <ul className="flex flex-col">
                    {group.apps.map((app) => (
                      <li key={app.url}>
                        <a href={app.url} className={`${LINK_CLASS} text-xs`}>
                          {app.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-xs text-dim">
            Built by{" "}
            <a href={HOUSE_URL} className="text-muted underline underline-offset-4 hover:text-fg">
              {HOUSE_NAME}
            </a>
          </p>
          <nav aria-label="House" className="flex flex-wrap items-center gap-1">
            <a href={HOUSE_URL} className={LINK_CLASS}>
              Northern Lantern House
            </a>
            <a href={HOUSE_LEGAL_URL} className={LINK_CLASS}>
              Legal &amp; accessibility
            </a>
            <a href={HOUSE_SUPPORT_URL} className={LINK_CLASS}>
              Customer support
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
