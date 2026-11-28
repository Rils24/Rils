import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { toProjectCard } from "@/components/project-card";
import { Magnetic } from "@/components/motion/magnetic";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { localized } from "@/lib/content";
import type { Category, Project } from "@/lib/data";
import { HomeProjectsShowcase } from "./home-projects-showcase";

export async function FeaturedProjects({
  projects,
  categories = [],
}: {
  projects: Project[];
  categories?: Category[];
}) {
  if (!projects.length) return null;
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Projects"),
  ]);

  const usedCategories = categories
    .filter((c) => projects.some((p) => p.category_id === c.id))
    .map((c) => ({
      slug: c.slug,
      name: localized(locale, c.name_id, c.name_en),
    }));

  return (
    <section
      id="projects"
      aria-labelledby="featured"
      className="py-20 md:py-28"
    >
      <Container>
        <SectionHeader
          id="featured"
          eyebrow={t("eyebrow")}
          title={t("featured")}
          intro={t("intro")}
          align="center"
        />

        <HomeProjectsShowcase
          projects={projects.map((p) => toProjectCard(p, locale))}
          categories={usedCategories}
        />

        <div className="mt-12 flex justify-center">
          <Magnetic strength={0.2}>
            <Link
              href="/projects"
              className={buttonClass("secondary", "lg", "group")}
            >
              {t("viewAll")}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </Magnetic>
        </div>
      </Container>
    </section>
  );
}

export function SeeAll({
  href,
  label,
}: {
  href: "/projects" | "/blog";
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent-text"
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
