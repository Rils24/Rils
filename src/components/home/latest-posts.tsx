import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/post-card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import type { Post } from "@/lib/data";
import { SeeAll } from "./featured-projects";

export async function LatestPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  const t = await getTranslations("Blog");

  return (
    <section
      aria-labelledby="latest-posts"
      className="border-t border-border py-20 md:py-28"
    >
      <Container>
        <SectionHeader
          id="latest-posts"
          title={t("latest")}
          action={<SeeAll href="/blog" label={t("viewAll")} />}
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
