import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packetSummary } from "@/lib/engine/brief";
import { encodePacketHash, sanitizePacket } from "@/lib/hth-packet";
import { buildPacket } from "@/lib/protocol/packet";
import type { Interpretation, ScenarioInput } from "@/lib/protocol/types";
import { SITE_ORIGIN } from "@/lib/site";
import { speciesSlug } from "@/lib/knowledge/species-slug";
import { cn } from "@/lib/utils";

/**
 * A reading, as a link.
 *
 * Until now a finished reading lived in one `localStorage` blob on this device.
 * You could print it, download it as JSON or send it to another Hook app — but
 * you could not send it to a person, which is the thing anyone actually wants
 * to do with a reading they are pleased with or suspicious of.
 *
 * The scenario is encoded with the same packet the fleet handoffs use rather
 * than a second scheme invented for sharing. That has two consequences worth
 * knowing: the coordinate strip that runs on every outgoing packet runs on this
 * one too, and a link that arrives here lands in the carried-context panel that
 * already exists, where the reader can see every field before any of it is
 * applied. Nothing is silently restored.
 *
 * The fragment is the whole point. Everything after `#` stays in the browser
 * and never reaches a server log, so a shared reading is not a record of where
 * somebody was fishing sitting in an access log.
 */
export function ShareReading({
  input,
  result,
  className,
}: {
  input: ScenarioInput;
  result: Interpretation;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    const packet = sanitizePacket(buildPacket(input, result, { intent: "species" }));
    return `${SITE_ORIGIN}/${encodePacketHash(packet)}`;
  }, [input, result]);

  const summary = useMemo(() => packetSummary(input, result), [input, result]);
  const slug = speciesSlug(result.species);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the field below still holds the whole link */
    }
  }

  return (
    <section
      className={cn(
        "no-print rounded-[var(--radius-lg)] bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-6",
        className,
      )}
      aria-labelledby="share-reading-heading"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        Send it to a person, not an app
      </p>
      <h3 id="share-reading-heading" className="mt-2 font-display text-2xl">
        Link to this reading
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        The whole scenario travels in the link, so whoever opens it sees what you were looking at
        and can argue with it. They get the same three-state check you would: every field is listed
        before anything is applied, and they can decline the lot.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Link to this reading</span>
          <input
            readOnly
            value={link}
            onFocus={(event) => event.currentTarget.select()}
            className="min-h-11 w-full rounded-[var(--radius-sm)] bg-subtle px-3 font-mono text-xs text-fg shadow-[var(--shadow-border)] outline-none"
          />
        </label>
        <Button onClick={copy} className="min-h-11">
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>

      <dl className="mt-5 space-y-1.5 text-sm">
        {summary.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-dim">{row.label}</dt>
            <dd className="text-right text-fg">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs leading-relaxed text-dim">
        Coordinates are stripped on the way out, the same as on any handoff, and everything after
        the <code className="font-mono">#</code> stays in the browser rather than reaching a server
        log. Saved readings stay on this device.
      </p>

      <Link
        to="/species/$speciesId"
        params={{ speciesId: slug }}
        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-fg underline decoration-mark decoration-2 underline-offset-4"
      >
        Open the full {result.species.commonNames[0]} record
        <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
