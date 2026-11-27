import { localized } from "@/lib/content";
import { getProject, getProjects } from "@/lib/data";
import { OG_SIZE, ogCard } from "@/lib/og";
import { siteUrl } from "@/lib/seo";

export const alt = "Studi kasus proyek — Syahril Aprialsyah";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.length
    ? projects.map((p) => ({ slug: p.slug }))
    : [{ slug: "_" }];
}

/** Gambar Open Graph per proyek, dari judul, kategori, dan ringkasan. */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  const label = locale === "en" ? "Project" : "Proyek";

  return ogCard({
    eyebrow: project?.category
      ? `${label} · ${localized(locale, project.category.name_id, project.category.name_en)}`
      : label,
    title: project
      ? localized(locale, project.title_id, project.title_en)
      : "Syahril Aprialsyah",
    subtitle: project
      ? localized(locale, project.summary_id, project.summary_en)
      : null,
    footer: new URL(siteUrl()).host,
  });
}
