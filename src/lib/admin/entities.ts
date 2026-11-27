import { z } from "zod";

/*
 * Registry konten yang bisa dikelola di panel admin. Dari satu definisi ini
 * dibangun: form (browser), skema Zod (dipakai di browser DAN server),
 * kolom tabel daftar, dan tag cache yang direvalidasi setelah menyimpan.
 *
 * Field `bilingual` menjadi dua kolom database: `<name>_id` (wajib bila
 * `required`) dan `<name>_en` (selalu opsional, fallback ke versi Indonesia).
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "slug"
  | "number"
  | "checkbox"
  | "select"
  | "category"
  | "tags"
  | "lines"
  | "image"
  | "images"
  | "pdf"
  | "month"
  | "date"
  | "url"
  | "email";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  bilingual?: boolean;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /** Untuk type "slug": field sumber (mis. "title_id"). */
  slugFrom?: string;
  rows?: number;
  /** Lebar di grid form: penuh (default) atau setengah. */
  half?: boolean;
  /** Nilai awal untuk data baru. */
  defaultValue?: unknown;
};

export type Column = {
  name: string;
  label: string;
  type?: "text" | "bool" | "date" | "month";
};

export type EntityKey =
  | "projects"
  | "categories"
  | "posts"
  | "services"
  | "testimonials"
  | "skills"
  | "experiences"
  | "educations"
  | "certifications"
  | "profile";

export type EntityConfig = {
  key: EntityKey;
  label: string; // nama menu (jamak)
  singular: string; // untuk judul "Tambah …"
  fields: Field[];
  columns: Column[];
  order: { column: string; ascending: boolean }[];
  /** Tag cache halaman publik yang harus diperbarui setelah simpan/hapus. */
  tags: string[];
  /** Kolom yang dipakai sebagai judul baris (konfirmasi hapus, dsb.). */
  titleColumn: string;
};

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const SERVICE_ICONS = [
  { value: "code", label: "Kode" },
  { value: "database", label: "Database" },
  { value: "clipboard", label: "Clipboard / analisis" },
  { value: "layers", label: "Lapisan (default)" },
];

const SKILL_GROUPS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Database" },
  { value: "other", label: "Lainnya" },
];

const sortOrder: Field = {
  name: "sort_order",
  label: "Urutan tampil",
  type: "number",
  help: "Angka kecil tampil lebih dulu.",
  half: true,
};

export const ENTITIES: Record<EntityKey, EntityConfig> = {
  projects: {
    key: "projects",
    label: "Proyek",
    singular: "proyek",
    titleColumn: "title_id",
    tags: ["projects"],
    order: [
      { column: "sort_order", ascending: true },
      { column: "created_at", ascending: false },
    ],
    columns: [
      { name: "title_id", label: "Judul" },
      { name: "published", label: "Tampil", type: "bool" },
      { name: "featured", label: "Unggulan", type: "bool" },
      { name: "sort_order", label: "Urutan" },
    ],
    fields: [
      {
        name: "title",
        label: "Judul",
        type: "text",
        bilingual: true,
        required: true,
      },
      {
        name: "slug",
        label: "Slug (alamat URL)",
        type: "slug",
        slugFrom: "title_id",
        required: true,
        help: "Dibuat otomatis dari judul; boleh diubah. Contoh: /projects/sistem-absensi",
      },
      {
        name: "summary",
        label: "Ringkasan",
        type: "textarea",
        bilingual: true,
        required: true,
        rows: 3,
      },
      {
        name: "problem",
        label: "Masalah",
        type: "textarea",
        bilingual: true,
        rows: 5,
      },
      {
        name: "solution",
        label: "Solusi",
        type: "textarea",
        bilingual: true,
        rows: 5,
      },
      { name: "role", label: "Peran", type: "text", bilingual: true },
      { name: "category_id", label: "Kategori", type: "category", half: true },
      {
        name: "tech_stack",
        label: "Tech stack",
        type: "tags",
        half: true,
        help: "Pisahkan dengan koma. Contoh: Laravel, Filament, MySQL",
      },
      { name: "thumbnail_url", label: "Thumbnail", type: "image" },
      { name: "gallery", label: "Galeri", type: "images" },
      { name: "demo_url", label: "Link demo", type: "url", half: true },
      { name: "github_url", label: "Link GitHub", type: "url", half: true },
      {
        name: "published",
        label: "Tampilkan di website",
        type: "checkbox",
        half: true,
        defaultValue: true,
      },
      {
        name: "featured",
        label: "Proyek unggulan (tampil di Home)",
        type: "checkbox",
        half: true,
      },
      sortOrder,
    ],
  },

  categories: {
    key: "categories",
    label: "Kategori",
    singular: "kategori",
    titleColumn: "name_id",
    tags: ["categories", "projects"],
    order: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "name_id", label: "Nama" },
      { name: "slug", label: "Slug" },
      { name: "sort_order", label: "Urutan" },
    ],
    fields: [
      {
        name: "name",
        label: "Nama",
        type: "text",
        bilingual: true,
        required: true,
      },
      {
        name: "slug",
        label: "Slug",
        type: "slug",
        slugFrom: "name_id",
        required: true,
      },
      sortOrder,
    ],
  },

  posts: {
    key: "posts",
    label: "Blog",
    singular: "artikel",
    titleColumn: "title_id",
    tags: ["posts"],
    order: [{ column: "created_at", ascending: false }],
    columns: [
      { name: "title_id", label: "Judul" },
      { name: "published", label: "Terbit", type: "bool" },
      { name: "published_at", label: "Tanggal terbit", type: "date" },
    ],
    fields: [
      {
        name: "title",
        label: "Judul",
        type: "text",
        bilingual: true,
        required: true,
      },
      {
        name: "slug",
        label: "Slug (alamat URL)",
        type: "slug",
        slugFrom: "title_id",
        required: true,
        help: "Dibuat otomatis dari judul; boleh diubah.",
      },
      {
        name: "excerpt",
        label: "Kutipan singkat",
        type: "textarea",
        bilingual: true,
        rows: 2,
      },
      {
        name: "content",
        label: "Isi artikel (Markdown)",
        type: "markdown",
        bilingual: true,
        required: true,
        rows: 18,
      },
      { name: "cover_url", label: "Gambar sampul", type: "image" },
      {
        name: "published",
        label: "Publikasikan",
        type: "checkbox",
        help: "Biarkan kosong untuk menyimpan sebagai draf. Tanggal terbit diisi otomatis saat pertama dipublikasikan.",
      },
    ],
  },

  services: {
    key: "services",
    label: "Layanan",
    singular: "layanan",
    titleColumn: "title_id",
    tags: ["services"],
    order: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "title_id", label: "Judul" },
      { name: "sort_order", label: "Urutan" },
    ],
    fields: [
      {
        name: "title",
        label: "Judul",
        type: "text",
        bilingual: true,
        required: true,
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "textarea",
        bilingual: true,
        required: true,
        rows: 3,
      },
      {
        name: "icon",
        label: "Ikon",
        type: "select",
        options: SERVICE_ICONS,
        half: true,
      },
      sortOrder,
    ],
  },

  testimonials: {
    key: "testimonials",
    label: "Testimoni",
    singular: "testimoni",
    titleColumn: "name",
    tags: ["testimonials"],
    order: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "name", label: "Nama" },
      { name: "role", label: "Jabatan" },
      { name: "sort_order", label: "Urutan" },
    ],
    fields: [
      { name: "name", label: "Nama", type: "text", required: true, half: true },
      { name: "role", label: "Jabatan, perusahaan", type: "text", half: true },
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        bilingual: true,
        required: true,
        rows: 4,
      },
      { name: "photo_url", label: "Foto", type: "image" },
      sortOrder,
    ],
  },

  skills: {
    key: "skills",
    label: "Skill",
    singular: "skill",
    titleColumn: "name_id",
    tags: ["skills"],
    order: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "name_id", label: "Nama" },
      { name: "group_name", label: "Grup" },
      { name: "sort_order", label: "Urutan" },
    ],
    fields: [
      {
        name: "name",
        label: "Nama",
        type: "text",
        bilingual: true,
        required: true,
      },
      {
        name: "group_name",
        label: "Grup",
        type: "select",
        options: SKILL_GROUPS,
        required: true,
        half: true,
      },
      sortOrder,
    ],
  },

  experiences: {
    key: "experiences",
    label: "Pengalaman",
    singular: "pengalaman",
    titleColumn: "company",
    tags: ["experiences"],
    order: [
      { column: "sort_order", ascending: true },
      { column: "start_date", ascending: false },
    ],
    columns: [
      { name: "company", label: "Perusahaan" },
      { name: "position_id", label: "Posisi" },
      { name: "start_date", label: "Mulai", type: "month" },
    ],
    fields: [
      {
        name: "company",
        label: "Perusahaan / instansi",
        type: "text",
        required: true,
      },
      {
        name: "position",
        label: "Posisi",
        type: "text",
        bilingual: true,
        required: true,
      },
      { name: "location", label: "Lokasi", type: "text", bilingual: true },
      {
        name: "start_date",
        label: "Mulai",
        type: "month",
        required: true,
        half: true,
      },
      {
        name: "end_date",
        label: "Selesai",
        type: "month",
        half: true,
        help: "Kosongkan bila masih berjalan.",
      },
      {
        name: "highlights",
        label: "Poin pencapaian",
        type: "lines",
        bilingual: true,
        rows: 6,
        help: "Satu poin per baris.",
      },
      sortOrder,
    ],
  },

  educations: {
    key: "educations",
    label: "Pendidikan",
    singular: "pendidikan",
    titleColumn: "institution",
    tags: ["educations"],
    order: [
      { column: "sort_order", ascending: true },
      { column: "start_date", ascending: false },
    ],
    columns: [
      { name: "institution", label: "Institusi" },
      { name: "program_id", label: "Program" },
      { name: "start_date", label: "Mulai", type: "month" },
    ],
    fields: [
      { name: "institution", label: "Institusi", type: "text", required: true },
      {
        name: "program",
        label: "Program studi",
        type: "text",
        bilingual: true,
        required: true,
      },
      {
        name: "start_date",
        label: "Mulai",
        type: "month",
        required: true,
        half: true,
      },
      {
        name: "end_date",
        label: "Selesai",
        type: "month",
        half: true,
        help: "Kosongkan bila masih berjalan.",
      },
      sortOrder,
    ],
  },

  certifications: {
    key: "certifications",
    label: "Sertifikat",
    singular: "sertifikat",
    titleColumn: "name",
    tags: ["certifications"],
    order: [{ column: "sort_order", ascending: true }],
    columns: [
      { name: "name", label: "Nama" },
      { name: "issuer", label: "Penerbit" },
      { name: "issued_at", label: "Tanggal", type: "date" },
    ],
    fields: [
      { name: "name", label: "Nama sertifikat", type: "text", required: true },
      { name: "issuer", label: "Penerbit", type: "text", half: true },
      { name: "issued_at", label: "Tanggal terbit", type: "date", half: true },
      { name: "credential_url", label: "Link sertifikat", type: "url" },
      sortOrder,
    ],
  },

  profile: {
    key: "profile",
    label: "Profil",
    singular: "profil",
    titleColumn: "name",
    tags: ["profile"],
    order: [],
    columns: [],
    fields: [
      { name: "name", label: "Nama", type: "text", required: true },
      {
        name: "role_titles",
        label: "Jabatan (efek mengetik di hero)",
        type: "lines",
        bilingual: true,
        required: true,
        rows: 3,
        help: "Satu jabatan per baris.",
      },
      {
        name: "bio",
        label: "Bio singkat (hero)",
        type: "textarea",
        bilingual: true,
        required: true,
        rows: 3,
      },
      {
        name: "about",
        label: "Tentang (bagian Tentang saya)",
        type: "textarea",
        bilingual: true,
        rows: 6,
      },
      { name: "location", label: "Lokasi", type: "text", bilingual: true },
      {
        name: "hero_photo_url",
        label: "Foto hero",
        type: "image",
        help: "Disarankan PNG dengan latar transparan, rasio 4:5.",
      },
      { name: "cv_url", label: "CV (PDF)", type: "pdf" },
      { name: "email", label: "Email", type: "email", half: true },
      { name: "linkedin_url", label: "LinkedIn", type: "url", half: true },
      { name: "github_url", label: "GitHub", type: "url", half: true },
      { name: "instagram_url", label: "Instagram", type: "url", half: true },
    ],
  },
};

export const LIST_ENTITIES = Object.values(ENTITIES).filter(
  (e) => e.key !== "profile",
);

export function isEntityKey(value: string): value is EntityKey {
  return value in ENTITIES && value !== "profile";
}

/** Nama kolom database untuk sebuah field (bilingual → _id dan _en). */
export function columnsOf(field: Field) {
  return field.bilingual
    ? [`${field.name}_id`, `${field.name}_en`]
    : [field.name];
}

/* -------------------------------------------------------------------------- */
/* Skema Zod                                                                  */
/* -------------------------------------------------------------------------- */

const REQUIRED = "Wajib diisi.";

/** Teks opsional: "" atau spasi → null. Menerima null (dari server/DB). */
const optionalText = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((v) => (v ? v : null));

const stringList = z
  .array(z.string())
  .nullable()
  .optional()
  .transform((list) => (list ?? []).map((s) => s.trim()).filter(Boolean));

function urlSchema(required: boolean) {
  const base = optionalText.refine(
    (v) => v === null || /^https?:\/\/\S+$/i.test(v),
    "Harus berupa URL lengkap, diawali https://",
  );
  return required ? base.refine((v) => v !== null, REQUIRED) : base;
}

function fieldSchema(field: Field, required: boolean): z.ZodType {
  switch (field.type) {
    case "text":
    case "textarea":
    case "markdown":
      return required ? z.string().trim().min(1, REQUIRED) : optionalText;
    case "slug":
      return z
        .string()
        .trim()
        .min(1, REQUIRED)
        .regex(SLUG_PATTERN, "Hanya huruf kecil, angka, dan tanda hubung.");
    case "number":
      return z.coerce
        .number({ error: "Harus berupa angka." })
        .int("Harus bilangan bulat.")
        .min(0, "Minimal 0.");
    case "checkbox":
      return z.boolean();
    case "select":
    case "category":
      return required ? z.string().min(1, REQUIRED) : optionalText;
    case "tags":
    case "images":
      return stringList;
    case "lines":
      return required
        ? stringList.refine((l) => l.length > 0, REQUIRED)
        : stringList;
    case "image":
    case "pdf":
    case "url":
      return urlSchema(required);
    case "email":
      return optionalText.refine(
        (v) => v === null || z.email().safeParse(v).success,
        "Format email belum benar.",
      );
    case "month":
      // <input type="month"> → "2025-09"; disimpan sebagai tanggal awal bulan.
      return optionalText
        .refine(
          (v) => v === null || /^\d{4}-\d{2}(-\d{2})?$/.test(v),
          "Format bulan tidak valid.",
        )
        .transform((v) => (v ? `${v.slice(0, 7)}-01` : null))
        .refine((v) => !required || v !== null, REQUIRED);
    case "date":
      return optionalText.refine(
        (v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v),
        "Format tanggal tidak valid.",
      );
  }
}

const schemaCache = new Map<EntityKey, z.ZodType<Record<string, unknown>>>();

export function entitySchema(key: EntityKey) {
  const cached = schemaCache.get(key);
  if (cached) return cached;

  const shape: Record<string, z.ZodType> = {};
  for (const field of ENTITIES[key].fields) {
    if (field.bilingual) {
      shape[`${field.name}_id`] = fieldSchema(field, Boolean(field.required));
      shape[`${field.name}_en`] = fieldSchema(field, false);
    } else {
      shape[field.name] = fieldSchema(field, Boolean(field.required));
    }
  }
  let schema: z.ZodType<Record<string, unknown>> = z.object(shape);

  // Tanggal selesai tidak boleh sebelum tanggal mulai.
  if (key === "experiences" || key === "educations") {
    schema = (schema as z.ZodObject).refine(
      (v) =>
        !v.end_date ||
        !v.start_date ||
        String(v.end_date) >= String(v.start_date),
      {
        message: "Tanggal selesai harus setelah tanggal mulai.",
        path: ["end_date"],
      },
    ) as unknown as z.ZodType<Record<string, unknown>>;
  }

  schemaCache.set(key, schema);
  return schema;
}

/* -------------------------------------------------------------------------- */
/* Nilai form                                                                 */
/* -------------------------------------------------------------------------- */

function emptyValue(field: Field) {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case "checkbox":
      return false;
    case "number":
      return 0;
    case "tags":
    case "images":
    case "lines":
      return [];
    default:
      return "";
  }
}

/** Baris database → nilai awal form (null → "", tanggal bulan → "YYYY-MM"). */
export function toFormValues(
  key: EntityKey,
  row: Record<string, unknown> | null,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of ENTITIES[key].fields) {
    for (const column of columnsOf(field)) {
      const raw = row?.[column];
      if (raw === null || raw === undefined) {
        values[column] = emptyValue(field);
      } else if (field.type === "month" && typeof raw === "string") {
        values[column] = raw.slice(0, 7);
      } else {
        values[column] = raw;
      }
    }
  }
  return values;
}

/** Judul → slug: "Sistem Absensi Ponpes" → "sistem-absensi-ponpes". */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
