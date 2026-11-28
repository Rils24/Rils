import { ArrowUpRight, ChevronDown, Download, MapPin } from "lucide-react";
import Image from "next/image";
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
import { localized } from "@/lib/content";
import type { Profile } from "@/lib/data";
import { HeroName, LETTER_STEP, NAME_START } from "./hero-name";
import { HeroTopoBg } from "./hero-topo-bg";

/** Potret tanpa latar (WebP transparan, 3:4) agar menyatu di tema terang & gelap. */
const HERO_PORTRAIT_SRC = "/images/hero-portrait.webp";

/** Waktu (detik) saat animasi per huruf nama selesai; bagian lain menyusul. */
function nameRevealEnd(name: string) {
  return NAME_START + name.replace(/\s/g, "").length * LETTER_STEP + 0.15;
}

export async function Hero({ profile }: { profile: Profile }) {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Hero"),
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
      className="relative flex flex-col overflow-hidden border-b border-border pt-28 md:pt-32 lg:min-h-[88vh]"
    >
      <HeroTopoBg />
      <HeroParallax targetId="hero" />

      <Container className="relative flex w-full flex-1 flex-col">
        {/* Panggung 3-kolom editorial: proporsi kiri lebih lebar agar nama panjang
            (mis. APRIALSYAH) selalu utuh satu baris tanpa pernah terpotong.
            Potret berdiri di garis bawah hero (rata bawah), teks di tengah. */}
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* Kolom Kiri — Lokasi, Nama Display Utuh & Bio Singkat */}
          <div data-parallax="name" className="relative z-20 order-1 lg:pb-16">
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
              className="font-display text-[clamp(2.25rem,7.2vw,3.85rem)] leading-[0.94] font-black tracking-[-0.03em] uppercase lg:text-[clamp(2.25rem,3.45vw,3.65rem)]"
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

            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted motion-safe:animate-fade-up motion-safe:[animation-delay:260ms] sm:text-base">
              {bio}
            </p>

            {/* Penunjuk gulir halus */}
            <a
              href="#services"
              className="group mt-8 hidden items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-[0.12em] text-muted uppercase backdrop-blur-sm transition-colors hover:border-foreground/30 hover:text-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:380ms] lg:inline-flex"
            >
              <span>{t("scrollCue")}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 text-accent transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </div>

          {/* Kolom Tengah — potret berdiri di garis bawah hero. -mb-2: sedikit
              melewati garis (dipotong overflow section) agar efek tilt tidak
              pernah memperlihatkan celah di bawah lengan. */}
          <div
            data-parallax="photo"
            className="relative z-10 order-3 mx-auto -mb-2 w-full max-w-[21rem] self-end sm:max-w-[25rem] lg:order-2 lg:-mx-[12%] lg:w-[124%] lg:max-w-none"
          >
            <HeroPhoto delay={0.16}>
              <Image
                src={HERO_PORTRAIT_SRC}
                alt={profile.name}
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 400px, 336px"
                priority
                className="object-contain object-bottom"
              />
            </HeroPhoto>
          </div>

          {/* Kolom Kanan — Peran Steel-Slate Uppercase & Tombol Pill CTA */}
          <div
            data-parallax="role"
            className="relative z-20 order-2 flex flex-col items-start lg:order-3 lg:pb-16 lg:pl-2"
          >
            {roles.length > 0 && (
              <div className="w-full motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
                <HeroRoles
                  roles={roles}
                  label={t("roles")}
                  startDelay={after}
                />
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:320ms]">
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
      </Container>
    </section>
  );
}
