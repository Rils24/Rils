import { ImageIcon } from "lucide-react";
import Image from "next/image";

/**
 * Gambar dari Supabase Storage, atau placeholder abu-abu bertuliskan
 * "Gambar menyusul" bila URL belum diisi lewat admin.
 * Elemen induk menentukan ukuran (mis. aspect-[16/10]) dan harus `relative`.
 */
export function CoverImage({
  src,
  alt,
  placeholder,
  sizes,
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  placeholder: string;
  sizes: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-2 text-sm text-muted">
      <ImageIcon aria-hidden="true" className="size-5" strokeWidth={1.5} />
      <span>{placeholder}</span>
    </div>
  );
}
