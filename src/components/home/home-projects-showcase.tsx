"use client";

import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ProjectCard, type ProjectCardData } from "@/components/project-card";

export function HomeProjectsShowcase({
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
    <div>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label={t("filterLabel")}
          className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-b border-border/70 pb-3"
        >
          {options.map((option) => {
            const isSelected = active === option.slug;
            return (
              <button
                key={option.slug ?? "all"}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActive(option.slug)}
                className="relative px-2 py-2 text-xs font-semibold tracking-[0.14em] text-muted uppercase transition-colors hover:text-foreground aria-pressed:text-foreground"
              >
                {option.name}
                {isSelected && (
                  <m.span
                    layoutId="home-project-filter-bar"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-x-0 -bottom-[13px] h-[2px] rounded-full bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {visible.length > 0 ? (
        <m.ul
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.slice(0, 6).map((project) => (
              <m.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard
                  project={project}
                  placeholder={common("imageComingSoon")}
                  variant="gallery"
                />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      ) : (
        <p className="text-center text-muted">{t("empty")}</p>
      )}
    </div>
  );
}

