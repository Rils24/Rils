import { localized } from "@/lib/content";
import { getProfile } from "@/lib/data";
import { OG_SIZE, ogCard } from "@/lib/og";
import { siteUrl } from "@/lib/seo";

export const alt = "Syahril Aprialsyah — Web Developer";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Gambar Open Graph default untuk semua halaman publik. */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, profile] = await Promise.all([params, getProfile()]);
  const roles = profile
    ? localized(locale, profile.role_titles_id, profile.role_titles_en)
    : ["Web Developer"];

  return ogCard({
    eyebrow: roles.join(" · "),
    title: profile?.name ?? "Syahril Aprialsyah",
    subtitle: profile
      ? localized(locale, profile.bio_id, profile.bio_en)
      : null,
    footer: new URL(siteUrl()).host,
    brand: profile
      ? (localized(locale, profile.location_id, profile.location_en) ?? "")
      : "",
  });
}
