import { Inter, Space_Grotesk } from "next/font/google";

// Dipakai oleh kedua root layout: situs publik ([locale]) dan panel admin.
// Inter (teks body) tidak di-preload: teks langsung tampil dengan font cadangan
// yang metriknya sudah disesuaikan next/font (tanpa layout shift), lalu
// berganti saat Inter selesai dimuat. Menghemat ~48 KB berprioritas tinggi
// sebelum LCP di HP. Space Grotesk (judul, sering jadi elemen LCP) tetap di-preload.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});
export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const fontVariables = `${inter.variable} ${spaceGrotesk.variable}`;
