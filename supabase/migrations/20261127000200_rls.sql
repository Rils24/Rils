-- =============================================================================
-- Fase 2 — Hak akses dan Row Level Security
--
-- Catatan keamanan: PRD menyebut "admin = role authenticated". Karena publishable
-- key bersifat publik dan Supabase Auth secara default mengizinkan pendaftaran,
-- siapa pun bisa membuat akun dan menjadi `authenticated`. Maka hak tulis
-- dibatasi lagi ke user yang terdaftar di tabel `admin_users` (lihat is_admin()).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Daftar admin. Diisi manual lewat SQL Editor setelah akun admin dibuat:
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = '<email-admin>';
-- -----------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Grant tabel: mulai dari nol (termasuk mencabut TRUNCATE yang melewati RLS),
-- lalu beri hanya yang dibutuhkan. RLS di bawah membatasi baris mana yang boleh.
-- -----------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;

grant select on
  public.profile, public.categories, public.projects, public.posts,
  public.services, public.testimonials, public.skills, public.experiences,
  public.educations, public.certifications
to anon, authenticated;

grant insert, update, delete on
  public.profile, public.categories, public.projects, public.posts,
  public.services, public.testimonials, public.skills, public.experiences,
  public.educations, public.certifications
to authenticated;

grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;

grant select on public.admin_users to authenticated;

-- -----------------------------------------------------------------------------
-- RLS aktif di semua tabel
-- -----------------------------------------------------------------------------
alter table public.profile        enable row level security;
alter table public.categories     enable row level security;
alter table public.projects       enable row level security;
alter table public.posts          enable row level security;
alter table public.services       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.messages       enable row level security;
alter table public.skills         enable row level security;
alter table public.experiences    enable row level security;
alter table public.educations     enable row level security;
alter table public.certifications enable row level security;
alter table public.admin_users    enable row level security;

-- -----------------------------------------------------------------------------
-- Tabel konten biasa: semua orang boleh baca, hanya admin yang boleh menulis.
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profile', 'categories', 'services', 'testimonials',
    'skills', 'experiences', 'educations', 'certifications'
  ]
  loop
    execute format(
      'create policy "Public can read" on public.%I
         for select to anon, authenticated using (true)', t);
    execute format(
      'create policy "Admin can insert" on public.%I
         for insert to authenticated with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admin can update" on public.%I
         for update to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admin can delete" on public.%I
         for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- projects dan posts: pengunjung hanya melihat yang published; admin melihat semua.
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['projects', 'posts']
  loop
    execute format(
      'create policy "Read published, admin reads all" on public.%I
         for select to anon, authenticated
         using (published or (select public.is_admin()))', t);
    execute format(
      'create policy "Admin can insert" on public.%I
         for insert to authenticated with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admin can update" on public.%I
         for update to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admin can delete" on public.%I
         for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- messages: pengunjung hanya boleh mengirim (tidak bisa membaca); admin kelola.
-- -----------------------------------------------------------------------------
create policy "Anyone can send a message" on public.messages
  for insert to anon, authenticated
  with check (is_read = false);

create policy "Admin can read messages" on public.messages
  for select to authenticated using ((select public.is_admin()));

create policy "Admin can update messages" on public.messages
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admin can delete messages" on public.messages
  for delete to authenticated using ((select public.is_admin()));

-- -----------------------------------------------------------------------------
-- admin_users: user hanya bisa melihat barisnya sendiri (untuk cek status admin).
-- Tidak ada policy insert/update/delete: diubah hanya lewat SQL Editor.
-- -----------------------------------------------------------------------------
create policy "User can see own admin row" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));
