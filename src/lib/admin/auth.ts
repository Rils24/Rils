import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Data Access Layer: pastikan yang memanggil adalah admin (login + terdaftar
 * di tabel admin_users). Dipanggil di setiap halaman dan server action admin.
 * RLS di database tetap menjadi pengaman terakhir.
 */
export const requireAdmin = cache(async () => {
  // Halaman admin selalu dirender per request. Tanpa ini Next mencoba
  // prerender dengan cookie, lalu Supabase membaca jam (cek kedaluwarsa
  // token) dan memicu error "Date.now() while prerendering".
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/admin/login");

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) redirect("/admin/login?error=forbidden");

  return {
    supabase,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
  };
});
