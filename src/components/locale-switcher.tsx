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
      className="inline-flex h-10 items-center rounded-xl border border-border bg-surface p-1 text-sm font-medium"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          disabled={isPending}
          onClick={() => switchTo(l)}
          className="h-full rounded-lg px-3 text-muted uppercase transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:bg-accent-strong aria-pressed:text-accent-foreground"
        >
          {l}
        </button>
      ))}
    </div>
  );
}
