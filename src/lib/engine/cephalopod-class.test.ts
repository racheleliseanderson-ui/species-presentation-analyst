/**
 * The twelfth forage class.
 *
 * Hatch Match declared a cephalopod class in schema v8 and held no animal in
 * it, so the fleet's eleven-word forage vocabulary cost nothing. Its salt wave
 * put a squid in that class, and an observed squid then resolved to null on
 * the way here — Hatch's own mapper refused to file it under `mollusks`,
 * correctly, because a mollusc is a bottom problem and a squid is not.
 *
 * These lock the two things that make the new class worth having rather than
 * just present: it is a real word in the shared vocabulary, and it points the
 * reading somewhere different from the class it would otherwise have been
 * filed under.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { FORAGE_CLASSES, labelOf } from "../protocol/vocab.ts";
import { FORAGE_CLASSES as FLEET_FORAGE_CLASSES } from "../hth-packet.ts";
import { interpret } from "./infer.ts";
import type { Interpretation, ScenarioInput } from "../protocol/types.ts";

function marine(forageClass: "cephalopods" | "mollusks" | null): ScenarioInput {
  return {
    speciesId: "ophiodon_elongatus",
    water: { waterType: "nearshore" },
    waterType: "nearshore",
    populationContext: null,
    tempF: 52,
    tempRangeF: null,
    tempSource: "user_measured",
    flow: "unknown",
    stillState: "unknown",
    clarity: "clear",
    light: "low_light",
    weather: "stable",
    season: "summer",
    holdingRiver: null,
    holdingStill: null,
    forage: forageClass ? { class: forageClass, source: "user_observation" } : null,
  } as ScenarioInput;
}

function read(scenario: ScenarioInput): Interpretation {
  const result = interpret(scenario);
  assert.ok(!("error" in result), "expected a readable scenario");
  return result as Interpretation;
}

test("cephalopods is a class in this instrument and in the fleet's own vocabulary", () => {
  assert.ok(
    (FORAGE_CLASSES as readonly string[]).includes("cephalopods"),
    "the engine does not know the class",
  );
  assert.ok(
    (FLEET_FORAGE_CLASSES as readonly string[]).includes("cephalopods"),
    "the shared packet vocabulary does not know the class — the two have drifted",
  );
  assert.equal(labelOf("cephalopods" as never), "Squid / cephalopods");
});

test("a squid and a clam do not produce the same reading", () => {
  const squid = read(marine("cephalopods"));
  const clam = read(marine("mollusks"));
  const weightOf = (r: Interpretation, id: string) =>
    r.presentations.find((item) => item.id === id)?.weight ?? 0;

  /*
   * A lingcod eating squid is still a lingcod: it is a bottom ambush predator
   * with no swim bladder, and bottom contact stays the leading family in both
   * readings. What must NOT happen is that the two readings come out the same,
   * because they are answers to different questions. A clam is a bottom
   * problem end to end; a squid is a mid-column animal that this fish happens
   * to take from cover.
   */
  assert.ok(
    weightOf(clam, "bottom_contact") > weightOf(squid, "bottom_contact"),
    "a clam should push harder toward the bottom than a squid does",
  );
  assert.ok(
    weightOf(squid, "vertical_jig") > weightOf(clam, "vertical_jig"),
    "a squid should lift the families that work a profile up off the bottom",
  );

  const squidRank = squid.presentations.map((item) => item.id);
  const clamRank = clam.presentations.map((item) => item.id);
  assert.notDeepEqual(
    squidRank.slice(0, 3),
    clamRank.slice(0, 3),
    "filing a squid under mollusks would have produced an identical ranking",
  );
});

test("an observed squid names itself in the reading rather than going silent", () => {
  const squid = read(marine("cephalopods"));
  const text = JSON.stringify(squid).toLowerCase();
  assert.ok(text.includes("squid"), "the observation did not survive into the reading");
});
