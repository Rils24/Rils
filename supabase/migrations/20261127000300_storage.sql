-- =============================================================================
-- Fase 2 — Storage
-- images: thumbnail, galeri, cover, foto (publik dibaca)
-- files : CV dalam PDF (publik dibaca agar tombol "Unduh CV" bisa langsung dipakai)
-- Upload, ubah, dan hapus hanya untuk admin.
-- SVG sengaja tidak diizinkan karena bisa membawa skrip.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('images', 'images', true, 5242880,  -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']),
  ('files', 'files', true, 10485760,   -- 10 MB
    array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Bucket publik sudah bisa diunduh lewat URL publik tanpa policy SELECT.
-- Policy SELECT di bawah hanya untuk admin (daftar file, upsert, hapus).
create policy "Admin can list portfolio files" on storage.objects
  for select to authenticated
  using (bucket_id in ('images', 'files') and (select public.is_admin()));

create policy "Admin can upload portfolio files" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('images', 'files') and (select public.is_admin()));

create policy "Admin can update portfolio files" on storage.objects
  for update to authenticated
  using (bucket_id in ('images', 'files') and (select public.is_admin()))
  with check (bucket_id in ('images', 'files') and (select public.is_admin()));

create policy "Admin can delete portfolio files" on storage.objects
  for delete to authenticated
  using (bucket_id in ('images', 'files') and (select public.is_admin()));
