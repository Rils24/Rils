import { ArrowUpRight, ChevronDown, Download, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
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
import { HeroName, LETTER_STEP, NAME_START } from "./hero-name";
import { HeroTopoBg } from "./hero-topo-bg";

/** Waktu (detik) saat animasi per huruf nama selesai; bagian lain menyusul. */
function nameRevealEnd(name: string) {
  return NAME_START + name.replace(/\s/g, "").length * LETTER_STEP + 0.15;
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
      className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24 lg:min-h-[86vh] lg:flex lg:items-center"
    >
      <HeroTopoBg />
      <HeroParallax targetId="hero" />

      <Container className="relative w-full">
        {/* Panggung 3-kolom editorial ala referensi:
            Kiri: Nama besar uppercase | Tengah: Potret | Kanan: Peran + CTA */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Kolom Kiri — Lokasi & Nama Display */}
          <div
            data-parallax="name"
            className="relative z-20 order-1 lg:col-span-4 lg:-mr-8"
          >
            {location && (
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur-sm motion-safe:animate-fade-up">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-accent"
                />
                <MapPin aria-hidden="true" className="size-3.5 text-accent" />
                {location}
              </p>
            )}

            <h1
              id="hero-name"
              className="font-display text-[clamp(2.9rem,8vw,4.85rem)] leading-[0.92] font-black tracking-[-0.03em] uppercase lg:text-[clamp(3rem,4.9vw,4.75rem)]"
            >
              <HeroName
                lines={[
                  { text: firstName },
                  ...(rest.length
                    ? [
                        {
                          text: rest.join(" "),
                          className: "text-foreground/90",
                        },
                      ]
                    : []),
                ]}
              />
            </h1>

            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted motion-safe:animate-fade-up motion-safe:[animation-delay:280ms]">
              {bio}
            </p>
          </div>

          {/* Kolom Tengah — Panggung Potret */}
          <div
            data-parallax="photo"
            className="relative z-10 order-2 mx-auto w-full max-w-[18.5rem] sm:max-w-[21rem] lg:col-span-4 lg:max-w-none"
          >
            <HeroPhoto delay={0.18}>
              <CoverImage
                src={profile.hero_photo_url}
                alt={profile.name}
                placeholder={common("photoComingSoon")}
                sizes="(min-width: 1024px) 420px, 340px"
                priority
              />
            </HeroPhoto>
          </div>

          {/* Kolom Kanan — Peran Steel-Slate Uppercase & Tombol Pill CTA */}
          <div
            data-parallax="role"
            className="relative z-20 order-3 flex flex-col items-start lg:col-span-4 lg:pl-6"
          >
            {roles.length > 0 && (
              <div className="w-full motion-safe:animate-fade-up motion-safe:[animation-delay:220ms]">
                <HeroRoles
                  roles={roles}
                  label={t("roles")}
                  startDelay={after}
                />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:360ms]">
              <Magnetic>
                <Link href="/contact" className={buttonClass("primary", "lg")}>
                  {t("contact")}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
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
          </div>
        </div>

        {/* Penunjuk gulir halus di bagian bawah hero */}
        <div className="mt-14 hidden justify-center lg:flex">
          <a
            href="#services"
            className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-[0.12em] text-muted uppercase backdrop-blur-sm transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <span>{t("scrollCue")}</span>
            <ChevronDown
              aria-hidden="true"
              className="size-3.5 text-accent transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </Container>
    </section>
  );
}
