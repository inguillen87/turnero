import test from "node:test";
import assert from "node:assert/strict";
import {
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
