import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Container className="flex min-h-[70vh] flex-col justify-center pt-32 pb-20">
      <p className="font-display text-[clamp(5rem,20vw,12rem)] leading-none font-bold tracking-tighter text-accent">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonClass("primary", "lg")}>
          {t("home")}
        </Link>
        <Link href="/projects" className={buttonClass("secondary", "lg")}>
          {t("projects")}
        </Link>
      </div>
    </Container>
  );
}
