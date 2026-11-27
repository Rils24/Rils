import { jsonLd } from "@/lib/seo";

/** Data terstruktur schema.org untuk mesin pencari. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Isi sudah di-escape (`<` → <) oleh jsonLd().
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
