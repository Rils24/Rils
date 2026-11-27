import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { About } from "@/components/home/about";
import { Cta } from "@/components/home/cta";
import { Experience } from "@/components/home/experience";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { LatestPosts } from "@/components/home/latest-posts";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { JsonLd } from "@/components/json-ld";
import { localized } from "@/lib/content";
import {
  getFeaturedProjects,
  getPosts,
  getProfile,
  getResume,
  getServices,
  getSkills,
  getTestimonials,
  type Profile,
  type Skill,
  type Education,
} from "@/lib/data";
import { pageMetadata, siteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale, profile] = await Promise.all([
    getTranslations("Metadata"),
    getLocale(),
    getProfile(),
  ]);
  return pageMetadata({
    locale,
    path: "",
    ogTitle: t("title"),
    description: profile
      ? localized(locale, profile.bio_id, profile.bio_en)
      : t("description"),
  });
}

/** Data terstruktur: profil (Person) dan situs (WebSite). */
function personSchema(
  profile: Profile,
  locale: string,
  skills: Skill[],
  educations: Education[],
) {
  const base = siteUrl();
  const roles = localized(
    locale,
    profile.role_titles_id,
    profile.role_titles_en,
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${base}/#person`,
        name: profile.name,
        jobTitle: roles[0],
        description: localized(locale, profile.bio_id, profile.bio_en),
        url: `${base}/${locale}`,
        ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
        ...(profile.hero_photo_url ? { image: profile.hero_photo_url } : {}),
        ...(profile.location_id
          ? {
              homeLocation: {
                "@type": "Place",
                name: localized(
                  locale,
                  profile.location_id,
                  profile.location_en,
                ),
              },
            }
          : {}),
        sameAs: [
          profile.linkedin_url,
          profile.github_url,
          profile.instagram_url,
        ].filter(Boolean),
        knowsAbout: skills.map((s) => localized(locale, s.name_id, s.name_en)),
        alumniOf: educations.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.institution,
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: profile.name,
        url: base,
        inLanguage: ["id", "en"],
        publisher: { "@id": `${base}/#person` },
      },
    ],
  };
}

export default async function HomePage() {
  const [
    locale,
    profile,
    services,
    featured,
    skills,
    resume,
    testimonials,
    posts,
  ] = await Promise.all([
    getLocale(),
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
      {profile && (
        <JsonLd
          data={personSchema(profile, locale, skills, resume.educations)}
        />
      )}
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
