import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateAdminSession } from "./lib/supabase/proxy";

const intl = createMiddleware(routing);
const ADMIN = /^\/admin(\/|$)/;

export default async function proxy(request: NextRequest) {
  // Panel admin: tanpa awalan bahasa, dijaga sesi Supabase.
  if (ADMIN.test(request.nextUrl.pathname)) {
    return updateAdminSession(request);
  }
  // Situs publik: routing bahasa /id dan /en.
  return intl(request);
}

export const config = {
  // Lewati /api, /auth, file internal Next.js, Vercel, dan file statis (yang punya titik).
  matcher: "/((?!(?:api|auth)(?:/|$)|_next|_vercel|.*\\..*).*)",
};
