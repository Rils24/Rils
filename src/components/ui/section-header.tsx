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
  return (
    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <Heading
          id={id}
          className={
            Heading === "h1"
              ? "font-display text-4xl font-bold tracking-tight sm:text-6xl"
              : "font-display text-3xl font-bold tracking-tight sm:text-5xl"
          }
        >
          {title}
        </Heading>
        {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
