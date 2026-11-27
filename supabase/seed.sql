-- =============================================================================
-- Data awal dari CONTENT.md.
-- Testimoni dan blog adalah CONTOH (lorem ipsum), ditandai "[Contoh]" supaya
-- mudah dicari dan diganti lewat panel admin.
-- Gambar, foto hero, dan CV sengaja kosong; diunggah pemilik lewat admin.
-- Aman dijalankan ulang: tiap blok hanya mengisi bila datanya belum ada.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Profil
-- -----------------------------------------------------------------------------
insert into public.profile (
  name, role_titles_id, role_titles_en, bio_id, bio_en, about_id, about_en,
  location_id, location_en, email, linkedin_url
) values (
  'Syahril Aprialsyah',
  array['Web Developer', 'Pengembang Sistem Informasi', 'Laravel Developer'],
  array['Web Developer', 'Information Systems Developer', 'Laravel Developer'],
  'Web developer dari Padang yang membangun sistem informasi untuk membantu organisasi bekerja lebih rapi dan efisien.',
  'Web developer from Padang building information systems that help organizations work more efficiently.',
  'Mahasiswa Sistem Informasi di UIN Imam Bonjol Padang dengan pengalaman membangun aplikasi web untuk lembaga kursus, pondok pesantren, dan instansi pemerintah: dari sistem ERP, sistem absensi, hingga sistem pendaftaran magang. Terbiasa bekerja langsung dengan klien untuk menggali kebutuhan, menganalisis sistem, lalu menerjemahkannya menjadi fitur yang sesuai alur kerja mereka.',
  'Information Systems student at UIN Imam Bonjol Padang with hands-on experience building web applications for a language center, an Islamic boarding school, and a government agency, from an ERP system and attendance systems to an internship registration platform. Used to working directly with clients to gather requirements, analyze systems, and turn them into features that fit their workflows.',
  'Padang, Sumatera Barat, Indonesia',
  'Padang, West Sumatra, Indonesia',
  'm.syahril10april@gmail.com',
  'https://www.linkedin.com/in/syahril-aprialsyah'
)
on conflict (singleton) do nothing;

-- -----------------------------------------------------------------------------
-- Kategori proyek
-- -----------------------------------------------------------------------------
insert into public.categories (name_id, name_en, slug, sort_order) values
  ('Web App', 'Web App', 'web-app', 1),
  ('Website', 'Website', 'website', 2)
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- Proyek (semua published; 1–3 featured)
-- -----------------------------------------------------------------------------
insert into public.projects (
  title_id, title_en, slug, summary_id, summary_en, problem_id, problem_en,
  solution_id, solution_en, role_id, role_en, tech_stack, category_id,
  featured, sort_order, published
)
select
  v.title_id, v.title_en, v.slug, v.summary_id, v.summary_en, v.problem_id,
  v.problem_en, v.solution_id, v.solution_en, v.role_id, v.role_en,
  v.tech_stack, c.id, v.featured, v.sort_order, true
from (values
  (
    'Sistem ERP Time Language Center',
    'Time Language Center ERP System',
    'erp-time-language-center',
    'Sistem ERP berbasis web yang menyatukan absensi, keuangan, dan manajemen data lembaga kursus bahasa dalam satu platform.',
    'A web-based ERP that unifies attendance, finance, and data management for a language center in one platform.',
    'Proses operasional lembaga (absensi tutor dan siswa, keuangan, data lembaga) tersebar dan sulit dipantau.',
    'The center''s operations (tutor and student attendance, finance, institutional data) were scattered and hard to monitor.',
    'Platform terpusat dengan modul absensi, modul keuangan, dan fitur manajemen data, dikembangkan bersama klien lewat rapat online.',
    'A centralized platform with attendance, finance, and data management modules, built together with the client through online meetings.',
    'Web Developer', 'Web Developer',
    array[]::text[],
    'web-app', true, 1
  ),
  (
    'Sistem Absensi Pondok Pesantren YATI Kamang Mudik',
    'Pondok Pesantren YATI Kamang Mudik Attendance System',
    'absensi-pondok-pesantren-yati',
    'Sistem absensi berbasis web untuk mencatat dan mengelola kehadiran di pondok pesantren.',
    'A web-based attendance system for recording and managing attendance at an Islamic boarding school.',
    null, null,
    'Aplikasi absensi berbasis web dengan pengelolaan rekap kehadiran, dirancang bersama pihak pesantren.',
    'A web attendance app with attendance record management, designed together with the school.',
    'Web Developer', 'Web Developer',
    array['JavaScript'],
    'web-app', true, 2
  ),
  (
    'Website Pondok Pesantren YATI Kamang Mudik',
    'Pondok Pesantren YATI Kamang Mudik Website',
    'website-pondok-pesantren-yati',
    'Website resmi pondok pesantren untuk mendukung digitalisasi layanan pendidikan.',
    'The boarding school''s official website, supporting the digitalization of its educational services.',
    null, null,
    null, null,
    'Web Developer (kontributor)', 'Web Developer (contributor)',
    array['JavaScript'],
    'website', true, 3
  ),
  (
    'Sistem Pendaftaran Magang Kominfo',
    'Kominfo Internship Registration System',
    'pendaftaran-magang-kominfo',
    'Sistem pendaftaran magang berbasis web untuk mempermudah proses pendaftaran dan pengelolaan data peserta.',
    'A web-based internship registration system that streamlines applications and intern data management.',
    'Proses pendaftaran dan pengelolaan data peserta magang belum efisien.',
    'The internship application process and intern data management were inefficient.',
    'Aplikasi pendaftaran dengan panel admin Filament untuk mengelola data pendaftar.',
    'A registration app with a Filament admin panel to manage applicant data.',
    'Web Developer Intern', 'Web Developer Intern',
    array['Laravel', 'Filament', 'MySQL'],
    'web-app', false, 4
  )
) as v (
  title_id, title_en, slug, summary_id, summary_en, problem_id, problem_en,
  solution_id, solution_en, role_id, role_en, tech_stack, category_slug,
  featured, sort_order
)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- Layanan
-- -----------------------------------------------------------------------------
insert into public.services (title_id, title_en, icon, description_id, description_en, sort_order)
select * from (values
  ('Pengembangan Aplikasi Web', 'Web App Development', 'code',
   'Membangun aplikasi web dari nol sampai siap dipakai, sesuai kebutuhan organisasi.',
   'Building web applications from scratch to launch, tailored to your organization.', 1),
  ('Sistem Informasi & ERP', 'Information Systems & ERP', 'database',
   'Sistem absensi, keuangan, pendaftaran, dan manajemen data dalam satu platform terpusat.',
   'Attendance, finance, registration, and data management systems in one centralized platform.', 2),
  ('Analisis Kebutuhan Sistem', 'Requirements Analysis', 'clipboard',
   'Menggali kebutuhan bersama klien dan menerjemahkannya menjadi fitur yang sesuai alur kerja.',
   'Gathering requirements with clients and turning them into features that fit their workflow.', 3)
) as v
where not exists (select 1 from public.services);

-- -----------------------------------------------------------------------------
-- Skill
-- -----------------------------------------------------------------------------
insert into public.skills (name_id, name_en, group_name, sort_order)
select * from (values
  ('HTML', 'HTML', 'frontend', 1),
  ('CSS', 'CSS', 'frontend', 2),
  ('JavaScript', 'JavaScript', 'frontend', 3),
  ('Web Design', 'Web Design', 'frontend', 4),
  ('Laravel', 'Laravel', 'backend', 5),
  ('Filament', 'Filament', 'backend', 6),
  ('MySQL', 'MySQL', 'database', 7),
  ('Analisis Data', 'Data Analysis', 'other', 8),
  ('Analisis Kebutuhan Sistem', 'Requirements Analysis', 'other', 9),
  ('Kolaborasi dengan Klien', 'Client Collaboration', 'other', 10)
) as v
where not exists (select 1 from public.skills);

-- -----------------------------------------------------------------------------
-- Pengalaman (tanggal = awal bulan; tampilan hanya bulan dan tahun)
-- -----------------------------------------------------------------------------
insert into public.experiences (
  company, position_id, position_en, location_id, location_en,
  start_date, end_date, highlights_id, highlights_en, sort_order
)
select * from (values
  (
    'Time Language Center', 'Pengembang Web', 'Web Developer',
    'Padang, Sumatera Barat', 'Padang, West Sumatra',
    date '2025-09-01', date '2025-12-01',
    array[
      'Membangun sistem ERP berbasis web yang menyatukan berbagai proses operasional lembaga kursus bahasa dalam satu platform.',
      'Mengembangkan modul absensi untuk memantau kehadiran tutor dan siswa secara terstruktur.',
      'Ikut mengembangkan modul keuangan untuk mencatat dan memantau transaksi organisasi.',
      'Membuat fitur manajemen untuk merapikan data lembaga dan kegiatan operasional harian.',
      'Berkoordinasi dengan klien lewat rapat online untuk menggali kebutuhan bisnis, menganalisis sistem, dan menyesuaikan fitur dengan alur kerja yang ada.'
    ],
    array[
      'Built a web-based ERP system that brings a language center''s operational processes into one centralized platform.',
      'Developed attendance modules for structured tracking of tutor and student attendance.',
      'Contributed to financial modules for recording and monitoring the organization''s transactions.',
      'Built management features to organize institutional data and day-to-day operations.',
      'Worked with the client through online meetings to gather business requirements, analyze system needs, and align features with existing workflows.'
    ],
    1
  ),
  (
    'Pondok Pesantren YATI Kamang Mudik', 'Pengembang Web', 'Web Developer',
    'Kabupaten Agam, Sumatera Barat', 'Agam Regency, West Sumatra',
    date '2025-07-01', date '2025-08-01',
    array[
      'Membangun sistem absensi berbasis web untuk pencatatan dan pengelolaan kehadiran di pondok pesantren.',
      'Berkomunikasi dengan klien untuk mengidentifikasi kebutuhan sistem dan menentukan fitur yang tepat.',
      'Ikut dalam rapat proyek untuk menetapkan kebutuhan, merencanakan fungsi, dan mengoordinasikan pengembangan.',
      'Ikut mengembangkan website Pondok Pesantren YATI Kamang Mudik untuk mendukung digitalisasi layanan pendidikan.'
    ],
    array[
      'Built a web-based attendance system for tracking and managing attendance records at an Islamic boarding school.',
      'Worked with the client to identify system requirements, gather user needs, and define the right features.',
      'Took part in project meetings to set requirements, plan functionality, and coordinate development.',
      'Contributed to the Pondok Pesantren YATI Kamang Mudik website to support the digitalization of its educational services.'
    ],
    2
  ),
  (
    'Kominfo', 'Magang Web Developer', 'Web Developer Intern',
    'Kota Medan, Sumatera Utara', 'Medan, North Sumatra',
    date '2025-01-01', date '2025-03-01',
    array[
      'Membangun sistem pendaftaran magang berbasis web dengan Laravel, Filament, dan MySQL untuk mempermudah proses pendaftaran dan pengelolaan data peserta magang.',
      'Ikut rapat tim untuk membahas pengembangan program pelatihan, termasuk penambahan materi pelatihan micro-skills.',
      'Bersama tim merapikan dan menyusun ulang dokumentasi agar lebih terstruktur dan mudah dipelihara.'
    ],
    array[
      'Built a web-based internship registration system with Laravel, Filament, and MySQL to streamline applications and intern data management.',
      'Joined team meetings on improving the training program, including new micro-skills training materials.',
      'Worked with the team to reorganize documentation for better structure and maintainability.'
    ],
    3
  )
) as v
where not exists (select 1 from public.experiences);

-- -----------------------------------------------------------------------------
-- Pendidikan
-- -----------------------------------------------------------------------------
insert into public.educations (institution, program_id, program_en, start_date, end_date, sort_order)
select 'UIN Imam Bonjol Padang', 'S1 Sistem Informasi', 'Bachelor of Information Systems',
       date '2022-08-01', date '2026-11-01', 1
where not exists (select 1 from public.educations);

-- -----------------------------------------------------------------------------
-- Sertifikat (penerbit, tanggal, dan link diisi nanti lewat admin)
-- -----------------------------------------------------------------------------
insert into public.certifications (name, sort_order)
select * from (values
  ('Belajar Dasar AI', 1),
  ('Data Analyst', 2)
) as v
where not exists (select 1 from public.certifications);

-- -----------------------------------------------------------------------------
-- [Contoh] Testimoni — lorem ipsum, ganti lewat admin
-- -----------------------------------------------------------------------------
insert into public.testimonials (name, role, quote_id, quote_en, sort_order)
select * from (values
  ('[Contoh] Nama Klien Satu', 'Jabatan, Perusahaan',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 1),
  ('[Contoh] Nama Klien Dua', 'Jabatan, Perusahaan',
   'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
   'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 2),
  ('[Contoh] Nama Klien Tiga', 'Jabatan, Perusahaan',
   'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
   'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 3)
) as v
where not exists (select 1 from public.testimonials);

-- -----------------------------------------------------------------------------
-- [Contoh] Artikel blog — lorem ipsum, ganti lewat admin
-- -----------------------------------------------------------------------------
insert into public.posts (title_id, title_en, slug, excerpt_id, excerpt_en, content_id, content_en, published, published_at)
select * from (values
  ('[Contoh] Artikel Pertama', '[Sample] First Article', 'contoh-artikel-pertama',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
   E'## Lorem ipsum\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n- Ut enim ad minim veniam\n- Quis nostrud exercitation\n\n```js\nconsole.log("contoh");\n```\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
   E'## Lorem ipsum\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n- Ut enim ad minim veniam\n- Quis nostrud exercitation\n\n```js\nconsole.log("sample");\n```\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
   true, timestamptz '2026-11-20 09:00:00+07'),
  ('[Contoh] Artikel Kedua', '[Sample] Second Article', 'contoh-artikel-kedua',
   'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
   'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
   E'## Dolor sit amet\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n> Excepteur sint occaecat cupidatat non proident.\n\nSunt in culpa qui officia deserunt mollit anim id est laborum.',
   E'## Dolor sit amet\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n> Excepteur sint occaecat cupidatat non proident.\n\nSunt in culpa qui officia deserunt mollit anim id est laborum.',
   true, timestamptz '2026-11-10 09:00:00+07'),
  ('[Contoh] Artikel Ketiga', '[Sample] Third Article', 'contoh-artikel-ketiga',
   'Duis aute irure dolor in reprehenderit in voluptate velit.',
   'Duis aute irure dolor in reprehenderit in voluptate velit.',
   E'## Consectetur\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\n1. Lorem ipsum\n2. Dolor sit amet\n3. Consectetur adipiscing\n\nExcepteur sint occaecat cupidatat non proident.',
   E'## Consectetur\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\n1. Lorem ipsum\n2. Dolor sit amet\n3. Consectetur adipiscing\n\nExcepteur sint occaecat cupidatat non proident.',
   true, timestamptz '2026-11-01 09:00:00+07')
) as v (title_id, title_en, slug, excerpt_id, excerpt_en, content_id, content_en, published, published_at)
on conflict (slug) do nothing;
