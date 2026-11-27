"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";

export function ProjectFilter({
  projects,
  categories,
}: {
  projects: ProjectCardData[];
  categories: { slug: string; name: string }[];
}) {
  const t = useTranslations("Projects");
  const common = useTranslations("Common");
  const [active, setActive] = useState<string | null>(null);

  const visible = active
    ? projects.filter((p) => p.categorySlug === active)
    : projects;
  const options = [{ slug: null, name: t("all") }, ...categories];

  return (
    <>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label={t("filterLabel")}
          className="mb-8 flex flex-wrap gap-2"
        >
          {options.map((option) => (
            <button
              key={option.slug ?? "all"}
              type="button"
              aria-pressed={active === option.slug}
              onClick={() => setActive(option.slug)}
              className="h-10 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-muted transition-colors hover:text-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
            >
              {option.name}
              <span aria-hidden="true" className="ml-2 tabular-nums opacity-60">
                {option.slug
                  ? projects.filter((p) => p.categorySlug === option.slug)
                      .length
                  : projects.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {visible.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.slug}>
              <ProjectCard
                project={project}
                placeholder={common("imageComingSoon")}
                headingLevel="h2"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">{t("empty")}</p>
      )}
    </>
  );
}
