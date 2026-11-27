# PRD Website Portofolio Web Developer

> **Untuk Claude Code:** Ini adalah Product Requirements Document untuk proyek ini. Baca seluruh dokumen sebelum menulis kode. Kerjakan per fase sesuai bagian "Tahapan pengerjaan", mulai dari Fase 1, dan berhenti di akhir setiap fase untuk konfirmasi sebelum lanjut. Data awal profil, pengalaman, pendidikan, sertifikat, skill, layanan, dan proyek diambil dari `CONTENT.md`; testimoni dan blog memakai lorem ipsum; gambar proyek, foto, dan CV diunggah pemilik nanti. Jangan pernah menaruh `SUPABASE_SERVICE_ROLE_KEY` di kode yang berjalan di browser.
>
> **Hindari tampilan "AI slop":** proyek ini memakai skill `unslop`. Saat membangun UI, hindari ciri khas UI buatan AI: gradien ungu, efek glow, emoji sebagai label/ikon, spacing tidak konsisten, dan teks generik. Setelah Fase 3 dan Fase 4 selesai, jalankan `/unslop` pada halaman yang sudah dibuat, dengan arah desain dari bagian "Desain visual dan animasi" (aksen merah, light/dark mode, tipografi tebal). Jangan membuat gambar lewat layanan berbayar tanpa persetujuan saya.

## Ringkasan dan tujuan

Website portofolio personal untuk web developer, dengan animasi di hero, yang isinya dikelola sendiri lewat panel admin. Dibangun dengan Next.js, Supabase, Tailwind CSS, serta Framer Motion dan GSAP, lalu di-deploy ke Vercel.

Latar belakang: portofolio statis harus di-edit kodenya setiap kali ada proyek baru. Dengan panel admin, konten bisa ditambah kapan saja, dan websitenya sekaligus membuktikan kemampuan fullstack.

**Tujuan**

1. Menampilkan proyek dalam bentuk studi kasus yang meyakinkan perekrut dan calon klien.
2. Memberi kesan pertama yang kuat lewat desain dan animasi, tanpa mengorbankan kecepatan.
3. Memudahkan pemilik mengelola konten tanpa menyentuh kode.

**Metrik keberhasilan**

| Metrik | Target |
| --- | --- |
| Skor Lighthouse (Performance, SEO, Accessibility) | ≥ 90 di mobile dan desktop |
| Largest Contentful Paint | < 2,5 detik |
| Waktu menambah satu proyek baru lewat admin | < 5 menit |
| Pesan masuk lewat form kontak | Tercatat di database dan terlihat di admin |

## Target pengguna

| Pengguna | Kebutuhan | Yang dicari di website |
| --- | --- | --- |
| Perekrut / HRD | Menilai kandidat dengan cepat (sering hanya 1–2 menit) | Ringkasan keahlian, proyek unggulan, CV, link GitHub dan LinkedIn |
| Calon klien freelance | Yakin bahwa developer bisa mengerjakan proyek mereka | Layanan, hasil kerja, testimoni, form kontak |
| Sesama developer | Melihat kualitas kode dan tulisan | Studi kasus, blog teknis, repositori |
| Admin (pemilik website) | Mengelola konten tanpa coding | Panel admin yang sederhana dan aman |

## Ruang lingkup

Versi pertama (MVP) fokus pada halaman publik yang lengkap dan panel admin untuk proyek, blog, layanan, testimoni, serta pesan masuk.

**Termasuk dalam MVP**

- Halaman publik: Home, daftar proyek, detail proyek, daftar blog, detail blog, kontak
- Panel admin dengan login untuk satu akun admin
- CRUD proyek, kategori, blog, layanan, dan testimoni
- Inbox pesan dari form kontak
- Upload gambar ke Supabase Storage
- Light mode dan dark mode, dengan tombol pengganti tema (saat pertama dibuka mengikuti pengaturan sistem)
- Dua bahasa, Indonesia dan Inggris, dengan tombol ganti bahasa
- Animasi hero dan animasi scroll

**Tidak termasuk dalam MVP (bisa ditambah nanti)**

- Bahasa lain selain Indonesia dan Inggris
- Komentar di blog
- Banyak akun admin atau pembagian peran
- Dashboard analitik pengunjung di dalam admin (sementara pakai Vercel Analytics)
- Newsletter

## Fitur halaman publik

Semua konten halaman publik diambil dari Supabase, sehingga perubahan di admin langsung tampil tanpa deploy ulang. Semua route publik berada di bawah awalan bahasa (`/id/...` dan `/en/...`).

| Halaman | Route | Isi dan kebutuhan fungsional |
| --- | --- | --- |
| Home | `/[locale]` | Hero (foto, nama, jabatan dengan efek mengetik, tombol CV dan kontak); ringkasan layanan; proyek unggulan (`featured = true`); testimoni; 3 artikel blog terbaru; CTA penutup |
| Daftar proyek | `/[locale]/projects` | Grid proyek, filter per kategori dengan animasi layout, urut dari yang terbaru |
| Detail proyek | `/[locale]/projects/[slug]` | Studi kasus: masalah, solusi, peran, tech stack, galeri gambar, link demo dan GitHub, proyek lain di bawahnya |
| Daftar blog | `/[locale]/blog` | Daftar artikel yang sudah dipublikasikan, dengan cover dan tanggal |
| Detail blog | `/[locale]/blog/[slug]` | Isi artikel (Markdown), estimasi waktu baca, tombol share |
| Kontak | `/[locale]/contact` atau bagian di Home | Form nama, email, pesan; validasi Zod; anti-spam (honeypot + rate limit); pesan tersimpan di tabel `messages` |
| Tentang | bagian di Home | Bio singkat, tech stack, tombol unduh CV (PDF) |
| Pengalaman | bagian di Home | Timeline pengalaman kerja, pendidikan, dan sertifikat |

**Kebutuhan umum**

- Navbar tetap di atas dengan link aktif, tombol "Hire Me", tombol ganti tema, dan tombol ganti bahasa (ID / EN)
- Footer berisi link sosial media dan hak cipta
- Halaman 404 kustom
- Metadata SEO dan gambar Open Graph per halaman, diambil dari data proyek atau artikel, dalam bahasa yang sedang aktif

**Fitur ganti bahasa**

- Bahasa yang didukung: Indonesia (`id`) dan Inggris (`en`).
- URL memakai awalan bahasa, mis. `/id/projects` dan `/en/projects`, supaya kedua versi terindeks Google.
- Saat pertama dibuka, bahasa mengikuti pengaturan browser; pilihan pengunjung disimpan di cookie.
- Teks antarmuka (menu, tombol, label form) disimpan di file terjemahan `messages/id.json` dan `messages/en.json`, memakai library next-intl.
- Konten dari database (proyek, blog, layanan, testimoni, profil) punya versi Indonesia dan Inggris, diisi lewat panel admin.
- Jika versi Inggris belum diisi, tampilkan versi Indonesia.
- Tag `hreflang` di setiap halaman untuk SEO dua bahasa.

## Panel admin (CMS)

Panel admin ada di `/admin` (tanpa awalan bahasa, antarmuka admin cukup bahasa Indonesia), hanya bisa diakses setelah login lewat Supabase Auth (email + password), dan dilindungi middleware Next.js serta RLS di database.

| Menu | Fungsi |
| --- | --- |
| Dashboard | Jumlah proyek, artikel, pesan belum dibaca; daftar pesan terbaru |
| Proyek | Tambah, edit, hapus; upload thumbnail dan galeri; pilih kategori dan tech stack; tandai unggulan; atur urutan tampil |
| Kategori | Tambah, edit, hapus kategori proyek |
| Blog | Editor Markdown dengan pratinjau; simpan sebagai draf atau publikasikan |
| Layanan | Kelola kartu layanan (judul, ikon, deskripsi, urutan) |
| Testimoni | Kelola nama, jabatan, foto, kutipan |
| Pesan | Inbox pesan dari form kontak; tandai sudah dibaca; hapus |
| Profil | Edit nama, jabatan, bio, foto hero, link sosial media, file CV |
| Pengalaman | Kelola pengalaman kerja, pendidikan, dan sertifikat |

**Aturan**

- Slug dibuat otomatis dari judul dan bisa diedit
- Setiap simpan/hapus memicu revalidasi halaman publik terkait (`revalidatePath`)
- Hapus data selalu lewat dialog konfirmasi
- Form memakai validasi yang sama dengan server (Zod)
- Form konten dua bahasa punya tab Indonesia dan Inggris

## Desain visual dan animasi

Arah desain mengikuti referensi: tema gelap dan terang, satu warna aksen merah, nama besar di hero dengan foto yang menimpa teks. Satu animasi "wow" di hero, bagian lain cukup animasi halus.

**Gaya visual**

| Elemen | Ketentuan |
| --- | --- |
| Warna | Dark mode: latar gelap (mis. `#0F0F12`), kartu sedikit lebih terang. Light mode: latar terang (mis. `#F7F7F8`), teks gelap. Aksen merah (mis. `#E63946`) untuk tombol dan sorotan di kedua tema |
| Tipografi | Heading tebal dan besar (mis. Space Grotesk atau Clash Display), body mudah dibaca (mis. Inter) |
| Layout | Grid 12 kolom, lebar konten maks. 1200 px, jarak antar-section lega |
| Komponen | Sudut membulat 12–16 px, border tipis, hover dengan perubahan warna/skala kecil |
| Responsif | Mobile-first; breakpoint 640, 768, 1024, 1280 px |

**Daftar animasi**

| Bagian | Animasi | Library |
| --- | --- | --- |
| Hero, saat halaman dibuka | Foto muncul lewat mask dari bawah, nama muncul per huruf, jabatan menyusul | Framer Motion |
| Hero, foto | Foto PNG transparan di depan teks nama; tilt 3D 5–10° mengikuti kursor; blob gradien bergerak di belakang | Framer Motion |
| Hero, saat scroll | Parallax: teks nama dan foto bergerak dengan kecepatan berbeda | GSAP ScrollTrigger |
| Hero, jabatan | Efek mengetik bergantian, mis. "Frontend Developer" → "Fullstack Developer" | Framer Motion |
| Kartu layanan | Muncul bergantian (stagger) saat masuk layar; ikon bergerak saat hover | Framer Motion |
| Grid proyek | Zoom gambar + overlay judul dan tech stack saat hover; animasi layout saat filter | Framer Motion |
| Testimoni | Foto hitam-putih jadi berwarna saat hover; slider otomatis | Framer Motion |
| Global | Smooth scroll; kursor kustom; tombol magnetik | Lenis, Framer Motion |

**Aturan animasi**

- Durasi 0,3–0,8 detik, easing halus (ease-out)
- Hormati `prefers-reduced-motion`: animasi besar dimatikan, sisakan fade sederhana
- Tilt, kursor kustom, dan tombol magnetik dimatikan di perangkat sentuh
- Animasi hanya memakai `transform` dan `opacity` supaya tetap 60 fps

## Tech stack dan arsitektur

Next.js menjadi satu aplikasi untuk halaman publik dan panel admin; Supabase menyimpan data, menangani login, dan menyimpan file.

| Bagian | Teknologi | Fungsi |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Frontend dan backend dalam satu proyek; render di server untuk SEO |
| Styling | Tailwind CSS | Utility class, light dan dark mode (next-themes), responsif |
| Animasi | Framer Motion, GSAP + ScrollTrigger, Lenis | Animasi komponen, animasi scroll, smooth scroll |
| Bahasa | next-intl | Routing `/id` dan `/en`, file terjemahan |
| Database | Supabase (PostgreSQL) + RLS | Menyimpan semua konten dan pesan |
| Akses data | `@supabase/ssr` dan `supabase-js` | Query dari server dan browser dengan sesi login |
| Login | Supabase Auth | Email + password untuk admin |
| File | Supabase Storage | Gambar proyek, foto, CV |
| Validasi | Zod + React Hook Form | Validasi form di browser dan server |
| Deploy | Vercel + GitHub | Deploy otomatis setiap push ke branch utama |

**Arsitektur**

```
Pengunjung ──┐                 ┌──────────── Vercel ────────────┐        ┌──── Supabase ────┐
(perekrut,   ├──── HTTPS ────▶ │ Next.js (App Router)           │ ─data─▶│ PostgreSQL + RLS │
 klien)      │                 │ - Halaman publik (cache/ISR)   │ ─login▶│ Auth             │
Admin ───────┘                 │ - Panel admin /admin           │ ─file─▶│ Storage          │
                               │ - Server Actions + Zod         │        └──────────────────┘
                               │ - Middleware (auth + locale)   │
                               └────────────────────────────────┘
```

Pengunjung dan admin sama-sama masuk lewat Next.js; hanya admin yang sudah login yang bisa mengubah data, dijaga middleware dan RLS.

## Skema database

Sebelas tabel di PostgreSQL Supabase. Data awalnya diambil dari `CONTENT.md`. Semua tabel punya `id uuid` (default `gen_random_uuid()`) dan `created_at timestamptz`; tabel yang bisa diedit juga punya `updated_at`.

| Tabel | Kolom utama | Catatan |
| --- | --- | --- |
| `profile` | name, role_titles text[], bio, hero_photo_url, cv_url, email, github_url, linkedin_url, instagram_url | Satu baris saja; isi hero dan bagian Tentang |
| `categories` | name, slug | Mis. Web, App, UI/UX |
| `projects` | title, slug (unik), summary, problem, solution, role, thumbnail_url, gallery text[], tech_stack text[], demo_url, github_url, category_id → categories, featured bool, sort_order int, published bool | Detail proyek berbentuk studi kasus |
| `posts` | title, slug (unik), excerpt, content (Markdown), cover_url, published bool, published_at | Artikel blog |
| `services` | title, icon, description, sort_order | Kartu layanan di Home |
| `testimonials` | name, role, photo_url, quote, sort_order | |
| `messages` | name, email, message, is_read bool | Dari form kontak |
| `skills` | name, icon, group (frontend/backend/database/lainnya), sort_order | Daftar tech stack di bagian Tentang |
| `experiences` | company, position, location, start_date, end_date, highlights text[], sort_order | Riwayat kerja di bagian Pengalaman |
| `educations` | institution, program, start_date, end_date | Riwayat pendidikan |
| `certifications` | name, issuer, issued_at, credential_url | Sertifikat |

**Kolom dua bahasa**: kolom teks yang tampil ke pengunjung dibuat berpasangan dengan akhiran `_id` dan `_en`, mis. `title_id`/`title_en`, `summary_id`/`summary_en`, `problem_id`/`problem_en`, `solution_id`/`solution_en`, `content_id`/`content_en`, `description_id`/`description_en`, `quote_id`/`quote_en`, `bio_id`/`bio_en`, `role_titles_id`/`role_titles_en`, `position_id`/`position_en`, `highlights_id`/`highlights_en`, `program_id`/`program_en`, `location_id`/`location_en`. Nama kategori juga `name_id`/`name_en`. Slug tetap satu untuk kedua bahasa. Kolom `_id` wajib diisi, kolom `_en` boleh kosong (fallback ke `_id`).

**Row Level Security (RLS)**

- RLS aktif di semua tabel.
- Pengunjung (role `anon`) hanya boleh `SELECT` baris yang `published = true` (untuk `projects` dan `posts`) dan semua baris di tabel konten lainnya.
- `messages`: pengunjung hanya boleh `INSERT`; tidak boleh membaca.
- Admin (role `authenticated`) boleh `SELECT`, `INSERT`, `UPDATE`, `DELETE` di semua tabel.

**Storage**

- Bucket `images` (publik untuk dibaca) untuk thumbnail, galeri, cover, dan foto; upload dan hapus hanya untuk admin.
- Bucket `files` untuk CV (PDF).

## Kebutuhan non-fungsional

| Aspek | Ketentuan |
| --- | --- |
| Performa | Halaman publik dirender di server dengan cache/ISR (revalidasi saat admin menyimpan); gambar lewat `next/image`; font lewat `next/font`; library animasi dimuat hanya di komponen yang memakainya |
| SEO | Metadata per halaman, Open Graph, `sitemap.xml`, `robots.txt`, `hreflang`, data terstruktur (JSON-LD) untuk profil dan artikel |
| Aksesibilitas | Kontras warna memenuhi WCAG AA di kedua tema; semua gambar punya alt; bisa dinavigasi dengan keyboard; `prefers-reduced-motion` dihormati |
| Keamanan | RLS di semua tabel; kunci `service_role` hanya di server, tidak pernah di browser; validasi Zod di server; rate limit dan honeypot di form kontak; route `/admin` dilindungi middleware |
| Kompatibilitas | Chrome, Firefox, Safari, Edge versi terbaru; Android dan iOS |
| Pemeliharaan | TypeScript; tipe database dibuat otomatis dengan Supabase CLI; ESLint + Prettier; repositori di GitHub dengan deploy otomatis ke Vercel |

## Tahapan pengerjaan

Pengerjaan dibagi enam fase berurutan; setiap fase selesai dengan hasil yang bisa dicek di Vercel.

1. **Setup** — buat proyek Next.js (App Router, TypeScript, Tailwind), pasang next-intl dan next-themes, hubungkan ke Supabase, siapkan `.env.local.example`, repositori GitHub, dan deploy pertama ke Vercel.
2. **Database** — buat tabel (dengan kolom dua bahasa), RLS, dan bucket storage sebagai file migrasi SQL; isi data awal dari `CONTENT.md` (testimoni dan blog lorem ipsum, gambar menyusul); generate tipe TypeScript.
3. **Halaman publik statis** — bangun layout, navbar (tombol tema dan bahasa), footer, dan semua halaman publik dengan data dari Supabase, tanpa animasi dulu.
   Di akhir fase ini, jalankan `/unslop` pada Home dan halaman proyek untuk audit dan perbaikan spacing, warna, ikon, copy, tipografi, dan layout.
4. **Animasi** — hero (reveal, tilt, parallax, efek mengetik), lalu animasi scroll dan hover di bagian lain; uji `prefers-reduced-motion` dan tampilan HP. Di akhir fase, jalankan `/unslop` lagi untuk mengecek detail dan motion.
5. **Panel admin** — login, middleware, CRUD semua konten (form dengan tab ID/EN), upload gambar, inbox pesan, revalidasi halaman.
6. **Finishing** — SEO, sitemap, Open Graph, `hreflang`, cek Lighthouse, perbaikan aksesibilitas, isi konten asli, sambungkan domain.

**Checklist sebelum rilis**

- [ ] Skor Lighthouse ≥ 90 di mobile
- [ ] Form kontak teruji dan pesan masuk ke admin
- [ ] RLS teruji: pengunjung tidak bisa mengubah data
- [ ] Semua halaman tampil benar di HP, di light mode dan dark mode
- [ ] Semua halaman tampil benar di bahasa Indonesia dan Inggris
- [ ] Konten asli (foto, proyek, CV) sudah diisi

## Risiko dan pertanyaan terbuka

**Risiko**

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Proyek Supabase gratis di-pause saat lama tidak ada aktivitas | Website tidak bisa memuat data | Cek ketentuan paket gratis terbaru; halaman publik di-cache sehingga tetap tampil; aktifkan kembali dari dashboard bila perlu |
| Animasi terlalu berat | Website lambat, skor Lighthouse turun | Batasi animasi besar di hero; hanya `transform`/`opacity`; muat GSAP secara terpisah |
| Kunci rahasia bocor ke browser | Data bisa diubah orang lain | `service_role` hanya di server; RLS di semua tabel |
| Spam di form kontak | Inbox penuh | Honeypot, rate limit, validasi |

**Pertanyaan terbuka** (pakai asumsi dalam kurung sampai diputuskan)

- [ ] Nama domain yang akan dipakai? (sementara pakai domain Vercel)
- [ ] Font heading final? (sementara Space Grotesk)
- [ ] Bahasa default bila browser bukan Indonesia atau Inggris? (sementara Indonesia)
- [ ] Perlu notifikasi email ke admin setiap ada pesan masuk? (belum dibuat di MVP)

**Sudah diputuskan**

- Warna aksen: merah.
- Konten awal: dari profil LinkedIn (`CONTENT.md`); testimoni dan blog lorem ipsum; gambar proyek ditambahkan pemilik lewat panel admin.
- Tema: light mode dan dark mode sama-sama tersedia.
- Bahasa: Indonesia dan Inggris, dengan tombol ganti bahasa.
