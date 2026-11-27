"use client";

import { AnimatePresence, motion } from "motion/react";
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
        <motion.ul layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Animasi layout: kartu bergeser ke posisi baru saat filter diganti. */}
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard
                  project={project}
                  placeholder={common("imageComingSoon")}
                  headingLevel="h2"
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <p className="text-muted">{t("empty")}</p>
      )}
    </>
  );
}
