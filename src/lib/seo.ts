import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

/**
 * URL publik situs. Urutan: NEXT_PUBLIC_SITE_URL (domain sendiri) →
 * domain produksi Vercel (otomatis tersedia di Vercel) → localhost.
 */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const OG_LOCALE: Record<Locale, string> = { id: "id_ID", en: "en_US" };

/** Path tanpa awalan bahasa, mis. "" (home), "/projects", "/blog/slug". */
export function localizedUrls(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${path}`]),
  ) as Record<Locale, string>;
  return {
    languages: {
      ...languages,
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}

/**
 * Metadata halaman publik: judul, deskripsi, canonical, hreflang (id/en/x-default),
 * Open Graph, dan Twitter card. Gambar OG datang dari file opengraph-image.
 */
export function pageMetadata({
  locale,
  path,
  title,
  ogTitle,
  description,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  locale: string;
  path: string;
  title?: string;
  /** Judul untuk Open Graph bila berbeda dari <title> (mis. di Home). */
  ogTitle?: string;
  description?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
}): Metadata {
  const l = (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  const url = `/${l}${path}`;
  const desc = description ?? undefined;
  const shareTitle = ogTitle ?? title;

  return {
    ...(title ? { title } : {}),
    ...(desc ? { description: desc } : {}),
    alternates: { canonical: url, ...localizedUrls(path) },
    openGraph: {
      type,
      url,
      siteName: "Syahril Aprialsyah",
      locale: OG_LOCALE[l],
      alternateLocale: routing.locales
        .filter((x) => x !== l)
        .map((x) => OG_LOCALE[x]),
      ...(shareTitle ? { title: shareTitle } : {}),
      ...(desc ? { description: desc } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(shareTitle ? { title: shareTitle } : {}),
      ...(desc ? { description: desc } : {}),
    },
  };
}

/** JSON aman untuk disisipkan di <script type="application/ld+json">. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
