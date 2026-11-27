import { About } from "@/components/home/about";
import { Cta } from "@/components/home/cta";
import { Experience } from "@/components/home/experience";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { LatestPosts } from "@/components/home/latest-posts";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import {
  getFeaturedProjects,
  getPosts,
  getProfile,
  getResume,
  getServices,
  getSkills,
  getTestimonials,
} from "@/lib/data";

export default async function HomePage() {
  const [profile, services, featured, skills, resume, testimonials, posts] =
    await Promise.all([
      getProfile(),
      getServices(),
      getFeaturedProjects(),
      getSkills(),
      getResume(),
      getTestimonials(),
      getPosts(),
    ]);

  return (
    <>
      {profile && <Hero profile={profile} />}
      <Services services={services} />
      <FeaturedProjects projects={featured} />
      {profile && <About profile={profile} skills={skills} />}
      <Experience {...resume} />
      <Testimonials testimonials={testimonials} />
      <LatestPosts posts={posts.slice(0, 3)} />
      <Cta email={profile?.email ?? null} />
    </>
  );
}
