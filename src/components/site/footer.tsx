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
  const shortName = name.split(" ")[0] ?? name;

  return (
    <footer className="border-t border-border/80 bg-surface/40">
      <Container className="flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-display text-base font-extrabold tracking-[0.12em] uppercase"
          >
            <span
              aria-hidden="true"
              className="inline-flex size-7 items-center justify-center rounded-full bg-accent-solid/15 text-accent"
            >
              <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
                <path d="M12.7 2.3a1 1 0 0 0-1.5.5C9.7 6.4 6.5 8.8 6.5 13.4a5.5 5.5 0 0 0 11 0c0-3.1-1.6-6.2-4.8-11.1Zm-.7 14.2a2.4 2.4 0 0 1-2.4-2.4c0-1.5.9-2.8 2.4-4.5 1.5 1.7 2.4 3 2.4 4.5a2.4 2.4 0 0 1-2.4 2.4Z" />
              </svg>
            </span>
            {shortName}
          </Link>
          <p className="mt-2.5 max-w-sm text-sm text-muted">{t("tagline")}</p>
        </div>

        <nav aria-label={nav("label")}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold tracking-[0.14em] uppercase">
            {(
              [
                ["/", nav("home")],
                ["/projects", nav("projects")],
                ["/blog", nav("blog")],
                ["/contact", nav("contact")],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SocialLinks profile={profile} label={t("social")} />
      </Container>

      <Container className="border-t border-border/70 py-5">
        <p className="text-xs text-muted">
          © {year} {name}. {t("rights")}
        </p>
      </Container>
    </footer>
  );
}
