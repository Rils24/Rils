import { Download } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
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
      aria-labelledby="about"
      className="border-t border-border py-20 md:py-28"
    >
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2
            id="about"
            className="font-display text-3xl font-bold tracking-tight sm:text-5xl"
          >
            {t("title")}
          </h2>
          {about && (
            <p className="mt-6 text-lg leading-relaxed text-muted">{about}</p>
          )}
          {profile.cv_url && (
            <a
              href={profile.cv_url}
              download
              className={buttonClass("secondary", "md", "mt-8")}
            >
              <Download aria-hidden="true" className="size-4" />
              {hero("downloadCv")}
            </a>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="text-sm font-semibold text-muted">{t("skills")}</h3>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {GROUPS.map((group) => {
              const items = skills.filter((s) => s.group_name === group);
              if (!items.length) return null;
              return (
                <div
                  key={group}
                  className="grid gap-3 py-5 sm:grid-cols-[8rem_1fr]"
                >
                  <dt className="font-display font-semibold">
                    {t(`groups.${group}`)}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <li
                          key={skill.id}
                          className="rounded-lg border border-border bg-surface px-3 py-1 text-sm"
                        >
                          {localized(locale, skill.name_id, skill.name_en)}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </Container>
    </section>
  );
}
