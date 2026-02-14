const ALLOWED_LOCALES = ["es-AR", "en-US", "pt-BR"] as const;

type AllowedLocale = (typeof ALLOWED_LOCALES)[number];

export function sanitizeText(input: unknown, maxLength: number): string {
  return String(input || "").trim().slice(0, maxLength);
}

export function sanitizeEmail(input: unknown): string {
  const normalized = sanitizeText(input, 120).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : "";
}

export function sanitizeCountries(input: unknown): string[] {
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(",")
      : [];

  const unique = new Set<string>();
  for (const value of values) {
    const normalized = String(value || "")
      .trim()
      .toUpperCase();

    if (/^[A-Z]{2}$/.test(normalized)) {
      unique.add(normalized);
    }

    if (unique.size >= 20) break;
  }

  return Array.from(unique);
}

export function sanitizeLocales(input: unknown): AllowedLocale[] {
  if (!Array.isArray(input)) return [...ALLOWED_LOCALES];

  const unique = new Set<AllowedLocale>();
  for (const value of input) {
    const normalized = String(value || "").trim();
    if (ALLOWED_LOCALES.includes(normalized as AllowedLocale)) {
      unique.add(normalized as AllowedLocale);
    }
    if (unique.size >= ALLOWED_LOCALES.length) break;
  }

  return unique.size > 0 ? Array.from(unique) : [...ALLOWED_LOCALES];
}
