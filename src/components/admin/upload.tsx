"use client";

import { FileText, ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_PDF = 10 * 1024 * 1024;

type Kind = "image" | "pdf";

/** Unggah file ke Supabase Storage dan kembalikan URL publiknya. */
async function uploadFile(file: File, kind: Kind, folder: string) {
  if (kind === "image") {
    if (!IMAGE_TYPES.includes(file.type))
      throw new Error("Format gambar harus JPG, PNG, WebP, AVIF, atau GIF.");
    if (file.size > MAX_IMAGE) throw new Error("Ukuran gambar maksimal 5 MB.");
  } else {
    if (file.type !== "application/pdf")
      throw new Error("File harus berupa PDF.");
    if (file.size > MAX_PDF) throw new Error("Ukuran PDF maksimal 10 MB.");
  }

  const bucket = kind === "image" ? "images" : "files";
  const ext =
    file.name.split(".").pop()?.toLowerCase() ||
    (kind === "pdf" ? "pdf" : "jpg");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Upload gagal: ${error.message}`);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function useUploader(kind: Kind, folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(files: File[]) {
    setBusy(true);
    setError(null);
    try {
      return await Promise.all(files.map((f) => uploadFile(f, kind, folder)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
      return [];
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, run };
}

const pickerClass =
  "inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium transition-colors hover:border-foreground/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent";

function Picker({
  label,
  accept,
  multiple,
  busy,
  onFiles,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  busy: boolean;
  onFiles: (files: File[]) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className={pickerClass} aria-disabled={busy}>
      {busy ? (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <ImagePlus aria-hidden="true" className="size-4" />
      )}
      {busy ? "Mengunggah…" : label}
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={busy}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </label>
  );
}

function Thumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative aspect-[4/3] w-40 overflow-hidden rounded-xl border border-border bg-surface-2">
      <Image
        src={src}
        alt=""
        fill
        sizes="160px"
        className="object-cover"
        unoptimized
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Hapus gambar"
        className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-lg bg-black/70 text-white hover:bg-black"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

export function ImageInput({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const { busy, error, run } = useUploader("image", folder);
  return (
    <div className="flex flex-col gap-3">
      {value && <Thumb src={value} onRemove={() => onChange("")} />}
      <Picker
        label={value ? "Ganti gambar" : "Unggah gambar"}
        accept={IMAGE_TYPES.join(",")}
        busy={busy}
        onFiles={async (files) => {
          const [url] = await run(files.slice(0, 1));
          if (url) onChange(url);
        }}
      />
      {error && <p className="text-sm text-accent-text">{error}</p>}
    </div>
  );
}

export function ImagesInput({
  value,
  onChange,
  folder,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}) {
  const { busy, error, run } = useUploader("image", folder);
  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((src, i) => (
            <Thumb
              key={src}
              src={src}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
            />
          ))}
        </div>
      )}
      <Picker
        label="Tambah gambar"
        accept={IMAGE_TYPES.join(",")}
        multiple
        busy={busy}
        onFiles={async (files) => {
          const urls = await run(files);
          if (urls.length) onChange([...value, ...urls]);
        }}
      />
      {error && <p className="text-sm text-accent-text">{error}</p>}
    </div>
  );
}

export function PdfInput({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const { busy, error, run } = useUploader("pdf", folder);
  return (
    <div className="flex flex-col gap-3">
      {value && (
        <div className="flex items-center gap-3">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            <FileText aria-hidden="true" className="size-4 text-muted" />
            Lihat file saat ini
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-muted hover:text-accent-text"
          >
            Hapus
          </button>
        </div>
      )}
      <Picker
        label={value ? "Ganti PDF" : "Unggah PDF"}
        accept="application/pdf"
        busy={busy}
        onFiles={async (files) => {
          const [url] = await run(files.slice(0, 1));
          if (url) onChange(url);
        }}
      />
      {error && <p className="text-sm text-accent-text">{error}</p>}
    </div>
  );
}
