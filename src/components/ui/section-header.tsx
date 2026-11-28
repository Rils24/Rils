import { Reveal } from "@/components/motion/reveal";
import type { ReactNode } from "react";

export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  action,
  align = "left",
  as: Heading = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const isCentered = align === "center";
  const layout = isCentered
    ? "mb-12 flex flex-col items-center text-center md:mb-14"
    : "mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between";

  const eyebrowNode = eyebrow ? (
    <p
      className={`mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1 text-xs font-semibold tracking-[0.16em] text-accent-secondary-text uppercase ${isCentered ? "mx-auto" : ""}`}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-accent-secondary"
      />
      {eyebrow}
    </p>
  ) : null;

  // Judul halaman (h1) ada di atas lipatan dan sering jadi elemen LCP: fade
  // lewat CSS agar tidak menunggu JS. Judul section (h2) muncul saat di-scroll.
  if (Heading === "h1") {
    return (
      <div className={`${layout} motion-safe:animate-fade-up`}>
        <div className={isCentered ? "max-w-2xl" : "max-w-2xl"}>
          {eyebrowNode}
          <h1
            id={id}
            className="font-display text-4xl font-bold tracking-tight sm:text-6xl"
          >
            {title}
          </h1>
          {intro && (
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {intro}
            </p>
          )}
        </div>
        {action}
      </div>
    );
  }

  return (
    <Reveal className={layout}>
      <div className={isCentered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrowNode}
        <Heading
          id={id}
          className="font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-5xl"
        >
          {title}
        </Heading>
        {intro && (
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {intro}
          </p>
        )}
      </div>
      {action}
    </Reveal>
  );
}
