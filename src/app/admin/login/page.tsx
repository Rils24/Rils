import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  const notice =
    error === "forbidden"
      ? "Akun ini belum terdaftar sebagai admin. Masuk dengan akun admin."
      : null;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="text-sm font-medium text-muted">Panel admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
          Masuk
        </h1>
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <LoginForm notice={notice} />
        </div>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Kembali ke website
        </Link>
      </div>
    </main>
  );
}
