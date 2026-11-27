import { Reveal } from "@/components/motion/reveal";
import type { ReactNode } from "react";

export function SectionHeader({
  id,
  title,
  intro,
  action,
  as: Heading = "h2",
}: {
  id?: string;
  title: string;
  intro?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  const layout =
    "mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between";

  // Judul halaman (h1) ada di atas lipatan dan sering jadi elemen LCP: fade
  // lewat CSS agar tidak menunggu JS. Judul section (h2) muncul saat di-scroll.
  if (Heading === "h1") {
    return (
      <div className={`${layout} motion-safe:animate-fade-up`}>
        <div className="max-w-2xl">
          <h1
            id={id}
            className="font-display text-4xl font-bold tracking-tight sm:text-6xl"
          >
            {title}
          </h1>
          {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        </div>
        {action}
      </div>
    );
  }

  return (
    <Reveal className={layout}>
      <div className="max-w-2xl">
        <Heading
          id={id}
          className="font-display text-3xl font-bold tracking-tight sm:text-5xl"
        >
          {title}
        </Heading>
        {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
      </div>
      {action}
    </Reveal>
  );
}
