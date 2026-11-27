import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { assertSupabaseEnv, supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Klien Supabase tanpa sesi (role `anon`) untuk membaca konten publik.
 * Tidak menyentuh cookie, jadi aman dipakai di dalam "use cache" untuk
 * halaman publik yang di-cache dan direvalidasi saat admin menyimpan.
 */
export function createPublicClient() {
  assertSupabaseEnv();
  return createSupabaseClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
