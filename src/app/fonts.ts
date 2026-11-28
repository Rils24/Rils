import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

// Dipakai oleh kedua root layout: situs publik ([locale]) dan panel admin.
// Outfit (display/heading, gaya geometric editorial bold ala ui-ux-pro-max)
// di-preload karena sering menjadi elemen LCP di hero. Plus Jakarta Sans
// (body) tidak di-preload agar tidak menahan LCP; metrik cadangan disesuaikan
// otomatis oleh next/font sehingga bebas layout shift.
export const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  preload: false,
});

export const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const fontVariables = `${plusJakartaSans.variable} ${outfit.variable}`;
