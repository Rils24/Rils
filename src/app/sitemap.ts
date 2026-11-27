import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPosts, getProjects } from "@/lib/data";
import { siteUrl } from "@/lib/seo";

/** Semua halaman publik dalam dua bahasa, lengkap dengan pasangan hreflang. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  const entry = (
    path: string,
    options: { lastModified?: string; priority: number },
  ): MetadataRoute.Sitemap =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: options.lastModified,
      priority: options.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${base}/${l}${path}`]),
        ),
      },
    }));

  return [
    ...entry("", { priority: 1 }),
    ...entry("/projects", { priority: 0.9 }),
    ...entry("/blog", { priority: 0.7 }),
    ...entry("/contact", { priority: 0.6 }),
    ...projects.flatMap((p) =>
      entry(`/projects/${p.slug}`, {
        lastModified: p.updated_at,
        priority: 0.8,
      }),
    ),
    ...posts.flatMap((p) =>
      entry(`/blog/${p.slug}`, { lastModified: p.updated_at, priority: 0.6 }),
    ),
  ];
}
