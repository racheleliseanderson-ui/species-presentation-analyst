#!/usr/bin/env node
/**
 * Are the sources still there?
 *
 * Every claim in this catalogue points at an agency or peer-reviewed page, and
 * the reading shows the reader that citation. Agencies reorganise constantly —
 * a state DNR redesign can quietly break a hundred links, and the app will keep
 * printing them as though they still resolve. A dead citation does not make the
 * biology wrong, but it does mean nobody can check it, and a claim nobody can
 * check is the thing this product exists not to publish.
 *
 *   node --experimental-strip-types scripts/check-sources.mjs [--fix] [--limit=N]
 *
 * Without --fix it changes nothing. With --fix it rewrites a citation URL only
 * when the page moved permanently and stayed on the same domain. A source that
 * moved to a different domain is never rewritten automatically: that is exactly
 * what an expired agency domain picked up by somebody else looks like, and a
 * script cannot tell the difference between a genuine migration and a parked
 * page. Those land in the report for a person to read.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { ROOT, loadDossierIndex, sourceUrlIndex, today } from "./dossier-index.mjs";

const REPORT_DIR = join(ROOT, "reports");
const USER_AGENT = "HookTheHorizon-SourceCheck/1.0 (+https://species.hookthehorizon.blog)";

/**
 * Registrable domain, near enough. Handles the two-part public suffixes that
 * actually appear in this catalogue — gov.uk, co.uk, gc.ca, on.ca and friends —
 * because agency sources cluster there and a naive last-two-labels rule would
 * call every .gov.uk page the same domain as every other.
 */
const TWO_PART_SUFFIXES = new Set([
  "gov.uk", "co.uk", "org.uk", "ac.uk", "gc.ca", "on.ca", "bc.ca", "ab.ca", "qc.ca",
  "com.au", "gov.au", "org.au", "edu.au", "co.nz", "govt.nz", "co.za",
]);

export function registrableDomain(hostname) {
  const labels = hostname.toLowerCase().replace(/\.$/, "").split(".");
  if (labels.length < 2) return hostname.toLowerCase();
  const lastTwo = labels.slice(-2).join(".");
  if (TWO_PART_SUFFIXES.has(lastTwo) && labels.length >= 3) return labels.slice(-3).join(".");
  return lastTwo;
}

/**
 * May this move be applied without a human looking at it?
 *
 * Same registrable domain, and never a downgrade out of https. Everything else
 * is reported instead.
 */
export function isSafeRedirect(fromUrl, toUrl) {
  let from;
  let to;
  try {
    from = new URL(fromUrl);
    to = new URL(toUrl);
  } catch {
    return false;
  }
  if (to.protocol !== "https:" && from.protocol === "https:") return false;
  if (to.protocol !== "https:" && to.protocol !== "http:") return false;
  return registrableDomain(from.hostname) === registrableDomain(to.hostname);
}

export function classify({ status, chain, error }) {
  if (error) return "unreachable";
  if (status === 404 || status === 410) return "gone";
  if (status === 401 || status === 403 || status === 429) return "unverifiable";
  if (status >= 500) return "unverifiable";
  if (status >= 200 && status < 300) {
    return chain.some((hop) => hop.status === 301 || hop.status === 308) ? "moved" : "ok";
  }
  return "unverifiable";
}

async function probe(url, timeoutMs) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 6; hop += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetch(current, {
        method: hop === 0 ? "HEAD" : "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": USER_AGENT, accept: "*/*" },
      });
    } catch (error) {
      clearTimeout(timer);
      // Plenty of agency servers simply refuse HEAD. One retry as GET before
      // calling a source unreachable, or the report fills with false alarms.
      if (hop === 0) {
        try {
          const retryController = new AbortController();
          const retryTimer = setTimeout(() => retryController.abort(), timeoutMs);
          response = await fetch(current, {
            method: "GET",
            redirect: "manual",
            signal: retryController.signal,
            headers: { "user-agent": USER_AGENT, accept: "*/*" },
          });
          clearTimeout(retryTimer);
        } catch (retryError) {
          return { finalUrl: current, status: 0, chain, error: String(retryError.message ?? retryError) };
        }
      } else {
        return { finalUrl: current, status: 0, chain, error: String(error.message ?? error) };
      }
    }
    clearTimeout(timer);

    // A HEAD that is refused rather than answered is not evidence of anything.
    if (hop === 0 && (response.status === 405 || response.status === 501)) {
      const retry = await fetch(current, {
        method: "GET",
        redirect: "manual",
        headers: { "user-agent": USER_AGENT, accept: "*/*" },
      }).catch((error) => ({ error }));
      if (retry?.error) return { finalUrl: current, status: 0, chain, error: String(retry.error) };
      response = retry;
    }

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      const next = new URL(location, current).toString();
      chain.push({ from: current, to: next, status: response.status });
      current = next;
      continue;
    }
    return { finalUrl: current, status: response.status, chain, error: null };
  }
  return { finalUrl: current, status: 0, chain, error: "too many redirects" };
}

async function runPool(items, size, worker) {
  const results = [];
  let cursor = 0;
  const lanes = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(lanes);
  return results;
}

/**
 * Rewrite a URL by replacing the quoted literal, not by re-serialising the file.
 *
 * The JSON dossiers are CRLF and hand-formatted, and half the records still
 * live in TypeScript. Round-tripping either through a parser would reformat the
 * whole file and bury a one-line citation fix in a two-thousand-line diff.
 * Quoting both sides makes the match exact, so a URL that is a prefix of
 * another cannot be clipped.
 */
export function replaceUrlInText(text, fromUrl, toUrl) {
  const needle = '"' + fromUrl + '"';
  if (!text.includes(needle)) return { text, count: 0 };
  const count = text.split(needle).length - 1;
  return { text: text.split(needle).join('"' + toUrl + '"'), count };
}

function applyFix(files, fromUrl, toUrl) {
  let changed = 0;
  for (const file of new Set(files)) {
    const original = readFileSync(file, "utf8");
    const { text, count } = replaceUrlInText(original, fromUrl, toUrl);
    if (count === 0) continue;
    writeFileSync(file, text);
    changed += count;
  }
  return changed;
}

function arg(name, fallback) {
  const hit = process.argv.find((value) => value.startsWith("--" + name + "="));
  return hit ? Number(hit.split("=")[1]) : fallback;
}

function writeReport(payload) {
  mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = today();
  const jsonPath = join(REPORT_DIR, "source-check-" + stamp + ".json");
  const mdPath = join(REPORT_DIR, "source-check-" + stamp + ".md");
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + "\n");

  const lines = [];
  lines.push("# Source check — " + stamp);
  lines.push("");
  lines.push(
    payload.checked + " citation addresses checked across " + payload.speciesTouched + " species. " +
      payload.counts.ok + " answered, " + payload.counts.moved + " moved, " + payload.counts.gone +
      " are gone, " + payload.counts.unreachable + " could not be reached, " + payload.counts.unverifiable +
      " refused to say.",
  );
  lines.push("");

  const section = (title, note, items, render) => {
    if (!items.length) return;
    lines.push("## " + title);
    lines.push("");
    if (note) {
      lines.push(note);
      lines.push("");
    }
    for (const item of items) lines.push(render(item));
    lines.push("");
  };

  section(
    "Gone",
    "These addresses answered 404 or 410. The claim behind each one now has no citation a reader can open, which is the thing this catalogue promises not to do. Find the source again or move the claim into `gaps`.",
    payload.results.filter((r) => r.verdict === "gone"),
    (r) =>
      "- " + r.url + "\n  - cited by: " + r.cites.map((c) => c.speciesId + "/" + c.kind).join(", ") +
      "\n  - label: " + (r.cites[0]?.label ?? ""),
  );

  section(
    "Moved to another domain — needs a person",
    "A permanent redirect that left the original domain. Usually a real agency migration, occasionally a lapsed domain somebody else now owns. Open each one before trusting it.",
    payload.results.filter((r) => r.verdict === "moved" && !r.safeToFix),
    (r) => "- " + r.url + "\n  - now: " + r.finalUrl + "\n  - cited by: " + r.cites.map((c) => c.speciesId + "/" + c.kind).join(", "),
  );

  section(
    payload.fixed ? "Moved and updated" : "Moved on the same domain",
    payload.fixed
      ? "Same domain, permanent redirect, so the citation was pointed at the new address. No claim changed."
      : "Same domain, permanent redirect. Run with --fix to point the citations at the new addresses.",
    payload.results.filter((r) => r.verdict === "moved" && r.safeToFix),
    (r) => "- " + r.url + "\n  - now: " + r.finalUrl,
  );

  section(
    "Could not be reached",
    "Timeouts, DNS failures, TLS errors. Often the network rather than the source. Worth a second run before treating any of these as dead.",
    payload.results.filter((r) => r.verdict === "unreachable"),
    (r) => "- " + r.url + " — " + r.error,
  );

  section(
    "Refused to answer",
    "403, 429 or a server error. The page may be perfectly fine and simply dislikes an automated request. Not evidence of anything; listed so nobody assumes it was checked.",
    payload.results.filter((r) => r.verdict === "unverifiable"),
    (r) => "- " + r.url + " — HTTP " + r.status,
  );

  writeFileSync(mdPath, lines.join("\n") + "\n");
  return { jsonPath, mdPath };
}

async function main() {
  const fix = process.argv.includes("--fix");
  const limit = arg("limit", Infinity);
  const concurrency = arg("concurrency", 6);
  const timeoutMs = arg("timeout", 20_000);

  const index = await loadDossierIndex();
  const urls = sourceUrlIndex(index.entries).slice(0, limit);

  console.log("  " + urls.length + " distinct citation addresses to check.");
  console.log("  " + (fix ? "Same-domain moves will be applied." : "Reading only — nothing will be changed."));
  console.log("");

  let done = 0;
  const results = await runPool(urls, concurrency, async ({ url, cites }) => {
    const probed = await probe(url, timeoutMs);
    const verdict = classify(probed);
    done += 1;
    if (verdict !== "ok") {
      console.log("  " + verdict.toUpperCase().padEnd(13) + url);
    } else if (done % 25 === 0) {
      console.log("  ...checked " + done + " of " + urls.length);
    }
    return {
      url,
      finalUrl: probed.finalUrl,
      status: probed.status,
      error: probed.error,
      verdict,
      safeToFix: verdict === "moved" && isSafeRedirect(url, probed.finalUrl),
      cites,
    };
  });

  let fixed = 0;
  if (fix) {
    for (const result of results) {
      if (result.verdict !== "moved" || !result.safeToFix) continue;
      fixed += applyFix(result.cites.map((c) => c.file), result.url, result.finalUrl);
    }
  }

  const counts = { ok: 0, moved: 0, gone: 0, unreachable: 0, unverifiable: 0 };
  for (const result of results) counts[result.verdict] += 1;

  const payload = {
    checkedAt: today(),
    checked: results.length,
    speciesTouched: new Set(results.flatMap((r) => r.cites.map((c) => c.speciesId))).size,
    counts,
    fixed,
    results,
  };
  const { mdPath } = writeReport(payload);

  console.log("");
  console.log("  " + counts.ok + " answered. " + counts.moved + " moved. " + counts.gone + " gone. " +
    counts.unreachable + " unreachable. " + counts.unverifiable + " refused to say.");
  if (fix) console.log("  " + fixed + " citations repointed. No claim was changed.");
  console.log("  Written to " + mdPath.replace(ROOT, "").replace(/^[\\/]/, ""));
  console.log("");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
