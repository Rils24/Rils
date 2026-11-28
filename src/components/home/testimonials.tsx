import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { TestimonialSlider } from "@/components/testimonial-slider";
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
      id="testimonials-section"
      aria-labelledby="testimonials"
      className="border-t border-border/70 py-20 md:py-28"
    >
      <Container>
        <SectionHeader
          id="testimonials"
          eyebrow={t("eyebrow")}
          title={t("title")}
          align="center"
        />
        <Reveal>
          <TestimonialSlider
            titleId="testimonials"
            items={testimonials.map((item) => ({
              id: item.id,
              name: item.name,
              role: item.role,
              quote: localized(locale, item.quote_id, item.quote_en),
              photoUrl: item.photo_url,
              initials: initials(item.name),
            }))}
          />
        </Reveal>
      </Container>
    </section>
  );
}
