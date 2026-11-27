import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { assertSupabaseEnv, supabaseUrl } from "./env";

/**
 * Klien dengan service role: melewati RLS. HANYA untuk kode server yang
 * benar-benar membutuhkannya. `server-only` membuat build gagal bila file ini
 * ikut terimpor ke kode browser.
 */
export function createAdminClient() {
  assertSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local.");
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
