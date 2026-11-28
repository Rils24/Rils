import { Download } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { localized } from "@/lib/content";
import type { Profile, Skill } from "@/lib/data";

const GROUPS = ["frontend", "backend", "database", "other"] as const;

export async function About({
  profile,
  skills,
}: {
  profile: Profile;
  skills: Skill[];
}) {
  const [locale, t, hero] = await Promise.all([
    getLocale(),
    getTranslations("About"),
    getTranslations("Hero"),
  ]);
  const about = localized(locale, profile.about_id, profile.about_en);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border/70 py-20 md:py-28"
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-5">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1 text-xs font-semibold tracking-[0.16em] text-accent-secondary-text uppercase">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent-secondary"
            />
            {t("eyebrow")}
          </p>
          <h2
            id="about-heading"
            className="font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-5xl"
          >
            {t("title")}
          </h2>
          {about && (
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {about}
            </p>
          )}
          {profile.cv_url && (
            <div className="mt-8">
              <Magnetic>
                <a
                  href={profile.cv_url}
                  download
                  className={buttonClass("secondary", "lg")}
                >
                  <Download aria-hidden="true" className="size-4" />
                  {hero("downloadCv")}
                </a>
              </Magnetic>
            </div>
          )}
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="mb-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            {t("skills")}
          </h3>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {GROUPS.map((group) => {
              const items = skills.filter((s) => s.group_name === group);
              if (!items.length) return null;
              return (
                <StaggerItem
                  key={group}
                  className="rounded-2xl border border-border/90 bg-surface/95 p-5 transition-colors hover:border-accent-secondary/50"
                >
                  <p className="font-display text-sm font-bold tracking-[0.08em] text-accent-secondary-text uppercase">
                    {t(`groups.${group}`)}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <li
                        key={skill.id}
                        className="rounded-full border border-border bg-surface-2/70 px-3 py-1 text-xs font-medium text-foreground/90 transition-colors hover:border-foreground/30"
                      >
                        {localized(locale, skill.name_id, skill.name_en)}
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
