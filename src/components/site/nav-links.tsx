"use client";

import { Link, usePathname } from "@/i18n/navigation";

export type NavItem = {
  href: "/" | "/projects" | "/blog" | "/contact";
  label: string;
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavLinks({
  items,
  onNavigate,
  orientation = "horizontal",
}: {
  items: NavItem[];
  onNavigate?: () => void;
  orientation?: "horizontal" | "vertical";
}) {
  const pathname = usePathname();

  return (
    <ul
      className={
        orientation === "horizontal"
          ? "flex items-center gap-1"
          : "flex flex-col gap-1"
      }
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={
                orientation === "horizontal"
                  ? "rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground"
                  : "block rounded-lg px-3 py-3 text-lg font-medium text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground"
              }
            >
              <span className="relative">
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1.5 h-0.5 rounded-full bg-accent"
                  />
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
