// Variabel publik: dibaca lewat process.env.NEXT_PUBLIC_* secara literal supaya
// Next.js bisa menyisipkannya ke bundle browser.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export function assertSupabaseEnv() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diisi. Salin .env.local.example ke .env.local.",
    );
  }
}
