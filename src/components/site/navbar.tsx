import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Magnetic } from "@/components/motion/magnetic";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getProfile } from "@/lib/data";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, type NavItem } from "./nav-links";

export async function Navbar() {
  const [t, profile] = await Promise.all([
    getTranslations("Nav"),
    getProfile(),
  ]);

  const name = profile?.name ?? "Syahril Aprialsyah";
  const shortName = name.split(" ")[0] ?? name;

  const items: NavItem[] = [
    { href: "/", label: t("home") },
    { href: "/projects", label: t("projects") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <Container className="relative flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-display text-base font-extrabold tracking-[0.12em] uppercase"
        >
          <span
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center rounded-full bg-accent-solid/15 text-accent transition-transform duration-300 group-hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current">
              <path d="M12.7 2.3a1 1 0 0 0-1.5.5C9.7 6.4 6.5 8.8 6.5 13.4a5.5 5.5 0 0 0 11 0c0-3.1-1.6-6.2-4.8-11.1Zm-.7 14.2a2.4 2.4 0 0 1-2.4-2.4c0-1.5.9-2.8 2.4-4.5 1.5 1.7 2.4 3 2.4 4.5a2.4 2.4 0 0 1-2.4 2.4Z" />
            </svg>
          </span>
          <span className="hidden sm:inline">{shortName}</span>
          <span className="sm:hidden">{shortName}</span>
        </Link>

        <nav aria-label={t("label")} className="hidden md:block">
          <NavLinks items={items} />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <ThemeToggle />
          <Magnetic strength={0.2}>
            <Link
              href="/contact"
              className={buttonClass(
                "primary",
                "md",
                "max-[359px]:px-3.5 text-xs tracking-[0.04em]",
              )}
            >
              {t("hireMe")}
            </Link>
          </Magnetic>
          <MobileMenu items={items} />
        </div>
      </Container>
    </header>
  );
}
