import test from "node:test";
import assert from "node:assert/strict";
import { fetchTenantEventsSince, publishTenantEvent } from "./realtime.ts";

test("realtime local backlog stores and fetches by sequence", async () => {
  const tenant = `test-${Date.now()}`;

  publishTenantEvent(tenant, { type: "appointment.created", title: "Nuevo turno", body: "A" });
  publishTenantEvent(tenant, { type: "payment.received", title: "Pago", body: "B" });

  await new Promise((r) => setTimeout(r, 20));

  const all = await fetchTenantEventsSince(tenant, 0, 10);
  assert.equal(all.length, 2);
  assert.ok((all[0].seq || 0) < (all[1].seq || 0));

  const afterFirst = await fetchTenantEventsSince(tenant, all[0].seq, 10);
  assert.equal(afterFirst.length, 1);
  assert.equal(afterFirst[0].title, "Pago");
});
