import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export async function Cta({ email }: { email: string | null }) {
  const t = await getTranslations("Cta");

  return (
    <section
      aria-labelledby="cta"
      className="border-t border-border py-20 md:py-32"
    >
      <Container className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2
            id="cta"
            className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl"
          >
            {t("title")}
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted">{t("body")}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
          <Link href="/contact" className={buttonClass("primary", "lg")}>
            {t("button")}
          </Link>
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              {email}
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
