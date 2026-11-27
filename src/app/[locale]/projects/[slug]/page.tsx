import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { GithubIcon } from "@/components/icons/brand";
import { ProjectCard, toProjectCard } from "@/components/project-card";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CoverImage } from "@/components/ui/cover-image";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/content";
import { getProfile, getProject, getProjects } from "@/lib/data";

export async function generateStaticParams() {
  const projects = await getProjects();
  // Cache Components mewajibkan minimal satu param; "_" akan berujung 404.
  return projects.length
    ? projects.map((p) => ({ slug: p.slug }))
    : [{ slug: "_" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const project = await getProject(slug);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: localized(locale, project.title_id, project.title_en),
    description: localized(locale, project.summary_id, project.summary_en),
  });
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const [locale, t, common, project, all] = await Promise.all([
    getLocale(),
    getTranslations("Project"),
    getTranslations("Common"),
    getProject(slug),
    getProjects(),
  ]);
  if (!project) notFound();

  const title = localized(locale, project.title_id, project.title_en);
  const summary = localized(locale, project.summary_id, project.summary_en);
  const problem = localized(locale, project.problem_id, project.problem_en);
  const solution = localized(locale, project.solution_id, project.solution_en);
  const role = localized(locale, project.role_id, project.role_en);
  const category = project.category
    ? localized(locale, project.category.name_id, project.category.name_en)
    : null;
  const others = all.filter((p) => p.slug !== project.slug).slice(0, 3);
  const profile = await getProfile();
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: summary,
    url: `${siteUrl()}/${locale}/projects/${project.slug}`,
    inLanguage: locale,
    ...(project.thumbnail_url ? { image: project.thumbnail_url } : {}),
    ...(project.tech_stack.length
      ? { keywords: project.tech_stack.join(", ") }
      : {}),
    ...(category ? { genre: category } : {}),
    author: {
      "@type": "Person",
      name: profile?.name ?? "Syahril Aprialsyah",
      url: siteUrl(),
    },
  };

  const caseStudy = [
    { label: t("problem"), body: problem },
    { label: t("solution"), body: solution },
  ].filter((s): s is { label: string; body: string } => Boolean(s.body));

  return (
    <article className="pt-28 pb-20 md:pt-36 md:pb-28">
      <JsonLd data={projectSchema} />
      <Container>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t("back")}
        </Link>

        <header className="mt-8 max-w-4xl">
          {category && (
            <p className="font-medium text-accent-text">{category}</p>
          )}
          <h1 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted">{summary}</p>
        </header>

        <dl className="mt-12 grid gap-x-8 gap-y-6 border-y border-border py-8 sm:grid-cols-2 lg:grid-cols-4">
          {role && <Meta label={t("role")}>{role}</Meta>}
          {category && <Meta label={t("category")}>{category}</Meta>}
          {project.tech_stack.length > 0 && (
            <Meta label={t("stack")}>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-border px-2 py-0.5 text-sm"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Meta>
          )}
          {(project.demo_url || project.github_url) && (
            <Meta label={t("links")}>
              <div className="flex flex-wrap gap-2">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("primary")}
                  >
                    {t("demo")}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("secondary")}
                  >
                    <GithubIcon className="size-4" />
                    {t("source")}
                  </a>
                )}
              </div>
            </Meta>
          )}
        </dl>

        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <CoverImage
            src={project.thumbnail_url}
            alt={title}
            placeholder={common("imageComingSoon")}
            sizes="(min-width: 1248px) 1200px, 100vw"
            priority
          />
        </div>

        <div className="mt-16 flex flex-col gap-12 md:mt-20">
          {caseStudy.length > 0 ? (
            caseStudy.map((section) => (
              <section
                key={section.label}
                className="grid gap-4 lg:grid-cols-12"
              >
                <h2 className="font-display text-2xl font-bold tracking-tight lg:col-span-3">
                  {section.label}
                </h2>
                <p className="text-lg leading-relaxed whitespace-pre-line text-foreground/85 lg:col-span-8 lg:col-start-5">
                  {section.body}
                </p>
              </section>
            ))
          ) : (
            <p className="text-muted">{t("pending")}</p>
          )}
        </div>

        {project.gallery.length > 0 && (
          <section aria-labelledby="gallery" className="mt-20">
            <h2
              id="gallery"
              className="font-display text-2xl font-bold tracking-tight"
            >
              {t("gallery")}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.gallery.map((src, i) => (
                <li
                  key={src}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border"
                >
                  <CoverImage
                    src={src}
                    alt={t("galleryImage", { number: i + 1, title })}
                    placeholder={common("imageComingSoon")}
                    sizes="(min-width: 640px) 600px, 100vw"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>

      {others.length > 0 && (
        <section
          aria-labelledby="others"
          className="mt-24 border-t border-border pt-20"
        >
          <Container>
            <h2
              id="others"
              className="mb-10 font-display text-3xl font-bold tracking-tight"
            >
              {t("others")}
            </h2>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.id}>
                  <ProjectCard
                    project={toProjectCard(p, locale)}
                    placeholder={common("imageComingSoon")}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </article>
  );
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-2 font-medium">{children}</dd>
    </div>
  );
}
