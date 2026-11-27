import { Inter, Space_Grotesk } from "next/font/google";

// Dipakai oleh kedua root layout: situs publik ([locale]) dan panel admin.
export const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const fontVariables = `${inter.variable} ${spaceGrotesk.variable}`;
