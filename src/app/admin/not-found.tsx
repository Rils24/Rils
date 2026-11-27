import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="font-display text-2xl font-bold">
        Halaman admin tidak ditemukan
      </h1>
      <Link href="/admin" className="font-medium underline underline-offset-4">
        Kembali ke dashboard
      </Link>
    </main>
  );
}
