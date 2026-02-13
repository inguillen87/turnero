import test from "node:test";
import assert from "node:assert/strict";
import { SALES_RUBROS, detectSalesRubro, buildSalesRubroPrompt } from "./sales-rubros.ts";

test("detectSalesRubro detects clinic-like input", () => {
  const rubro = detectSalesRubro("Tengo una clínica con 5 médicos y quiero automatizar turnos");
  assert.equal(rubro.slug, "clinica");
});

test("detectSalesRubro falls back to general", () => {
  const rubro = detectSalesRubro("Somos una empresa de servicios B2B", "general");
  assert.equal(rubro.slug, "general");
});

test("buildSalesRubroPrompt includes FAQ and discovery questions", () => {
  const rubro = SALES_RUBROS.find((r) => r.slug === "gimnasio")!;
  const prompt = buildSalesRubroPrompt(rubro);
  assert.match(prompt, /Preguntas de discovery sugeridas/);
  assert.match(prompt, /FAQ base/);
});
