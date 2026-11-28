-- Foto dokumentasi per pengalaman kerja (URL publik dari bucket `images`).
-- Ditampilkan di bagian Pengalaman di Home; dikelola lewat panel admin.
alter table public.experiences
  add column photos text[] not null default '{}';
