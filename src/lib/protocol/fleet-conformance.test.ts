/**
 * What the other six instruments actually send, read by this one.
 *
 * Every app in this fleet tests its own half of a handoff. Nothing tested the
 * join, and two failures found in a single afternoon were both joins: a reader
 * that could not read the fleet's own canonical forage word, and an instrument
 * that refused an entire hemisphere of water at the door. Both had passing
 * test suites the whole time, because each fed itself the shapes it was
 * written for.
 *
 * The fixtures are byte-identical in all seven repositories. When an emitter
 * changes shape, the sample changes there — a sample that has drifted from its
 * emitter is a test that passes while the fleet is broken.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { FLEET_SAMPLES, samplesFrom, samplesCarrying } from "../fleet-conformance.ts";
import { readIncoming } from "./packet.ts";

function deliver(sample: { packet: Record<string, unknown> }) {
  return readIncoming("#packet=" + encodeURIComponent(JSON.stringify(sample.packet)));
}

test("every instrument's packet survives the envelope", () => {
  for (const sample of FLEET_SAMPLES) {
    const read = deliver(sample);
    assert.equal(
      read.state,
      "ok",
      `${sample.id} (${sample.label}) was refused: ${read.state === "invalid" ? read.reason : ""}`,
    );
  }
});

test("something is applied from every sibling packet that carries water", () => {
  for (const sample of samplesFrom("species-presentation")) {
    if (!sample.carries.includes("water") && !sample.carries.includes("marine-water")) continue;
    const read = deliver(sample);
    if (read.state !== "ok") continue;
    /* `applied` is a partial scenario, not a list: count the fields that
       actually arrived with a value rather than asking it for a length it
       does not have. */
    const landed = Object.values(read.applied as Record<string, unknown>).filter(
      (v) => v !== null && v !== undefined,
    );
    assert.ok(
      landed.length > 0,
      `${sample.id} carried water and nothing at all was applied from it`,
    );
    assert.ok(
      read.carried.length > 0,
      `${sample.id} applied fields but showed the reader none of them`,
    );
  }
});

test("a marine packet is not read as fresh water", () => {
  for (const sample of samplesCarrying("marine-water")) {
    if (sample.from === "species-presentation") continue;
    const read = deliver(sample);
    if (read.state !== "ok") continue;
    const water = read.packet.water as Record<string, unknown> | undefined;
    const type = String(water?.["waterType"] ?? "");
    assert.ok(
      ["surf", "inshore", "nearshore", "offshore"].includes(type),
      `${sample.id} arrived carrying waterType "${type}"`,
    );
  }
});

test("an observed forage class survives the crossing", () => {
  for (const sample of samplesCarrying("forage")) {
    if (sample.from === "species-presentation") continue;
    const read = deliver(sample);
    if (read.state !== "ok") continue;
    const packet = read.packet as unknown as Record<string, unknown>;
    const forage =
      (packet["forage"] as Record<string, unknown> | undefined) ??
      ((packet["observations"] as Record<string, unknown> | undefined)?.["forage"] as
        Record<string, unknown> | undefined);
    assert.ok(forage?.["class"], `${sample.id} lost its forage class in transit`);
  }
});

test("the trail keeps its first hop", () => {
  for (const sample of samplesFrom("species-presentation")) {
    const read = deliver(sample);
    if (read.state !== "ok") continue;
    const trail = read.packet.fleet?.trail ?? [];
    assert.ok(trail.length > 0, `${sample.id} arrived with no trail`);
    assert.equal(trail[0]?.origin, sample.from, `${sample.id} lost its first hop`);
  }
});
