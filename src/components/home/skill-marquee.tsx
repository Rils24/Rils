import { getLocale, getTranslations } from "next-intl/server";
import { localized } from "@/lib/content";
import type { Skill } from "@/lib/data";

/*
 * Pita teknologi yang berjalan halus di antara section (murni CSS `.marquee`
 * di globals.css). Isi diulang dua kali agar putarannya mulus; berhenti saat
 * di-hover dan diam pada prefers-reduced-motion.
 */
export async function SkillMarquee({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Skills"),
  ]);
  const names = skills.map((s) => localized(locale, s.name_id, s.name_en));
  const track = names.length < 8 ? [...names, ...names] : names;

  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {track.map((name, i) => (
        <li key={`${name}-${i}`} className="flex items-center">
          <span
            className={`px-5 font-display text-xl font-bold tracking-[0.06em] whitespace-nowrap uppercase sm:px-8 sm:text-2xl ${
              i % 2 === 0 ? "text-foreground/85" : "text-muted/75"
            }`}
          >
            {name}
          </span>
          <span
            aria-hidden="true"
            className={`size-1.5 shrink-0 rounded-full ${
              i % 2 === 0 ? "bg-accent" : "bg-accent-secondary"
            }`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label={t("label")}
      className="group overflow-hidden border-y border-border/70 bg-surface/40 py-5"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
