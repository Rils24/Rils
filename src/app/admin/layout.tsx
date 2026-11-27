import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

/** Root layout panel admin (terpisah dari situs publik, tanpa awalan bahasa). */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Semua halaman admin membaca sesi (cookie), jadi dirender per request. */}
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
