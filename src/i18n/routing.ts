import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  // Dipakai bila bahasa browser bukan Indonesia atau Inggris.
  defaultLocale: "id",
  // Selalu pakai awalan /id atau /en supaya kedua versi terindeks.
  localePrefix: "always",
  // Pilihan pengunjung disimpan di cookie NEXT_LOCALE (default next-intl).
});

export type Locale = (typeof routing.locales)[number];
