import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { ShareButtons } from "@/components/share-buttons";
import { Container } from "@/components/ui/container";
import { CoverImage } from "@/components/ui/cover-image";
import { Link } from "@/i18n/navigation";
import { localized, readingMinutes } from "@/lib/content";
import { getPost, getPosts, getProfile } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getPosts();
  // Cache Components mewajibkan minimal satu param; "_" akan berujung 404.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const post = await getPost(slug);
  if (!post) return {};
  return pageMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: localized(locale, post.title_id, post.title_en),
    description: localized(locale, post.excerpt_id, post.excerpt_en),
    type: "article",
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
  });
}

export default async function PostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { slug } = await params;
  const [locale, format, t, common, post] = await Promise.all([
    getLocale(),
    getFormatter(),
    getTranslations("Blog"),
    getTranslations("Common"),
    getPost(slug),
  ]);
  if (!post) notFound();

  const title = localized(locale, post.title_id, post.title_en);
  const excerpt = localized(locale, post.excerpt_id, post.excerpt_en);
  const content = localized(locale, post.content_id, post.content_en);
  const url = `${siteUrl()}/${locale}/blog/${post.slug}`;
  const profile = await getProfile();
  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    ...(excerpt ? { description: excerpt } : {}),
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    dateModified: post.updated_at,
    image: post.cover_url ?? `${url}/opengraph-image`,
    author: {
      "@type": "Person",
      name: profile?.name ?? "Syahril Aprialsyah",
      url: siteUrl(),
    },
  };

  return (
    <article className="pt-28 pb-20 md:pt-36 md:pb-28">
      <JsonLd data={postSchema} />
      <Container size="narrow">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t("back")}
        </Link>

        <header className="mt-8">
          <p className="text-sm text-muted">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {format.dateTime(new Date(post.published_at), {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            <span aria-hidden="true"> · </span>
            {t("readingTime", { minutes: readingMinutes(content) })}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {excerpt && (
            <p className="mt-5 text-xl leading-relaxed text-muted">{excerpt}</p>
          )}
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <CoverImage
            src={post.cover_url}
            alt=""
            placeholder={common("imageComingSoon")}
            sizes="(min-width: 808px) 760px, 100vw"
            priority
          />
        </div>

        <div className="mt-12">
          <Markdown>{content}</Markdown>
        </div>

        <footer className="mt-14 border-t border-border pt-8">
          <ShareButtons url={url} title={title} />
        </footer>
      </Container>
    </article>
  );
}
