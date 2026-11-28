import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { fontVariables } from "../fonts";
import { getProfile } from "@/lib/data";
import { siteUrl } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [t, profile] = await Promise.all([
    getTranslations("Metadata"),
    getProfile(),
  ]);
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: t("title"),
      template: `%s — ${profile?.name ?? "Syahril Aprialsyah"}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("Common");

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent-solid focus:px-4 focus:py-2 focus:text-accent-foreground"
        >
          {t("skipToContent")}
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <MotionProvider>
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </MotionProvider>
            {/* Hanya aktif di Vercel; di lokal script-nya tidak ada (404). */}
            {process.env.VERCEL ? <Analytics /> : null}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
