import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "./env";

const LOGIN_PATH = "/admin/login";

/**
 * Dipanggil proxy untuk semua route /admin:
 * 1. memperbarui token sesi Supabase di cookie bila perlu;
 * 2. pengecekan optimistis: belum login → ke /admin/login.
 * Pengecekan sebenarnya (termasuk status admin) ada di requireAdmin() dan RLS.
 */
export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Jangan menaruh kode lain di antara createServerClient dan getClaims().
  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);
  const onLogin = request.nextUrl.pathname === LOGIN_PATH;

  if (!loggedIn && !onLogin)
    return redirectWithCookies(request, response, LOGIN_PATH);
  // Sudah login → tidak perlu halaman login, kecuali dikirim ke sini karena
  // akunnya bukan admin (?error=...), agar tidak terjadi redirect loop.
  if (loggedIn && onLogin && !request.nextUrl.searchParams.has("error")) {
    return redirectWithCookies(request, response, "/admin");
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function redirectWithCookies(
  request: NextRequest,
  from: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
