import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Data Access Layer: pastikan yang memanggil adalah admin (login + terdaftar
 * di tabel admin_users). Dipanggil di setiap halaman dan server action admin.
 * RLS di database tetap menjadi pengaman terakhir.
 */
export const requireAdmin = cache(async () => {
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
