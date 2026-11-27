import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
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

  const items: NavItem[] = [
    { href: "/", label: t("home") },
    { href: "/projects", label: t("projects") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight"
        >
          <span className="hidden sm:inline">{name}</span>
          <span className="sm:hidden">{name.split(" ")[0]}</span>
        </Link>

        <nav aria-label={t("label")} className="hidden md:block">
          <NavLinks items={items} />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <ThemeToggle />
          <Link
            href="/contact"
            className={buttonClass("primary", "md", "max-[359px]:px-3")}
          >
            {t("hireMe")}
          </Link>
          <MobileMenu items={items} />
        </div>
      </Container>
    </header>
  );
}
