import type { Locale } from "@/i18n/routing";

function isFilled(value: unknown) {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Pilih versi bahasa dari kolom berpasangan `_id` / `_en`.
 * Bila versi Inggris kosong, tampilkan versi Indonesia (sesuai PRD).
 *
 *   localized(locale, project.title_id, project.title_en)
 */
export function localized<T>(
  locale: Locale | string,
  idValue: T,
  enValue: T | null | undefined,
): T {
  return locale === "en" && isFilled(enValue) ? (enValue as T) : idValue;
}

/** Estimasi waktu baca (menit) dari teks Markdown, ~200 kata per menit. */
export function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
