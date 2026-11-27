import { ArrowUpRight } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
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
      aria-labelledby="experience"
      className="border-t border-border py-20 md:py-28"
    >
      <Container>
        <h2
          id="experience"
          className="mb-10 font-display text-3xl font-bold tracking-tight sm:text-5xl md:mb-14"
        >
          {t("title")}
        </h2>

        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="text-sm font-semibold text-muted">{t("work")}</h3>
            <ol className="mt-6 border-l border-border">
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
                  <li key={job.id} className="relative pb-12 pl-8 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute top-2 -left-[5px] size-[9px] rounded-full bg-accent"
                    />
                    <p className="text-sm text-muted tabular-nums">
                      {period(job.start_date, job.end_date)}
                    </p>
                    <h4 className="mt-1 font-display text-xl font-bold tracking-tight">
                      {localized(locale, job.position_id, job.position_en)}
                    </h4>
                    <p className="mt-1 text-muted">
                      {job.company}
                      {location && <span> · {location}</span>}
                    </p>
                    {highlights.length > 0 && (
                      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-foreground/85 marker:text-muted">
                        {highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            {educations.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted">
                  {t("education")}
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {educations.map((edu) => (
                    <li
                      key={edu.id}
                      className="rounded-2xl border border-border bg-surface p-6"
                    >
                      <p className="text-sm text-muted tabular-nums">
                        {period(edu.start_date, edu.end_date)}
                      </p>
                      <h4 className="mt-1 font-display text-lg font-bold tracking-tight">
                        {edu.institution}
                      </h4>
                      <p className="mt-1 text-muted">
                        {localized(locale, edu.program_id, edu.program_en)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted">
                  {t("certifications")}
                </h3>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {certifications.map((cert) => (
                    <li
                      key={cert.id}
                      className="flex items-start justify-between gap-4 py-4"
                    >
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        {(cert.issuer || cert.issued_at) && (
                          <p className="mt-0.5 text-sm text-muted">
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
                          className="shrink-0 text-muted hover:text-foreground"
                        >
                          <ArrowUpRight aria-hidden="true" className="size-5" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
