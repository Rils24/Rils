"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { ENTITIES, entitySchema, type EntityKey } from "@/lib/admin/entities";
import { createClient } from "@/lib/supabase/server";

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Klien tanpa tipe tabel: nama tabel di sini datang dari registry. */
function untyped(client: unknown) {
  return client as SupabaseClient;
}

function dbError(error: { code?: string; message: string }) {
  if (error.code === "23505") return "Slug sudah dipakai. Gunakan slug lain.";
  if (error.code === "23514")
    return "Ada isian yang tidak memenuhi aturan (mis. tanggal atau panjang teks).";
  if (error.code === "42501")
    return "Akses ditolak. Pastikan akun Anda terdaftar sebagai admin.";
  return `Gagal menyimpan: ${error.message}`;
}

function refreshPublicPages(key: EntityKey) {
  for (const tag of ENTITIES[key].tags) updateTag(tag);
}

/* -------------------------------------------------------------------------- */
/* CRUD generik                                                               */
/* -------------------------------------------------------------------------- */

export async function saveRecord(
  key: EntityKey,
  id: string | null,
  values: unknown,
): Promise<SaveResult> {
  const { supabase } = await requireAdmin();
  if (!(key in ENTITIES))
    return { ok: false, error: "Jenis konten tidak dikenal." };

  // Validasi ulang di server dengan skema yang sama seperti di browser.
  const parsed = entitySchema(key).safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return { ok: false, error: "Periksa kembali isian form.", fieldErrors };
  }

  const table = untyped(supabase).from(key);
  const query = id
    ? table.update(parsed.data).eq("id", id).select("id").single()
    : table.insert(parsed.data).select("id").single();
  const { data, error } = await query;

  if (error) return { ok: false, error: dbError(error) };

  refreshPublicPages(key);
  return { ok: true, id: (data as { id: string }).id };
}

export async function deleteRecord(
  key: EntityKey,
  id: string,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!(key in ENTITIES) || key === "profile") {
    return { ok: false, error: "Jenis konten tidak dikenal." };
  }

  const { error } = await untyped(supabase).from(key).delete().eq("id", id);
  if (error) return { ok: false, error: dbError(error) };

  refreshPublicPages(key);
  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/* Pesan                                                                      */
/* -------------------------------------------------------------------------- */

export async function setMessageRead(
  id: string,
  isRead: boolean,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("messages")
    .update({ is_read: isRead })
    .eq("id", id);
  return error ? { ok: false, error: dbError(error) } : { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  return error ? { ok: false, error: dbError(error) } : { ok: true };
}

/* -------------------------------------------------------------------------- */
/* Login / logout                                                             */
/* -------------------------------------------------------------------------- */

export type LoginState = { error: string | null };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email dan password wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau password salah." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Akun ini belum terdaftar sebagai admin." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
