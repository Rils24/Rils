-- =============================================================================
-- Fase 2 — Skema konten portofolio
-- Kolom yang tampil ke pengunjung berpasangan _id (wajib) dan _en (boleh kosong;
-- aplikasi menampilkan versi _id bila _en kosong).
-- =============================================================================

-- Helper: isi updated_at otomatis setiap baris diubah.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profile: satu baris saja (dijaga kolom `singleton`)
-- -----------------------------------------------------------------------------
create table public.profile (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique check (singleton),
  name text not null check (char_length(name) > 0),
  role_titles_id text[] not null default '{}',
  role_titles_en text[],
  bio_id text not null,               -- bio singkat di hero
  bio_en text,
  about_id text,                      -- paragraf bagian Tentang
  about_en text,
  location_id text,
  location_en text,
  hero_photo_url text,
  cv_url text,
  email text,
  github_url text,
  linkedin_url text,
  instagram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- categories: kategori proyek
-- -----------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name_id text not null check (char_length(name_id) > 0),
  name_en text,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- projects: studi kasus
-- -----------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title_id text not null check (char_length(title_id) > 0),
  title_en text,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary_id text not null,
  summary_en text,
  problem_id text,
  problem_en text,
  solution_id text,
  solution_en text,
  role_id text,
  role_en text,
  thumbnail_url text,
  gallery text[] not null default '{}',
  tech_stack text[] not null default '{}',
  demo_url text,
  github_url text,
  category_id uuid references public.categories (id) on delete set null,
  featured boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_category_id_idx on public.projects (category_id);
create index projects_listing_idx on public.projects (published, featured, sort_order);

-- -----------------------------------------------------------------------------
-- posts: artikel blog (Markdown)
-- -----------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title_id text not null check (char_length(title_id) > 0),
  title_en text,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt_id text,
  excerpt_en text,
  content_id text not null default '',
  content_en text,
  cover_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_listing_idx on public.posts (published, published_at desc);

-- Isi published_at otomatis saat artikel pertama kali dipublikasikan.
create or replace function public.set_post_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.published and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger posts_set_published_at
  before insert or update on public.posts
  for each row execute function public.set_post_published_at();

-- -----------------------------------------------------------------------------
-- services: kartu layanan di Home
-- -----------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title_id text not null check (char_length(title_id) > 0),
  title_en text,
  icon text,                          -- nama ikon, dipetakan ke komponen di frontend
  description_id text not null,
  description_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- testimonials
-- -----------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) > 0),
  role text,
  photo_url text,
  quote_id text not null,
  quote_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- messages: dari form kontak (pengunjung hanya boleh INSERT)
-- -----------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index messages_inbox_idx on public.messages (is_read, created_at desc);

-- -----------------------------------------------------------------------------
-- skills: tech stack di bagian Tentang
-- -----------------------------------------------------------------------------
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name_id text not null check (char_length(name_id) > 0),
  name_en text,
  icon text,
  group_name text not null default 'other'
    check (group_name in ('frontend', 'backend', 'database', 'other')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- experiences: riwayat kerja (tanggal disimpan per awal bulan)
-- -----------------------------------------------------------------------------
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null check (char_length(company) > 0),
  position_id text not null,
  position_en text,
  location_id text,
  location_en text,
  start_date date not null,
  end_date date,                      -- null = masih berjalan
  highlights_id text[] not null default '{}',
  highlights_en text[],
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

-- -----------------------------------------------------------------------------
-- educations
-- -----------------------------------------------------------------------------
create table public.educations (
  id uuid primary key default gen_random_uuid(),
  institution text not null check (char_length(institution) > 0),
  program_id text not null,
  program_en text,
  start_date date not null,
  end_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

-- -----------------------------------------------------------------------------
-- certifications
-- -----------------------------------------------------------------------------
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) > 0),
  issuer text,
  issued_at date,
  credential_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Trigger updated_at untuk semua tabel yang bisa diedit
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profile', 'categories', 'projects', 'posts', 'services', 'testimonials',
    'skills', 'experiences', 'educations', 'certifications'
  ]
  loop
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.set_updated_at()',
      t || '_set_updated_at', t
    );
  end loop;
end;
$$;
