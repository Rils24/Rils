# Portofolio Syahril Aprialsyah

Website portofolio dua bahasa (Indonesia/Inggris) dengan panel admin. Next.js 16 (App Router, Cache Components), Tailwind CSS v4, next-intl, next-themes, Motion (Framer Motion), GSAP, Lenis, dan Supabase. Spesifikasi lengkap ada di [PRD.md](PRD.md), data awal di [CONTENT.md](CONTENT.md).

## Menjalankan secara lokal

```bash
npm install
cp .env.local.example .env.local   # lalu isi kredensial Supabase
npm run dev                         # http://localhost:3000 → diarahkan ke /id atau /en
```

Panel admin ada di `/admin` (login dengan akun yang terdaftar di tabel `admin_users`).

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate tipe route lalu cek TypeScript |
| `npm run format` | Prettier (dengan urutan class Tailwind) |

## Database (Supabase)

Migrasi ada di `supabase/migrations/` (tabel dua bahasa, RLS, storage, rate limit form kontak) dan data awal di `supabase/seed.sql`.

```bash
npx supabase login        # sekali, membuka browser
npm run db:link           # sekali, meminta password database
npm run db:push           # jalankan migrasi + seed ke proyek Supabase
npm run db:types          # perbarui tipe TypeScript dari skema
```

Menambah admin (setelah akun dibuat di Supabase → Authentication → Users):

```bash
npx supabase db query --remote "insert into public.admin_users (user_id) select id from auth.users where email = 'EMAIL_ADMIN'"
```

## Deploy ke Vercel

1. Import repo ini di vercel.com (framework terdeteksi otomatis).
2. Isi Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, dan opsional `RATE_LIMIT_SALT`.
3. `NEXT_PUBLIC_SITE_URL` boleh dikosongkan: domain produksi Vercel dipakai otomatis untuk canonical, sitemap, dan Open Graph. Isi bila memakai domain sendiri (mis. `https://namadomain.com`).
4. Vercel Analytics aktif otomatis saat berjalan di Vercel (aktifkan juga di dashboard proyek).

## SEO

- Metadata per halaman: canonical, `hreflang` (id, en, x-default), Open Graph, Twitter card.
- Gambar Open Graph dibuat otomatis (`opengraph-image.tsx`) dari data profil, proyek, dan artikel.
- `sitemap.xml` (semua halaman dalam dua bahasa) dan `robots.txt` (memblokir `/admin`).
- Data terstruktur JSON-LD: Person + WebSite (Home), CreativeWork (proyek), BlogPosting (artikel).

## Struktur

```
messages/{id,en}.json      Teks antarmuka (next-intl)
src/proxy.ts               Routing bahasa + penjaga sesi /admin (pengganti middleware di Next.js 16)
src/i18n/                  Konfigurasi bahasa, navigasi, dan request config
src/app/[locale]/          Halaman publik (root layout per bahasa)
src/app/admin/             Panel admin (root layout sendiri)
src/lib/data.ts            Query konten publik (di-cache, direvalidasi saat admin menyimpan)
src/lib/admin/             Registry konten admin, server action, query admin
src/lib/supabase/          Klien Supabase: browser, server (sesi), public (cache), admin (service role)
src/components/            Komponen UI, animasi (motion/), dan admin (admin/)
src/assets/fonts/          Font untuk gambar Open Graph (lisensi OFL)
supabase/migrations/       Skema, RLS, bucket storage, rate limit
supabase/seed.sql          Data awal dari CONTENT.md
```

## Variabel lingkungan

Lihat [.env.local.example](.env.local.example). `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server (`src/lib/supabase/admin.ts`, dijaga `server-only`) dan tidak boleh diberi awalan `NEXT_PUBLIC_`.
