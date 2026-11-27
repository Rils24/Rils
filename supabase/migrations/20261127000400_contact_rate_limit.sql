-- =============================================================================
-- Fase 3 — Form kontak dengan rate limit di database
-- Pengunjung tidak lagi INSERT langsung ke `messages`; semua pesan lewat fungsi
-- submit_message() yang membatasi jumlah kiriman. Dengan begitu rate limit
-- tidak bisa dilewati dengan memanggil REST API secara langsung.
-- =============================================================================

alter table public.messages add column ip_hash text;

create index messages_rate_limit_idx on public.messages (ip_hash, created_at desc);

drop policy "Anyone can send a message" on public.messages;
revoke insert on public.messages from anon, authenticated;

create or replace function public.submit_message(
  p_name text,
  p_email text,
  p_message text,
  p_ip_hash text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  per_sender integer;
  global_recent integer;
begin
  -- Maks. 3 pesan per pengirim (hash IP) dalam 10 menit.
  if p_ip_hash is not null then
    select count(*) into per_sender
    from public.messages
    where ip_hash = p_ip_hash
      and created_at > now() - interval '10 minutes';

    if per_sender >= 3 then
      raise exception 'rate_limited';
    end if;
  end if;

  -- Pengaman global: maks. 30 pesan per jam dari semua pengirim.
  select count(*) into global_recent
  from public.messages
  where created_at > now() - interval '1 hour';

  if global_recent >= 30 then
    raise exception 'rate_limited';
  end if;

  -- Panjang dan format dijaga oleh CHECK constraint tabel.
  insert into public.messages (name, email, message, ip_hash)
  values (btrim(p_name), btrim(p_email), btrim(p_message), p_ip_hash);
end;
$$;

revoke all on function public.submit_message(text, text, text, text) from public;
grant execute on function public.submit_message(text, text, text, text) to anon, authenticated;
