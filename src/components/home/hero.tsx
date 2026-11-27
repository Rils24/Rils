import { Download, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CoverImage } from "@/components/ui/cover-image";
import { localized } from "@/lib/content";
import type { Profile } from "@/lib/data";

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

  return (
    <section
      aria-labelledby="hero-name"
      className="overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28"
    >
      <Container>
        {location && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <MapPin aria-hidden="true" className="size-4 text-accent" />
            {location}
          </p>
        )}

        {/* Nama besar sebagai lapisan belakang; foto berada di lapisan depan.
            Ukuran nama dibatasi agar tetap terbaca utuh selama foto masih
            berupa placeholder padat (bukan PNG transparan). */}
        <h1
          id="hero-name"
          className="relative z-0 mt-6 font-display text-[clamp(3.25rem,11vw,8.75rem)] leading-[0.88] font-bold tracking-[-0.04em]"
        >
          <span className="block">{firstName}</span>
          {rest.length > 0 && (
            <span className="block text-muted">{rest.join(" ")}</span>
          )}
        </h1>

        <div className="mt-10 grid gap-10 lg:mt-0 lg:grid-cols-12 lg:items-end">
          <div className="order-2 lg:order-1 lg:col-span-6 lg:pt-16">
            {roles.length > 0 && (
              <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                <span className="sr-only">{t("roles")}: </span>
                {roles.map((role, i) => (
                  <span key={role}>
                    {i > 0 && (
                      <>
                        {" "}
                        <span aria-hidden="true" className="text-accent">
                          /
                        </span>{" "}
                      </>
                    )}
                    <span
                      className={`whitespace-nowrap ${i === 0 ? "" : "text-muted"}`}
                    >
                      {role}
                    </span>
                  </span>
                ))}
              </p>
            )}
            <p className="mt-5 max-w-xl text-lg text-muted">{bio}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={buttonClass("primary", "lg")}>
                {t("contact")}
              </Link>
              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  download
                  className={buttonClass("secondary", "lg")}
                >
                  <Download aria-hidden="true" className="size-4" />
                  {t("downloadCv")}
                </a>
              )}
            </div>
          </div>

          <div className="relative z-10 order-1 mx-auto w-full max-w-sm lg:order-2 lg:col-span-4 lg:col-start-9 lg:-mt-56 lg:max-w-none xl:-mt-64">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-2">
              <CoverImage
                src={profile.hero_photo_url}
                alt={profile.name}
                placeholder={common("photoComingSoon")}
                sizes="(min-width: 1024px) 440px, 384px"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
