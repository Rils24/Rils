import { ExternalLink, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AdminNav } from "@/components/admin/sidebar";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { logout } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { getUnreadCount } from "@/lib/admin/data";

async function UnreadBadge() {
  const count = await getUnreadCount();
  if (!count) return null;
  return (
    <span className="rounded-full bg-accent-solid px-2 py-0.5 text-xs font-semibold text-accent-foreground tabular-nums">
      <span className="sr-only">belum dibaca: </span>
      {count}
    </span>
  );
}

async function Account() {
  const { email } = await requireAdmin();
  return (
    <div className="flex flex-col gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted">Masuk sebagai</p>
        <p className="truncate text-sm font-medium">{email}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent-text"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Keluar
        </button>
      </form>
    </div>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  const nav = (
    <AdminNav
      unreadBadge={
        <Suspense fallback={null}>
          <UnreadBadge />
        </Suspense>
      }
    />
  );

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-border bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5">
          <Link
            href="/admin"
            className="font-display text-lg font-bold tracking-tight"
          >
            Panel admin
          </Link>
          <ThemeToggleButton
            label="Ganti tema"
            lightLabel="Terang"
            darkLabel="Gelap"
          />
        </div>

        {/* HP/tablet: menu bisa dibuka-tutup */}
        <details className="group border-t border-border lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium">
            <Menu aria-hidden="true" className="size-4" />
            Menu
          </summary>
          <div className="px-2 pb-4">{nav}</div>
        </details>

        <div className="hidden flex-1 px-2 py-2 lg:block">{nav}</div>

        <div className="hidden border-t border-border px-5 py-5 lg:flex lg:flex-col lg:gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
          >
            <ExternalLink aria-hidden="true" className="size-4" />
            Lihat website
          </a>
          <Suspense fallback={null}>
            <Account />
          </Suspense>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <Suspense fallback={<p className="text-muted">Memuat…</p>}>
            {children}
          </Suspense>
        </div>
        <div className="mx-auto mt-12 max-w-5xl border-t border-border pt-6 lg:hidden">
          <Suspense fallback={null}>
            <Account />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
