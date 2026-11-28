"use client";

import { m } from "motion/react";
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
          ? "flex items-center gap-2"
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
                  ? "relative inline-flex items-center rounded-full px-3.5 py-2 text-xs font-semibold tracking-[0.14em] text-muted uppercase transition-colors hover:text-foreground aria-[current=page]:text-foreground"
                  : "block rounded-xl px-3 py-3 text-base font-semibold tracking-[0.08em] text-muted uppercase transition-colors hover:text-foreground aria-[current=page]:text-foreground"
              }
            >
              <span className="relative">
                {item.label}
                {active && orientation === "horizontal" && (
                  <m.span
                    layoutId="nav-active-underline"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-x-0 -bottom-2 h-[2px] rounded-full bg-accent"
                  />
                )}
                {active && orientation === "vertical" && (
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
