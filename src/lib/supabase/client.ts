import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { assertSupabaseEnv, supabasePublishableKey, supabaseUrl } from "./env";

/** Klien Supabase untuk Client Components (mis. panel admin). */
export function createClient() {
  assertSupabaseEnv();
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
