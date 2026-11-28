"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Tombol tema tanpa next-intl (dipakai juga di panel admin). */
export function ThemeToggleButton({
  label,
  lightLabel,
  darkLabel,
}: {
  label: string;
  lightLabel: string;
  darkLabel: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  // Tema baru diketahui setelah hydration; sebelum itu render ikon netral.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={mounted ? (isDark ? darkLabel : lightLabel) : undefined}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground transition-colors hover:border-foreground/35 hover:bg-surface-2"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isDark ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}

export function ThemeToggle() {
  const t = useTranslations("Common");
  return (
    <ThemeToggleButton
      label={t("toggleTheme")}
      lightLabel={t("themeLight")}
      darkLabel={t("themeDark")}
    />
  );
}
