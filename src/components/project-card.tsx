import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/ui/cover-image";
import { localized } from "@/lib/content";
import type { Project } from "@/lib/data";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  categorySlug: string | null;
  categoryName: string | null;
  techStack: string[];
  thumbnailUrl: string | null;
};

export function toProjectCard(
  project: Project,
  locale: string,
): ProjectCardData {
  return {
    slug: project.slug,
    title: localized(locale, project.title_id, project.title_en),
    summary: localized(locale, project.summary_id, project.summary_en),
    categorySlug: project.category?.slug ?? null,
    categoryName: project.category
      ? localized(locale, project.category.name_id, project.category.name_en)
      : null,
    techStack: project.tech_stack,
    thumbnailUrl: project.thumbnail_url,
  };
}

export function ProjectCard({
  project,
  placeholder,
  headingLevel: Heading = "h3",
  variant = "default",
}: {
  project: ProjectCardData;
  placeholder: string;
  headingLevel?: "h2" | "h3";
  variant?: "default" | "gallery";
}) {
  if (variant === "gallery") {
    return (
      <article className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/90 bg-surface shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent-secondary/60 hover:shadow-[0_24px_54px_-22px_rgba(59,91,255,0.35)]">
        <div className="absolute inset-0 transition-transform duration-500 ease-out motion-safe:group-hover:scale-105">
          <CoverImage
            src={project.thumbnailUrl}
            alt=""
            placeholder={placeholder}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          />
        </div>

        {/* Scrim gelap permanen di bagian bawah agar judul selalu terbaca jelas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0d0e13]/95 via-[#0d0e13]/45 to-transparent transition-opacity duration-300 group-hover:from-[#0d0e13]/98"
        />

        {/* Lencana panah pojok kanan atas */}
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition-all duration-300 group-hover:border-accent group-hover:bg-accent-solid"
        >
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        {/* Konten bawah kartu */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 sm:p-6">
          {project.categoryName && (
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#8fa8ff] uppercase">
              {project.categoryName}
            </p>
          )}
          <Heading className="mt-1.5 font-display text-lg leading-snug font-bold tracking-tight text-white sm:text-xl">
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </Link>
          </Heading>
          {project.techStack.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 3).map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/85 backdrop-blur-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/90 bg-surface transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent-secondary/50 hover:shadow-[0_20px_44px_-22px_rgba(59,91,255,0.28)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border/80">
        {/* Zoom gambar saat hover (hanya transform). */}
        <div className="absolute inset-0 transition-transform duration-500 ease-out motion-safe:group-hover:scale-105">
          <CoverImage
            src={project.thumbnailUrl}
            alt=""
            placeholder={placeholder}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        {/* Overlay judul + tech stack saat hover. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 text-white opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        >
          <p className="font-display text-lg leading-snug font-bold tracking-tight">
            {project.title}
          </p>
          {project.techStack.length > 0 && (
            <p className="mt-1.5 text-xs text-white/80">
              {project.techStack.join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.categoryName && (
          <p className="text-xs font-semibold tracking-[0.12em] text-accent-secondary-text uppercase">
            {project.categoryName}
          </p>
        )}
        <Heading className="mt-2 font-display text-xl leading-snug font-bold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          {project.techStack.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-surface-2/60 px-2.5 py-0.5 text-xs text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        </div>
      </div>
    </article>
  );
}
