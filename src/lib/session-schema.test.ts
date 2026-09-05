import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SESSION_SCHEMA,
  migrate,
  readEnvelope,
  sanitizeSession,
  writeEnvelope,
} from "./session-schema.ts";

const base = {
  step: "readout",
  speciesId: "salmo_trutta",
  waterType: "flowing",
  flow: "moderate",
  stillState: "unknown",
  clarity: "clear",
  light: "low_light",
  weather: "stable",
  season: "spring",
  tempSource: "user_measured",
  tideMovement: "unknown",
  tideStrength: "unknown",
  holdingRiver: "seam",
  holdingStill: null,
  holdingMarine: null,
  tempF: 54,
};

describe("a stored reading survives the build that stored it", () => {
  it("reads a payload written before versioning existed", () => {
    const read = readEnvelope<typeof base>(JSON.stringify(base));
    assert.ok(read);
    assert.equal(read.version, 1, "an unstamped payload is schema 1, not a reject");
    assert.equal(read.data.speciesId, "salmo_trutta");
  });

  it("round-trips a payload it wrote itself", () => {
    const read = readEnvelope<typeof base>(writeEnvelope(base));
    assert.ok(read);
    assert.equal(read.version, SESSION_SCHEMA);
    assert.deepEqual(read.data, base);
  });

  it("refuses a payload from a schema this build has never seen", () => {
    /*
     * Real case, not defensive padding: the same person opens the app on a
     * phone that already ran a later deploy, or a rollback puts an older build
     * in front of newer storage. A forward migration cannot be run backwards,
     * so reading it optimistically is the one situation where the shape really
     * is different and nothing here knows how.
     */
    assert.equal(migrate(base, SESSION_SCHEMA + 1), null);
  });

  it("reports that it migrated, rather than migrating in silence", () => {
    const stepped = migrate(base, 1);
    assert.ok(stepped);
    assert.equal(stepped.migrated, SESSION_SCHEMA > 1);
  });

  it("survives storage that is not JSON at all", () => {
    assert.equal(readEnvelope("}{ not json"), null);
    assert.equal(readEnvelope(null), null);
  });
});

describe("a word the build no longer knows never reaches the engine", () => {
  it("drops a retired holding class instead of passing it through", () => {
    /*
     * This is the failure the module exists for. Marine holding arrived after
     * freshwater; the fleet added a twelfth forage class; the salt wave added
     * four water types. Any of those is a word that could be sitting in a
     * stored reading and no longer be a word the solver knows — and the old
     * loader merged it straight in, so the reading came back thinner with
     * nothing saying why.
     */
    const { session, dropped } = sanitizeSession({ ...base, holdingRiver: "gravel_shelf_v0" });
    assert.equal(session.holdingRiver, null);
    assert.ok(dropped.includes("holdingRiver"));
  });

  it("falls an unrecognised condition back to unknown, which the app can draw", () => {
    const { session, dropped } = sanitizeSession({ ...base, clarity: "gin" });
    assert.equal(session.clarity, "unknown");
    assert.ok(dropped.includes("clarity"));
  });

  it("does not report a value that was already unknown as dropped", () => {
    const { dropped } = sanitizeSession({ ...base, clarity: "unknown" });
    assert.ok(!dropped.includes("clarity"));
  });

  it("sends the reading back to the target step when the fish has left the catalog", () => {
    /*
     * Not hypothetical inside this fleet: largemouth bass is
     * `Micropterus salmoides` in one sibling catalogue and
     * `Micropterus nigricans` in this one.
     */
    const { session, dropped } = sanitizeSession({ ...base, speciesId: "micropterus_salmoides" });
    assert.equal(session.speciesId, null);
    assert.equal(session.step, "target");
    assert.ok(dropped.includes("speciesId"));
  });

  it("keeps a real species and a real holding class untouched", () => {
    const { session, dropped } = sanitizeSession({ ...base });
    assert.deepEqual(dropped, []);
    assert.equal(session.speciesId, "salmo_trutta");
    assert.equal(session.holdingRiver, "seam");
    assert.equal(session.tempF, 54);
  });

  it("rejects a water temperature no thermometer in water produced", () => {
    assert.equal(sanitizeSession({ ...base, tempF: 4000 }).session.tempF, null);
    assert.equal(sanitizeSession({ ...base, tempF: -12 }).session.tempF, null);
    assert.equal(sanitizeSession({ ...base, tempF: 54 }).session.tempF, 54);
  });

  it("never invents a value to replace one it dropped", () => {
    /*
     * The whole product refuses to fill a gap to look complete. A restore is
     * not the place to start. Everything dropped lands on `unknown` or `null`,
     * both of which this app already renders honestly.
     */
    const { session } = sanitizeSession({
      ...base,
      clarity: "nonsense",
      season: "nonsense",
      holdingRiver: "nonsense",
    });
    assert.equal(session.clarity, "unknown");
    assert.equal(session.season, "unknown");
    assert.equal(session.holdingRiver, null);
  });
});
