import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin/auth";
import { ENTITIES, type EntityKey } from "@/lib/admin/entities";

/*
 * Bacaan data untuk panel admin. Selalu lewat sesi admin (RLS mengizinkan
 * melihat draf). Tidak di-cache: admin harus selalu melihat data terbaru.
 */

type Row = Record<string, unknown> & { id: string };

function untyped(client: unknown) {
  return client as SupabaseClient;
}

export async function listRecords(key: EntityKey): Promise<Row[]> {
  const { supabase } = await requireAdmin();
  const entity = ENTITIES[key];
  const columns = ["id", ...entity.columns.map((c) => c.name)].join(", ");
  let query = untyped(supabase).from(key).select(columns);
  for (const { column, ascending } of entity.order) {
    query = query.order(column, { ascending });
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Row[];
}

export async function getRecord(
  key: EntityKey,
  id: string,
): Promise<Row | null> {
  const { supabase } = await requireAdmin();
  // id bukan UUID → anggap tidak ada (hindari error dari Postgres).
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await untyped(supabase)
    .from(key)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Row | null;
}

export async function getProfileRow() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCategoryOptions() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_id")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data.map((c) => ({ value: c.id, label: c.name_id }));
}

export async function getMessages() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data;
}

export async function getDashboard() {
  const { supabase } = await requireAdmin();
  const count = (table: "projects" | "posts") =>
    supabase.from(table).select("id", { count: "exact", head: true });
  const [projects, posts, unread, latest] = await Promise.all([
    count("projects"),
    count("posts"),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("messages")
      .select("id, name, email, message, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  return {
    projects: projects.count ?? 0,
    posts: posts.count ?? 0,
    unread: unread.count ?? 0,
    latest: latest.data ?? [],
  };
}

export async function getUnreadCount() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  return count ?? 0;
}
