# Portofolio Syahril Aprialsyah

Website portofolio dua bahasa (Indonesia/Inggris) dengan panel admin. Next.js 16 (App Router, Cache Components), Tailwind CSS v4, next-intl, next-themes, dan Supabase. Spesifikasi lengkap ada di [PRD.md](PRD.md), data awal di [CONTENT.md](CONTENT.md).

## Menjalankan secara lokal

```bash
npm install
cp .env.local.example .env.local   # lalu isi kredensial Supabase
npm run dev                         # http://localhost:3000 → diarahkan ke /id atau /en
```

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate tipe route lalu cek TypeScript |
| `npm run format` | Prettier (dengan urutan class Tailwind) |

## Database (Supabase)

Migrasi ada di `supabase/migrations/` (tabel dua bahasa, RLS, storage) dan data awal di `supabase/seed.sql`.

```bash
npx supabase login        # sekali, membuka browser
npm run db:link           # sekali, meminta password database
npm run db:push           # jalankan migrasi + seed ke proyek Supabase
npm run db:types          # perbarui tipe TypeScript dari skema
```

Hak tulis hanya untuk user yang terdaftar di tabel `admin_users`.

## Struktur

```
messages/{id,en}.json      Teks antarmuka (next-intl)
src/proxy.ts               Routing bahasa (pengganti middleware di Next.js 16)
src/i18n/                  Konfigurasi bahasa, navigasi, dan request config
src/app/[locale]/          Halaman publik (root layout per bahasa)
src/lib/supabase/          Klien Supabase: browser, server (sesi), public (cache), admin (service role)
src/components/            Komponen bersama (tema, ganti bahasa)
supabase/migrations/       Skema, RLS, dan bucket storage
supabase/seed.sql          Data awal dari CONTENT.md
```

## Variabel lingkungan

Lihat [.env.local.example](.env.local.example). `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server (`src/lib/supabase/admin.ts`, dijaga `server-only`) dan tidak boleh diberi awalan `NEXT_PUBLIC_`.
