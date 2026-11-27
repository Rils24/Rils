"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavLinks, type NavItem } from "./nav-links";

export function MobileMenu({ items }: { items: NavItem[] }) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface"
      >
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-background px-4 pt-2 pb-6"
      >
        <nav aria-label={t("label")}>
          <NavLinks items={items} orientation="vertical" onNavigate={close} />
        </nav>
        <div className="mt-4 border-t border-border pt-4">
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
