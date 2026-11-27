import { notFound } from "next/navigation";

// Menangkap URL tak dikenal di bawah /id atau /en agar halaman 404 kustom
// (beserta navbar dan footer) yang tampil.
export default function CatchAll() {
  notFound();
}
