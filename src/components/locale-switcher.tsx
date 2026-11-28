"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // next-intl menyimpan pilihan ini di cookie NEXT_LOCALE.
    startTransition(() => router.replace(pathname, { locale: next }));
  }

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
      className="inline-flex h-10 items-center rounded-full border border-border bg-surface/90 p-1 text-xs font-semibold tracking-wider"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          disabled={isPending}
          onClick={() => switchTo(l)}
          className="h-full rounded-full px-3 text-muted uppercase transition-colors hover:text-foreground aria-pressed:bg-accent-solid aria-pressed:text-accent-foreground"
        >
          {l}
        </button>
      ))}
    </div>
  );
}
