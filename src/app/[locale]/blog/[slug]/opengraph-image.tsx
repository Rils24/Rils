import { localized } from "@/lib/content";
import { getPost, getPosts } from "@/lib/data";
import { OG_SIZE, ogCard } from "@/lib/og";
import { siteUrl } from "@/lib/seo";

export const alt = "Artikel blog — Syahril Aprialsyah";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

/** Gambar Open Graph per artikel, dari judul dan kutipan. */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(slug);

  return ogCard({
    eyebrow: "Blog",
    title: post ? localized(locale, post.title_id, post.title_en) : "Blog",
    subtitle: post ? localized(locale, post.excerpt_id, post.excerpt_en) : null,
    footer: new URL(siteUrl()).host,
  });
}
