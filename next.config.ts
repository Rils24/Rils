import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Sengaja false: dengan true, proyek/artikel yang dibuat lewat admin (slug
  // yang tidak ada saat build) pertama kali disajikan sebagai "App Shell"
  // tanpa isi, dan <title>/metadata-nya tidak pernah terisi (teruji 27 Nov
  // 2026, Next 16.4.6). Dengan false, request pertama menunggu render lengkap
  // sehingga isi + metadata langsung benar (penting untuk SEO).
  partialPrefetching: false,
  images: {
    // Gambar dari Supabase Storage (bucket publik `images`).
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
