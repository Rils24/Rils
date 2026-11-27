import { FolderKanban, Mail, Newspaper, Plus, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { buttonClass } from "@/components/ui/button";
import { getDashboard } from "@/lib/admin/data";
import { formatDate } from "@/lib/admin/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const data = await getDashboard();

  const stats = [
    {
      label: "Proyek",
      value: data.projects,
      href: "/admin/projects",
      Icon: FolderKanban,
    },
    {
      label: "Artikel",
      value: data.posts,
      href: "/admin/posts",
      Icon: Newspaper,
    },
    {
      label: "Pesan belum dibaca",
      value: data.unread,
      href: "/admin/messages",
      Icon: Mail,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan isi website dan pesan masuk."
      />

      <ul className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, href, Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-foreground/30"
            >
              <span className="flex items-center gap-2 text-sm text-muted">
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </span>
              <span className="font-display text-4xl font-bold tabular-nums">
                {value}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/admin/projects/new" className={buttonClass("primary")}>
          <Plus aria-hidden="true" className="size-4" /> Proyek baru
        </Link>
        <Link href="/admin/posts/new" className={buttonClass("secondary")}>
          <Plus aria-hidden="true" className="size-4" /> Artikel baru
        </Link>
        <Link href="/admin/profile" className={buttonClass("secondary")}>
          <UserRound aria-hidden="true" className="size-4" /> Edit profil
        </Link>
      </div>

      <section aria-labelledby="latest" className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2
            id="latest"
            className="font-display text-xl font-bold tracking-tight"
          >
            Pesan terbaru
          </h2>
          <Link
            href="/admin/messages"
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            Semua pesan →
          </Link>
        </div>
        {data.latest.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
            Belum ada pesan dari form kontak.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {data.latest.map((m) => (
              <li key={m.id} className="flex items-start gap-3 px-5 py-4">
                <span
                  aria-label={m.is_read ? undefined : "Belum dibaca"}
                  className={`mt-2 size-2 shrink-0 rounded-full ${m.is_read ? "bg-transparent" : "bg-accent"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-xs text-muted">
                      {formatDate(m.created_at, "datetime")}
                    </span>
                  </p>
                  <p className="truncate text-sm text-muted">{m.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
