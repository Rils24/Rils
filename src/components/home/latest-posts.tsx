import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PostCard } from "@/components/post-card";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Post } from "@/lib/data";

export async function LatestPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  const t = await getTranslations("Blog");

  return (
    <section
      id="blog"
      aria-labelledby="latest-posts"
      className="border-t border-border/70 py-20 md:py-28"
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Kolom Kiri — Tajuk + Intro + Tombol Pill Coral */}
          <Reveal className="lg:sticky lg:top-28 lg:col-span-4">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1 text-xs font-semibold tracking-[0.16em] text-accent-secondary-text uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent-secondary"
              />
              {t("eyebrow")}
            </p>
            <h2
              id="latest-posts"
              className="font-display text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl"
            >
              {t("latest")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {t("intro")}
            </p>
            <div className="mt-8">
              <Magnetic>
                <Link
                  href="/blog"
                  className={buttonClass("primary", "lg", "group")}
                >
                  {t("viewAll")}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          {/* Kolom Kanan — Kartu Artikel (kartu pertama disorot cobalt ala referensi) */}
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {posts.slice(0, 2).map((post, index) => (
              <StaggerItem key={post.id}>
                <PostCard post={post} featured={index === 0} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
