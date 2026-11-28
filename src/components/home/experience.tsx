import { ArrowUpRight } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { localized } from "@/lib/content";
import type { Certification, Education, Experience as Job } from "@/lib/data";

export async function Experience({
  experiences,
  educations,
  certifications,
}: {
  experiences: Job[];
  educations: Education[];
  certifications: Certification[];
}) {
  const [locale, format, t, common] = await Promise.all([
    getLocale(),
    getFormatter(),
    getTranslations("Experience"),
    getTranslations("Common"),
  ]);

  const month = (date: string) =>
    format.dateTime(new Date(date), { month: "short", year: "numeric" });
  const period = (start: string, end: string | null) =>
    `${month(start)} – ${end ? month(end) : common("present")}`;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-t border-border/70 py-20 md:py-28"
    >
      <Container>
        <SectionHeader
          id="experience-heading"
          eyebrow={t("eyebrow")}
          title={t("title")}
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h3 className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
              {t("work")}
            </h3>
            <ol className="mt-6 border-l border-border/90">
              {experiences.map((job) => {
                const location = localized(
                  locale,
                  job.location_id,
                  job.location_en,
                );
                const highlights = localized(
                  locale,
                  job.highlights_id,
                  job.highlights_en,
                );
                return (
                  <li key={job.id} className="relative pb-8 pl-7 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute top-6 -left-[5px] size-[9px] rounded-full bg-accent ring-4 ring-accent/20"
                    />
                    <div className="rounded-2xl border border-border/90 bg-surface/95 p-6 transition-colors hover:border-accent-secondary/45">
                      <p className="text-xs font-semibold tracking-wider text-accent-secondary-text uppercase tabular-nums">
                        {period(job.start_date, job.end_date)}
                      </p>
                      <h4 className="mt-1.5 font-display text-xl font-bold tracking-tight">
                        {localized(locale, job.position_id, job.position_en)}
                      </h4>
                      <p className="mt-1 text-sm text-muted">
                        {job.company}
                        {location && <span> · {location}</span>}
                      </p>
                      {highlights.length > 0 && (
                        <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-foreground/85 marker:text-accent">
                          {highlights.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal
            delay={0.12}
            className="flex flex-col gap-10 lg:col-span-5"
          >
            {educations.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                  {t("education")}
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {educations.map((edu) => (
                    <li
                      key={edu.id}
                      className="rounded-2xl border border-border/90 bg-surface/95 p-6 transition-colors hover:border-accent-secondary/45"
                    >
                      <p className="text-xs font-semibold tracking-wider text-accent-secondary-text uppercase tabular-nums">
                        {period(edu.start_date, edu.end_date)}
                      </p>
                      <h4 className="mt-1.5 font-display text-lg font-bold tracking-tight">
                        {edu.institution}
                      </h4>
                      <p className="mt-1 text-sm text-muted">
                        {localized(locale, edu.program_id, edu.program_en)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                  {t("certifications")}
                </h3>
                <ul className="mt-6 flex flex-col gap-3">
                  {certifications.map((cert) => (
                    <li
                      key={cert.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-border/90 bg-surface/95 p-5 transition-colors hover:border-accent-secondary/45"
                    >
                      <div>
                        <p className="text-sm font-semibold">{cert.name}</p>
                        {(cert.issuer || cert.issued_at) && (
                          <p className="mt-1 text-xs text-muted">
                            {[
                              cert.issuer,
                              cert.issued_at && month(cert.issued_at),
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t("credential")}: ${cert.name}`}
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                        >
                          <ArrowUpRight aria-hidden="true" className="size-4" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
