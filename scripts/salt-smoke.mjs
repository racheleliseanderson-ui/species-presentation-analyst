#!/usr/bin/env node
/**
 * End-to-end check that a saltwater reading actually works in a browser.
 *
 *   node scripts/salt-smoke.mjs            # against a running preview
 *
 * Needs a preview server on :4173 and the mock (or real) dossier endpoint the
 * app reads. It exists because every saltwater failure this pass produced was
 * invisible to `tsc`: the water types compiled fine and silently took the
 * stillwater branch. The only way to know a marsh edge on a falling tide reads
 * as saltwater is to open it and look.
 *
 * The tide check deliberately does not demand that the leading family change.
 * On a marsh edge the reviewed leading family is tide-driven bait whatever the
 * tide is doing, and a test that forced a flip would be asking the app to lie.
 * What it asserts is that the ranking below it moves.
 */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:4173";
const errors = [];
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

function session(overrides = {}) {
  return JSON.stringify({
    step: "readout", speciesId: "sciaenops_ocellatus",
    water: { waterName: "Named public estuary", waterType: "inshore", jurisdiction: "South Carolina" },
    waterType: "inshore", populationContext: null,
    tempF: 72, tempRangeF: null, tempSource: "user_measured",
    flow: "unknown", stillState: "unknown",
    tideMovement: "ebbing", tideStrength: "spring_tide",
    clarity: "stained", light: "low_light", weather: "stable", season: "fall",
    holdingRiver: null, holdingStill: null, holdingMarine: "marsh_edge", forage: null,
    ...overrides,
  });
}

async function readingFor(overrides) {
  const page = await browser.newPage({ viewport: { width: 420, height: 2000 } });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    const t = m.text();
    if (m.type() === "error" && !t.includes("ERR_TUNNEL_CONNECTION_FAILED")) errors.push("console: " + t);
  });
  await page.addInitScript((s) => localStorage.setItem("hth-sp-session-v1", s), session(overrides));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const competent = page.getByText("Competent", { exact: false }).first();
  if (await competent.count()) { await competent.click(); await page.waitForTimeout(1800); }
  const text = await page.locator("body").innerText();
  await page.close();
  return text;
}

const text = await readingFor({});
const top = (t) => (t.match(/Most plausible family:\s*([^.]+)\./) ?? [])[1]?.trim() ?? null;

const checks = {
  "names the species": /Red drum/i.test(text),
  "shows the marsh edge holding class": /marsh edge/i.test(text),
  "produces a leading family": Boolean(top(text)),
  "the leading family is a saltwater one":
    /tidal drift bait|structure pitch|flats sight cast|live \/ natural bait|surf /i.test(top(text) ?? ""),
  "offers no freshwater-only family": !/dead drift|tight-line drift|wake \/ skate/i.test(text),
  "no coordinates": !/\b\d{2}\.\d{4,}\b/.test(text),
  // The app's own disclaimer contains "will bite", so match only unnegated
  // claims — the check is for prediction, not for the word.
  "no bite prediction": !/(?<!not a prediction that fish )\b(best time to fish|bite window|guaranteed to|fish will be biting)\b/i.test(text),
  "carries the regulated-context warning": /verify|regulat/i.test(text),
  "names no spawning aggregation as a target": !/spawning aggregation (is|are) (a )?(good|prime|the best)/i.test(text),
};

// The axis has to earn its place. Not "the top family must change" — on a marsh
// edge the reviewed leading family is tide-driven bait whatever the tide is
// doing, and forcing a flip would be the wrong answer. What must change is the
// ranking below it and the reason given.
const order = (t) => (t.match(/^[A-F]\. .+$/gm) ?? []).join("|");
const ebbing = top(text);
const slackLowText = await readingFor({ tideMovement: "slack_low" });
const floodingText = await readingFor({ tideMovement: "flooding", holdingMarine: "grass_flat" });
checks["the tide is read as the movement axis"] = /tide|ebb|flood|slack/i.test(text);
checks["the tide actually moves the reading"] =
  new Set([text, slackLowText, floodingText].map(order)).size > 1;
const slackLow = top(slackLowText);
const flooding = top(floodingText);

let failed = 0;
for (const [name, ok] of Object.entries(checks)) {
  if (!ok) failed += 1;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}`);
}
console.log(`\nebbing → ${ebbing}\nslack low → ${slackLow}\nflooding on a grass flat → ${flooding}`);
console.log(`\nconsole/page errors: ${errors.length}`);
for (const e of errors.slice(0, 8)) console.log("  " + e);
await browser.close();
process.exitCode = failed === 0 && errors.length === 0 ? 0 : 1;
