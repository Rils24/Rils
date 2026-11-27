import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { getCurrentYear, getProfile } from "@/lib/data";
import { SocialLinks } from "./social-links";

export async function Footer() {
  const [t, nav, profile, year] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Nav"),
    getProfile(),
    getCurrentYear(),
  ]);
  const name = profile?.name ?? "Syahril Aprialsyah";

  return (
    <footer className="border-t border-border">
      <Container className="grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-lg font-bold tracking-tight">
            {name}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">{t("tagline")}</p>
        </div>

        <nav aria-label={nav("label")} className="md:col-span-3">
          <ul className="flex flex-col gap-2 text-sm">
            {(
              [
                ["/", nav("home")],
                ["/projects", nav("projects")],
                ["/blog", nav("blog")],
                ["/contact", nav("contact")],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-muted hover:text-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4 md:justify-self-end">
          <SocialLinks profile={profile} label={t("social")} />
        </div>
      </Container>

      <Container className="border-t border-border py-6">
        <p className="text-sm text-muted">
          © {year} {name}. {t("rights")}
        </p>
      </Container>
    </footer>
  );
}
