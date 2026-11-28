import {
  ArrowUpRight,
  ClipboardList,
  CodeXml,
  Database,
  Download,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { localized } from "@/lib/content";
import type { Profile, Service } from "@/lib/data";

/** Nilai kolom `services.icon` → ikon. Nilai lain memakai ikon default. */
const ICONS: Record<string, LucideIcon> = {
  code: CodeXml,
  database: Database,
  clipboard: ClipboardList,
};

export async function Services({
  services,
  profile,
}: {
  services: Service[];
  profile?: Profile | null;
}) {
  if (!services.length) return null;
  const [locale, t, hero] = await Promise.all([
    getLocale(),
    getTranslations("Services"),
    getTranslations("Hero"),
  ]);

  const aboutExcerpt = profile
    ? localized(locale, profile.about_id, profile.about_en)
    : null;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative py-20 md:py-28"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Kolom Kiri — Tumpukan Kartu Layanan dengan Badge Ikon Cobalt */}
          <Stagger className="flex flex-col gap-4 lg:col-span-6">
            {services.map((service, index) => {
              const Icon = (service.icon && ICONS[service.icon]) || Layers;
              const num = String(index + 1).padStart(2, "0");
              return (
                <StaggerItem
                  key={service.id}
                  className={`group relative flex items-start gap-5 rounded-2xl border border-border/90 bg-surface/95 p-5 shadow-[0_14px_34px_-22px_rgba(0,0,0,0.65)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent-secondary/50 hover:shadow-[0_20px_44px_-20px_rgba(59,91,255,0.28)] sm:p-6 ${
                    index === 0
                      ? "md:-rotate-[0.65deg] md:hover:rotate-0"
                      : ""
                  }`}
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-secondary text-white shadow-[0_10px_24px_-6px_rgba(59,91,255,0.65)] transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:scale-105">
                    <Icon
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={1.9}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-base font-bold tracking-[0.04em] uppercase sm:text-lg">
                        {localized(locale, service.title_id, service.title_en)}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="font-display text-xs font-semibold text-muted/70 tabular-nums transition-colors group-hover:text-accent-secondary-text"
                      >
                        {num}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
                      {localized(
                        locale,
                        service.description_id,
                        service.description_en,
                      )}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* Kolom Kanan — Pitch Editorial "Why Hire Me" + Pill CTA */}
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1 text-xs font-semibold tracking-[0.16em] text-accent-secondary-text uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent-secondary"
              />
              {t("eyebrow")}
            </p>
            <h2
              id="services-heading"
              className="font-display text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.65rem]"
            >
              {t("title")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              {t("intro")}
            </p>
            {aboutExcerpt && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted/90">
                {aboutExcerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {profile?.cv_url ? (
                <Magnetic>
                  <a
                    href={profile.cv_url}
                    download
                    className={buttonClass("primary", "lg")}
                  >
                    <Download aria-hidden="true" className="size-4" />
                    {hero("downloadCv")}
                  </a>
                </Magnetic>
              ) : (
                <Magnetic>
                  <Link href="/contact" className={buttonClass("primary", "lg")}>
                    {hero("contact")}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </Magnetic>
              )}
              {profile?.cv_url && (
                <Magnetic>
                  <Link
                    href="/contact"
                    className={buttonClass("secondary", "lg")}
                  >
                    {hero("contact")}
                  </Link>
                </Magnetic>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
