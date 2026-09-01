const SUPPORT_URL =
  "https://www.buymeacoffee.com/northernlanternhouse?utm_source=hookthehorizon&utm_medium=footer&utm_campaign=bmc_support";

/**
 * First-party support link at the end of the document. No third-party script is
 * loaded and nothing floats over the app's controls — the right-hand padding
 * keeps it clear of the floating appearance control.
 */
export function SupportLink() {
  return (
    <aside
      aria-label="Support Hook the Horizon"
      className="no-print border-t border-line px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3 text-center"
      data-print="hide"
    >
      <a
        href={SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex min-h-11 items-center text-xs text-muted no-underline hover:text-fg"
      >
        Support the field notes <span aria-hidden="true">&nbsp;↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </aside>
  );
}
