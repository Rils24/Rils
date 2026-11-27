import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/ui/cover-image";
import { localized, readingMinutes } from "@/lib/content";
import type { Post } from "@/lib/data";

export async function PostCard({
  post,
  headingLevel: Heading = "h3",
}: {
  post: Post;
  headingLevel?: "h2" | "h3";
}) {
  const [locale, format, t, common] = await Promise.all([
    getLocale(),
    getFormatter(),
    getTranslations("Blog"),
    getTranslations("Common"),
  ]);
  const title = localized(locale, post.title_id, post.title_en);
  const excerpt = localized(locale, post.excerpt_id, post.excerpt_en);
  const content = localized(locale, post.content_id, post.content_en);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-foreground/30">
      <div className="relative aspect-[16/9] border-b border-border">
        <CoverImage
          src={post.cover_url}
          alt=""
          placeholder={common("imageComingSoon")}
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
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
        <Heading className="mt-2 font-display text-xl leading-snug font-bold tracking-tight">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </Heading>
        {excerpt && <p className="mt-3 line-clamp-3 text-muted">{excerpt}</p>}
      </div>
    </article>
  );
}
