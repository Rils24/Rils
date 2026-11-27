import {
  ClipboardList,
  CodeXml,
  Database,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { localized } from "@/lib/content";
import type { Service } from "@/lib/data";

/** Nilai kolom `services.icon` → ikon. Nilai lain memakai ikon default. */
const ICONS: Record<string, LucideIcon> = {
  code: CodeXml,
  database: Database,
  clipboard: ClipboardList,
};

export async function Services({ services }: { services: Service[] }) {
  if (!services.length) return null;
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Services"),
  ]);

  return (
    <section
      aria-labelledby="services"
      className="border-t border-border py-20 md:py-28"
    >
      <Container>
        <SectionHeader id="services" title={t("title")} intro={t("intro")} />
        <Stagger className="grid gap-4 md:grid-cols-3">
          {services.map((service) => {
            const Icon = (service.icon && ICONS[service.icon]) || Layers;
            return (
              <StaggerItem
                key={service.id}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30 sm:p-8"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-accent transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:-rotate-6">
                  <Icon
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.75}
                  />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight">
                  {localized(locale, service.title_id, service.title_en)}
                </h3>
                <p className="mt-3 text-muted">
                  {localized(
                    locale,
                    service.description_id,
                    service.description_en,
                  )}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
