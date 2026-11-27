import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { assertSupabaseEnv, supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Klien Supabase dengan sesi login (cookie). Untuk Server Components, Server
 * Actions, dan Route Handlers yang butuh tahu siapa yang login (admin).
 * Karena membaca cookies(), jangan dipakai di dalam "use cache".
 */
export async function createClient() {
  assertSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Dipanggil dari Server Component: cookie tidak bisa ditulis di sini.
          // Sesi akan diperbarui oleh proxy (Fase 5).
        }
      },
    },
  });
}
