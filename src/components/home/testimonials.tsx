import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { localized } from "@/lib/content";
import type { Testimonial } from "@/lib/data";

function initials(name: string) {
  return name
    .replace(/\[.*?\]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Testimonials"),
  ]);

  return (
    <section
      aria-labelledby="testimonials"
      className="border-t border-border py-20 md:py-28"
    >
      <Container>
        <SectionHeader id="testimonials" title={t("title")} />
        <ul className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.id}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <span
                  aria-hidden="true"
                  className="font-display text-5xl leading-none text-accent"
                >
                  “
                </span>
                <blockquote className="mt-2 flex-1 text-lg leading-relaxed">
                  {localized(locale, item.quote_id, item.quote_en)}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  {item.photo_url ? (
                    <Image
                      src={item.photo_url}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-flex size-11 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-muted"
                    >
                      {initials(item.name)}
                    </span>
                  )}
                  <span>
                    <span className="block font-semibold">{item.name}</span>
                    {item.role && (
                      <span className="block text-sm text-muted">
                        {item.role}
                      </span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
