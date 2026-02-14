import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeBlockedRanges,
  sanitizeCountries,
  sanitizeEmail,
  sanitizeLocales,
  sanitizeText,
} from "./runtimeSanitizers.ts";

test("sanitizeText trims and caps length", () => {
  assert.equal(sanitizeText("  abcdef  ", 4), "abcd");
});

test("sanitizeEmail lowercases valid addresses", () => {
  assert.equal(sanitizeEmail("  SALES@Example.COM "), "sales@example.com");
});

test("sanitizeEmail rejects invalid values", () => {
  assert.equal(sanitizeEmail("not-an-email"), "");
});

test("sanitizeCountries handles csv and dedupes", () => {
  assert.deepEqual(sanitizeCountries("ar, br, ar, us"), ["AR", "BR", "US"]);
});

test("sanitizeCountries filters invalid values", () => {
  assert.deepEqual(sanitizeCountries(["ARG", "1A", "es"]), ["ES"]);
});

test("sanitizeLocales defaults when invalid", () => {
  assert.deepEqual(sanitizeLocales(["de-DE", "fr-FR"]), ["es-AR", "en-US", "pt-BR"]);
});

test("sanitizeLocales keeps supported locales", () => {
  assert.deepEqual(sanitizeLocales(["en-US", "pt-BR", "en-US"]), ["en-US", "pt-BR"]);
});

test("sanitizeBlockedRanges filters invalid or inverted ranges", () => {
  const input = [
    { id: "ok", startAt: "2026-01-10T10:00:00.000Z", endAt: "2026-01-10T11:00:00.000Z", reason: "  Corte de luz  " },
    { id: "bad1", startAt: "invalid", endAt: "2026-01-10T11:00:00.000Z" },
    { id: "bad2", startAt: "2026-01-10T12:00:00.000Z", endAt: "2026-01-10T11:00:00.000Z" },
  ];

  assert.deepEqual(sanitizeBlockedRanges(input), [
    {
      id: "ok",
      startAt: "2026-01-10T10:00:00.000Z",
      endAt: "2026-01-10T11:00:00.000Z",
      reason: "Corte de luz",
    },
  ]);
});

test("sanitizeBlockedRanges creates deterministic fallback id and reason", () => {
  const [first] = sanitizeBlockedRanges([
    { startAt: "2026-02-01T09:00:00.000Z", endAt: "2026-02-01T10:00:00.000Z", reason: "" },
  ]);

  assert.equal(first.id, "block-0-2026-02-01T09:00:00.000Z-2026-02-01T10:00:00.000Z");
  assert.equal(first.reason, "Bloqueo operativo");
});
