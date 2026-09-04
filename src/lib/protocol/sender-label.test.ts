import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildPacket, encodePacketHash } from "../hth-packet.ts";
import { readIncoming } from "./packet.ts";

/**
 * The banner names the instrument, not the slug.
 *
 * What arrives on the wire is `field-ops-desk`, and this screen printed it
 * raw: somebody who had just pressed a button in the Field Ops Desk was told
 * "Sent over by field-ops-desk". The registry has known the real names the
 * whole time. An origin the registry has never heard of still falls through to
 * whatever arrived, because a strange label is better than a confident wrong
 * one.
 */
describe("who the carry says it came from", () => {
  it("resolves a fleet origin to the instrument's name", () => {
    const packet = buildPacket({ origin: "field-ops-desk", water: { waterName: "Provo" } });
    const carry = readIncoming(encodePacketHash(packet));
    assert.equal(carry.state, "ok");
    if (carry.state !== "ok") return;
    assert.equal(carry.from, "Field Ops Desk");
  });

  it("falls through to the raw origin for a sender nobody has registered", () => {
    const packet = buildPacket({ origin: "some-new-instrument" });
    const carry = readIncoming(encodePacketHash(packet));
    assert.equal(carry.state, "ok");
    if (carry.state !== "ok") return;
    assert.equal(carry.from, "some-new-instrument");
  });
});
