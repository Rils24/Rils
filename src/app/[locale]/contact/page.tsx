import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { LinkedinIcon } from "@/components/icons/brand";
import { Container } from "@/components/ui/container";
import { getProfile } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([
    getTranslations("Metadata"),
    getLocale(),
  ]);
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default async function ContactPage() {
  const [t, profile] = await Promise.all([
    getTranslations("Contact"),
    getProfile(),
  ]);

  return (
    <Container className="grid gap-12 pt-32 pb-20 md:pt-40 md:pb-28 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg text-muted">{t("intro")}</p>

        {(profile?.email || profile?.linkedin_url) && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-muted">{t("direct")}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {profile.email && (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-3 font-medium hover:text-accent-text"
                  >
                    <Mail aria-hidden="true" className="size-5 text-muted" />
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.linkedin_url && (
                <li>
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 font-medium hover:text-accent-text"
                  >
                    <LinkedinIcon className="size-5 text-muted" />
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:col-span-6 lg:col-start-7">
        <ContactForm />
      </div>
    </Container>
  );
}
