-- =============================================================================
-- Fase 5 — Merapikan is_admin() (temuan Supabase advisors)
-- Pengunjung (anon) tidak perlu memanggil is_admin(): policy baca projects/posts
-- dipisah per role. is_admin() kini SECURITY INVOKER dan hanya bisa dipanggil
-- user yang login; ia membaca admin_users lewat RLS "own row".
-- =============================================================================

-- Policy baca: anon cukup melihat yang published; user login (admin) lewat is_admin().
do $$
declare
  t text;
begin
  foreach t in array array['projects', 'posts']
  loop
    execute format('drop policy "Read published, admin reads all" on public.%I', t);
    execute format(
      'create policy "Public can read published" on public.%I
         for select to anon using (published)', t);
    execute format(
      'create policy "Signed-in reads published, admin reads all" on public.%I
         for select to authenticated using (published or (select public.is_admin()))', t);
  end loop;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
