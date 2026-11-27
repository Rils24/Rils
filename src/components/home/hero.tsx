import { Download, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  HeroFade,
  HeroName,
  HeroParallax,
  HeroPhoto,
  HeroRoles,
} from "@/components/motion/hero-motion";
import { Magnetic } from "@/components/motion/magnetic";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CoverImage } from "@/components/ui/cover-image";
import { localized } from "@/lib/content";
import type { Profile } from "@/lib/data";

/** Waktu (detik) saat animasi per huruf nama selesai; bagian lain menyusul. */
function nameRevealEnd(name: string) {
  return 0.15 + name.replace(/\s/g, "").length * 0.035 + 0.2;
}

export async function Hero({ profile }: { profile: Profile }) {
  const [locale, t, common] = await Promise.all([
    getLocale(),
    getTranslations("Hero"),
    getTranslations("Common"),
  ]);
  const roles = localized(
    locale,
    profile.role_titles_id,
    profile.role_titles_en,
  );
  const bio = localized(locale, profile.bio_id, profile.bio_en);
  const location = localized(locale, profile.location_id, profile.location_en);
  const [firstName, ...rest] = profile.name.split(" ");
  const after = nameRevealEnd(profile.name);

  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      <HeroParallax targetId="hero" />
      <Container>
        {location && (
          <HeroFade delay={0.05}>
            <p className="flex items-center gap-2 text-sm text-muted">
              <MapPin aria-hidden="true" className="size-4 text-accent" />
              {location}
            </p>
          </HeroFade>
        )}

        {/* Nama besar sebagai lapisan belakang; foto berada di lapisan depan.
            Ukuran nama dibatasi agar tetap terbaca utuh selama foto masih
            berupa placeholder padat (bukan PNG transparan). */}
        <div data-parallax="name" className="relative z-0">
          <h1
            id="hero-name"
            className="mt-6 font-display text-[clamp(3.25rem,11vw,8.75rem)] leading-[0.88] font-bold tracking-[-0.04em]"
          >
            <HeroName
              lines={[
                { text: firstName },
                ...(rest.length
                  ? [{ text: rest.join(" "), className: "text-muted" }]
                  : []),
              ]}
            />
          </h1>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-0 lg:grid-cols-12 lg:items-end">
          {/* Mulai sebelum nama selesai agar teks bio (kandidat LCP) cepat tampil. */}
          <HeroFade
            delay={Math.min(after, 0.6)}
            className="lg:col-span-6 lg:pt-16"
          >
            {roles.length > 0 && (
              <HeroRoles roles={roles} label={t("roles")} startDelay={after} />
            )}
            <p className="mt-5 max-w-xl text-lg text-muted">{bio}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/contact" className={buttonClass("primary", "lg")}>
                  {t("contact")}
                </Link>
              </Magnetic>
              {profile.cv_url && (
                <Magnetic>
                  <a
                    href={profile.cv_url}
                    download
                    className={buttonClass("secondary", "lg")}
                  >
                    <Download aria-hidden="true" className="size-4" />
                    {t("downloadCv")}
                  </a>
                </Magnetic>
              )}
            </div>
          </HeroFade>

          <div
            data-parallax="photo"
            className="relative z-10 mx-auto w-full max-w-[17rem] sm:max-w-xs lg:col-span-4 lg:col-start-9 lg:-mt-56 lg:max-w-none xl:-mt-64"
          >
            <HeroPhoto delay={0.2}>
              <CoverImage
                src={profile.hero_photo_url}
                alt={profile.name}
                placeholder={common("photoComingSoon")}
                sizes="(min-width: 1024px) 440px, 384px"
                priority
              />
            </HeroPhoto>
          </div>
        </div>
      </Container>
    </section>
  );
}
