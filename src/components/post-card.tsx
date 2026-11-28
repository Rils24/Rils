import { ArrowUpRight } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/ui/cover-image";
import { localized, readingMinutes } from "@/lib/content";
import type { Post } from "@/lib/data";

export async function PostCard({
  post,
  headingLevel: Heading = "h3",
  featured = false,
}: {
  post: Post;
  headingLevel?: "h2" | "h3";
  featured?: boolean;
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
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 ${
        featured
          ? "border-accent-secondary/60 bg-accent-secondary text-white shadow-[0_22px_50px_-20px_rgba(59,91,255,0.65)]"
          : "border-border/90 bg-surface hover:border-accent-secondary/50 hover:shadow-[0_20px_44px_-22px_rgba(59,91,255,0.28)]"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-0 transition-transform duration-500 ease-out motion-safe:group-hover:scale-105">
          <CoverImage
            src={post.cover_url}
            alt=""
            placeholder={common("imageComingSoon")}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p
          className={`text-xs font-medium tracking-wide ${
            featured ? "text-white/80" : "text-muted"
          }`}
        >
          {post.published_at && (
            <time dateTime={post.published_at}>
              {format.dateTime(new Date(post.published_at), {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          )}
          <span aria-hidden="true"> · </span>
          {t("readingTime", { minutes: readingMinutes(content) })}
        </p>

        <Heading
          className={`mt-2.5 font-display text-lg leading-snug font-bold tracking-tight sm:text-xl ${
            featured ? "text-white" : "text-foreground"
          }`}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </Heading>

        {excerpt && (
          <p
            className={`mt-2.5 line-clamp-3 text-sm leading-relaxed ${
              featured ? "text-white/85" : "text-muted"
            }`}
          >
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-end pt-5">
          <span
            aria-hidden="true"
            className={`inline-flex size-8 items-center justify-center rounded-full border transition-all duration-300 ${
              featured
                ? "border-white/25 bg-white/15 text-white group-hover:bg-white group-hover:text-accent-secondary"
                : "border-border text-muted group-hover:border-accent group-hover:bg-accent-solid group-hover:text-white"
            }`}
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
