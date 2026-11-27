import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/supabase/database.types";

/*
 * Semua bacaan konten publik ada di sini. Tiap fungsi di-cache dengan
 * "use cache" dan diberi tag nama tabel, sehingga panel admin (Fase 5) cukup
 * memanggil revalidateTag("<tabel>") setelah menyimpan.
 * Data dikembalikan apa adanya (kedua bahasa); pemilihan bahasa dilakukan di
 * komponen lewat localized().
 */

export type Profile = Tables<"profile">;
export type Category = Tables<"categories">;
export type Project = Tables<"projects"> & {
  category: Pick<Category, "id" | "slug" | "name_id" | "name_en"> | null;
};
export type Post = Tables<"posts">;
export type Service = Tables<"services">;
export type Testimonial = Tables<"testimonials">;
export type Skill = Tables<"skills">;
export type Experience = Tables<"experiences">;
export type Education = Tables<"educations">;
export type Certification = Tables<"certifications">;

const PROJECT_SELECT = "*, category:categories(id, slug, name_id, name_en)";

function fail(table: string, message: string): never {
  throw new Error(`Gagal memuat ${table} dari Supabase: ${message}`);
}

export async function getProfile(): Promise<Profile | null> {
  "use cache";
  cacheLife("days");
  cacheTag("profile");
  const { data, error } = await createPublicClient()
    .from("profile")
    .select("*")
    .maybeSingle();
  if (error) fail("profile", error.message);
  return data;
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");
  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) fail("categories", error.message);
  return data;
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("days");
  cacheTag("projects", "categories");
  const { data, error } = await createPublicClient()
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) fail("projects", error.message);
  return data;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("days");
  cacheTag("posts");
  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) fail("posts", error.message);
  return data;
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheLife("days");
  cacheTag("services");
  const { data, error } = await createPublicClient()
    .from("services")
    .select("*")
    .order("sort_order");
  if (error) fail("services", error.message);
  return data;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("days");
  cacheTag("testimonials");
  const { data, error } = await createPublicClient()
    .from("testimonials")
    .select("*")
    .order("sort_order");
  if (error) fail("testimonials", error.message);
  return data;
}

export async function getSkills(): Promise<Skill[]> {
  "use cache";
  cacheLife("days");
  cacheTag("skills");
  const { data, error } = await createPublicClient()
    .from("skills")
    .select("*")
    .order("sort_order");
  if (error) fail("skills", error.message);
  return data;
}

export async function getResume(): Promise<{
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
}> {
  "use cache";
  cacheLife("days");
  cacheTag("experiences", "educations", "certifications");
  const supabase = createPublicClient();
  const [experiences, educations, certifications] = await Promise.all([
    supabase
      .from("experiences")
      .select("*")
      .order("sort_order")
      .order("start_date", { ascending: false }),
    supabase
      .from("educations")
      .select("*")
      .order("sort_order")
      .order("start_date", { ascending: false }),
    supabase.from("certifications").select("*").order("sort_order"),
  ]);
  if (experiences.error) fail("experiences", experiences.error.message);
  if (educations.error) fail("educations", educations.error.message);
  if (certifications.error)
    fail("certifications", certifications.error.message);
  return {
    experiences: experiences.data,
    educations: educations.data,
    certifications: certifications.data,
  };
}

/** Tahun berjalan untuk footer (Date tidak boleh dibaca di luar cache saat prerender). */
export async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
