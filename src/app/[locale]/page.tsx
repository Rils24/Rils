import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/env";

// Halaman sementara Fase 1 untuk mengecek setup. Diganti Home di Fase 3.
export default function SetupPage() {
  const t = useTranslations("Setup");
  const locale = useLocale();

  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center gap-10 px-4 py-24 sm:px-6"
    >
      <header className="flex flex-col gap-4">
        <p className="font-display text-sm font-semibold tracking-wide text-accent-strong uppercase">
          Syahril Aprialsyah
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          {t("heading")}
        </h1>
        <p className="max-w-xl text-lg text-muted">{t("intro")}</p>
      </header>

      <section aria-labelledby="checks" className="max-w-xl">
        <h2 id="checks" className="mb-3 font-display text-lg font-semibold">
          {t("checks")}
        </h2>
        <dl className="divide-y divide-border rounded-2xl border border-border bg-surface">
          <Row label={t("locale")}>
            <LocaleSwitcher />
            <span className="sr-only">{locale}</span>
          </Row>
          <Row label={t("theme")}>
            <ThemeToggle />
          </Row>
          <Row label={t("supabase")}>
            <Suspense
              fallback={<span className="text-muted">{t("checking")}</span>}
            >
              <SupabaseStatus />
            </Suspense>
          </Row>
        </dl>
      </section>
    </main>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <dt className="font-medium">{label}</dt>
      <dd className="flex items-center gap-2">{children}</dd>
    </div>
  );
}

async function SupabaseStatus() {
  const t = await getTranslations("Setup");

  if (!isSupabaseConfigured) {
    return <Status tone="muted">{t("supabaseMissing")}</Status>;
  }

  // Endpoint health Supabase Auth: tidak butuh tabel, cukup URL + key yang valid.
  let ok = false;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabasePublishableKey },
      cache: "no-store",
    });
    ok = res.ok;
  } catch {
    ok = false;
  }

  return ok ? (
    <Status tone="ok">{t("supabaseOk")}</Status>
  ) : (
    <Status tone="error">{t("supabaseError")}</Status>
  );
}

function Status({
  tone,
  children,
}: {
  tone: "ok" | "error" | "muted";
  children: React.ReactNode;
}) {
  const dot = {
    ok: "bg-emerald-500",
    error: "bg-accent",
    muted: "bg-muted",
  }[tone];
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
      {children}
    </span>
  );
}
