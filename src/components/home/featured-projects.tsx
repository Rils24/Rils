import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProjectCard, toProjectCard } from "@/components/project-card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import type { Project } from "@/lib/data";

export async function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  const [locale, t, common] = await Promise.all([
    getLocale(),
    getTranslations("Projects"),
    getTranslations("Common"),
  ]);

  return (
    <section
      aria-labelledby="featured"
      className="border-t border-border py-20 md:py-28"
    >
      <Container>
        <SectionHeader
          id="featured"
          title={t("featured")}
          intro={t("intro")}
          action={<SeeAll href="/projects" label={t("viewAll")} />}
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard
                project={toProjectCard(project, locale)}
                placeholder={common("imageComingSoon")}
              />
            </li>
          ))}
        </ul>
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
      className="group inline-flex shrink-0 items-center gap-2 font-medium text-foreground hover:text-accent-text"
    >
      {label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}
