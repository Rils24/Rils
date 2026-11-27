import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/post-card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getPosts } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t("blogTitle"), description: t("blogDescription") };
}

export default async function BlogPage() {
  const [t, posts] = await Promise.all([getTranslations("Blog"), getPosts()]);

  return (
    <Container className="pt-32 pb-20 md:pt-40 md:pb-28">
      <SectionHeader as="h1" title={t("title")} intro={t("intro")} />
      {posts.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">{t("empty")}</p>
      )}
    </Container>
  );
}
