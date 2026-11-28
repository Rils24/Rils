import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export async function Cta({ email }: { email: string | null }) {
  const t = await getTranslations("Cta");

  return (
    <section aria-labelledby="cta" className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/90 bg-surface/95 px-6 py-16 text-center shadow-[0_32px_90px_-34px_rgba(0,0,0,0.8)] sm:px-14 sm:py-20">
            {/* Aksen geometris sudut khas referensi (cobalt kanan atas + dot-grid + glow) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 h-28 w-44 rounded-2xl bg-accent-secondary/25 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-8 h-3 w-24 rounded-b-xl bg-accent-secondary"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-8 h-3 w-20 rounded-t-xl bg-accent/80"
            />
            <div
              aria-hidden="true"
              className="bg-dot-grid pointer-events-none absolute top-6 left-6 h-24 w-24 opacity-45"
            />
            <div
              aria-hidden="true"
              className="bg-dot-grid pointer-events-none absolute right-6 bottom-6 h-24 w-24 opacity-45"
            />

            <div className="relative mx-auto max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/80 px-3.5 py-1 text-xs font-semibold tracking-[0.16em] text-accent-secondary-text uppercase">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-accent"
                />
                {t("eyebrow")}
              </p>

              <h2
                id="cta"
                className="font-display text-3xl leading-[1.12] font-bold tracking-tight sm:text-5xl"
              >
                {t("title")}
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {t("body")}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4">
                <Magnetic>
                  <Link
                    href="/contact"
                    className={buttonClass("primary", "lg")}
                  >
                    {t("button")}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </Magnetic>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
