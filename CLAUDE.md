@AGENTS.md

# Proyek

- Spesifikasi: `PRD.md` (kerjakan per fase, berhenti di akhir tiap fase untuk konfirmasi). Data awal: `CONTENT.md`.
- Status: Fase 1–4 selesai (setup, database, halaman publik, animasi). Berikutnya Fase 5 (Panel admin).
- Next.js 16.4 dengan `cacheComponents` + `partialPrefetching`: middleware bernama `src/proxy.ts`; bahasa dibaca lewat `next/root-params` (`locale`) di `src/i18n/request.ts`, bukan `setRequestLocale`.
- `/admin` di luar `[locale]` dan dikecualikan dari matcher proxy.
- Data publik: semua query di `src/lib/data.ts` memakai `"use cache"` + `cacheTag(<nama tabel>)` dan `createPublicClient()` (tanpa cookie). Admin (Fase 5) cukup `revalidateTag("<tabel>")` setelah menyimpan. Fitur admin pakai `src/lib/supabase/server.ts`.
- Pilih bahasa konten dengan `localized(locale, row.x_id, row.x_en)` dari `src/lib/content.ts` (fallback ke `_id`).
- Halaman `[slug]`: `generateStaticParams` wajib mengembalikan minimal satu param (aturan Cache Components); bila kosong dipakai `"_"` yang berujung 404.
- Warna (`src/app/globals.css`): `accent` untuk dekorasi, `accent-text` untuk teks merah, `accent-solid` untuk tombol berteks putih (kontras AA di kedua tema). Kelas tombol lewat `buttonClass()`.
- Database: migrasi di `supabase/migrations/`, data awal di `supabase/seed.sql` (idempoten). Tipe di `src/lib/supabase/database.types.ts`. Supabase CLI v3 default ke lokal: script `db:push`/`db:types` memakai `--remote`.
- Hak tulis = `public.is_admin()` (user terdaftar di `admin_users`), bukan sekadar role authenticated, karena signup Supabase bisa terbuka.
- `messages`: pengunjung tidak bisa INSERT langsung; form kontak memanggil RPC `submit_message` (rate limit 3/10 menit per hash IP, 30/jam global) lewat server action `src/lib/actions/contact.ts`.
- Kolom `_en` boleh null. Grup skill: frontend/backend/database/other. Ikon layanan: `code`/`database`/`clipboard` (lihat `components/home/services.tsx`).
- Skill `/unslop` belum terpasang di mesin ini; audit desain dilakukan manual.
- Animasi di `src/components/motion/`: library `motion` (= Framer Motion, import dari `motion/react`), GSAP hanya di-import dinamis di `HeroParallax`, Lenis di `SmoothScroll` (instance via `getLenis()`). `MotionConfig reducedMotion="user"` di layout. Cek reduced motion/perangkat sentuh pakai `usePrefersReducedMotion`/`usePointerEffects` dari `motion/hooks.ts` (aman untuk hydration), bukan `useReducedMotion`. Durasi transisi UI 0,3–0,8 detik.
