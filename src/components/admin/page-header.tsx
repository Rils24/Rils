import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  action?: ReactNode;
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-4 inline-block text-sm font-medium text-muted hover:text-foreground"
        >
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {description && <p className="mt-1.5 text-muted">{description}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
