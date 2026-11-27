import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { toProjectCard } from "@/components/project-card";
import { ProjectFilter } from "@/components/project-filter";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { localized } from "@/lib/content";
import { getCategories, getProjects } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([
    getTranslations("Metadata"),
    getLocale(),
  ]);
  return pageMetadata({
    locale,
    path: "/projects",
    title: t("projectsTitle"),
    description: t("projectsDescription"),
  });
}

export default async function ProjectsPage() {
  const [locale, t, projects, categories] = await Promise.all([
    getLocale(),
    getTranslations("Projects"),
    getProjects(),
    getCategories(),
  ]);

  // Hanya kategori yang punya proyek yang ditampilkan sebagai filter.
  const usedCategories = categories
    .filter((c) => projects.some((p) => p.category_id === c.id))
    .map((c) => ({
      slug: c.slug,
      name: localized(locale, c.name_id, c.name_en),
    }));

  return (
    <Container className="pt-32 pb-20 md:pt-40 md:pb-28">
      <SectionHeader as="h1" title={t("title")} intro={t("intro")} />
      <ProjectFilter
        projects={projects.map((p) => toProjectCard(p, locale))}
        categories={usedCategories}
      />
    </Container>
  );
}
