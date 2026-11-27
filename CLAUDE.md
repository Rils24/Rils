@AGENTS.md

# Proyek

- Spesifikasi: `PRD.md` (kerjakan per fase, berhenti di akhir tiap fase untuk konfirmasi). Data awal: `CONTENT.md`.
- Status: Fase 1 (Setup) dan Fase 2 (Database) selesai.
- Next.js 16.4 dengan `cacheComponents` + `partialPrefetching`: middleware bernama `src/proxy.ts`; bahasa dibaca lewat `next/root-params` (`locale`) di `src/i18n/request.ts`, bukan `setRequestLocale`.
- `/admin` di luar `[locale]` dan dikecualikan dari matcher proxy.
- Konten publik dibaca dengan `createPublicClient()` (tanpa cookie, aman di `"use cache"`); fitur admin pakai `src/lib/supabase/server.ts`.
- Token warna di `src/app/globals.css`: pakai `accent-strong` untuk teks kecil/tombol berteks putih (kontras AA di tema terang).
- Database: migrasi di `supabase/migrations/`, data awal di `supabase/seed.sql` (idempoten). Tipe di `src/lib/supabase/database.types.ts` (`npm run db:types`).
- Hak tulis = `public.is_admin()` (user terdaftar di `admin_users`), bukan sekadar role authenticated, karena signup Supabase bisa terbuka.
- `messages`: anon hanya boleh INSERT tanpa membaca balik, jadi jangan pakai `.insert().select()` di form kontak.
- Kolom `_en` boleh null: tampilkan fallback ke `_id`. Grup skill: frontend/backend/database/other.
