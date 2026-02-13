import test from "node:test";
import assert from "node:assert/strict";
import { buildCampaignStats, isOptOutMessage, matchesSegmentation, parseCampaignStorage } from "./marketing-campaigns.ts";

test("opt-out keyword detection", () => {
  assert.equal(isOptOutMessage("BAJA"), true);
  assert.equal(isOptOutMessage("stop"), true);
  assert.equal(isOptOutMessage("hola"), false);
});

test("segmentation filters by opt-out/tag/rubro", () => {
  const contact = {
    phoneE164: "+5491111111111",
    tags: '["vip","paciente"]',
    lastSeen: new Date(),
    meta: '{"rubro":"dentista"}',
  };

  assert.equal(matchesSegmentation(contact, { tag: "vip", rubro: "dentista", lastSeenDays: 30 }, []), true);
  assert.equal(matchesSegmentation(contact, { tag: "premium" }, []), false);
  assert.equal(matchesSegmentation(contact, { rubro: "gimnasio" }, []), false);
  assert.equal(matchesSegmentation(contact, {}, ["+5491111111111"]), false);
});

test("campaign stats aggregates correctly", () => {
  const stats = buildCampaignStats([
    { id: "1", status: "sent", message: "a", sent: 10, failed: 2, attempted: 12, createdAt: new Date().toISOString() },
    { id: "2", status: "sent", message: "b", sent: 5, failed: 5, attempted: 10, createdAt: new Date().toISOString() },
  ]);
  assert.equal(stats.sent, 15);
  assert.equal(stats.failed, 7);
  assert.equal(stats.campaigns, 2);
  assert.equal(stats.deliveryRate, Math.round((15 / 22) * 100));
});

test("parse storage fallback shape", () => {
  const parsed = parseCampaignStorage('{"templates":[{"id":"1"}],"optOutPhones":["+1"]}');
  assert.ok(Array.isArray(parsed.templates));
  assert.ok(Array.isArray(parsed.history));
  assert.ok(Array.isArray(parsed.scheduled));
  assert.deepEqual(parsed.optOutPhones, ["+1"]);
});
