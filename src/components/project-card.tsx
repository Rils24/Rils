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
}: {
  project: ProjectCardData;
  placeholder: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-foreground/30">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        {/* Zoom gambar saat hover (hanya transform). */}
        <div className="absolute inset-0 transition-transform duration-500 ease-out motion-safe:group-hover:scale-105">
          <CoverImage
            src={project.thumbnailUrl}
            alt=""
            placeholder={placeholder}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        {/* Overlay judul + tech stack saat hover. Duplikat isi kartu, jadi
            disembunyikan dari pembaca layar. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-end bg-black/65 p-5 text-white opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        >
          <p className="font-display text-lg leading-snug font-bold tracking-tight">
            {project.title}
          </p>
          {project.techStack.length > 0 && (
            <p className="mt-2 text-sm text-white/80">
              {project.techStack.join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.categoryName && (
          <p className="text-sm font-medium text-accent-text">
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
        <p className="mt-3 line-clamp-3 text-muted">{project.summary}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          {project.techStack.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-border px-2 py-0.5 text-xs text-muted"
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
            className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent"
          />
        </div>
      </div>
    </article>
  );
}
