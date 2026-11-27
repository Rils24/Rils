import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Fase 1: hanya routing bahasa. Pengecekan login /admin ditambahkan di Fase 5.
export default createMiddleware(routing);

export const config = {
  // Lewati /admin, /api, /auth, file internal Next.js, Vercel, dan file statis (yang punya titik).
  matcher: "/((?!(?:admin|api|auth)(?:/|$)|_next|_vercel|.*\\..*).*)",
};
