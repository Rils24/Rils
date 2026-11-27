import { z } from "zod";

/*
 * Skema form kontak, dipakai di browser (React Hook Form) dan di server
 * (Server Action). Pesan error berupa kunci terjemahan di messages/*.json
 * (namespace Contact.errors).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(120, "nameMax"),
  email: z
    .string()
    .trim()
    .max(254, "emailInvalid")
    .pipe(z.email("emailInvalid")),
  message: z.string().trim().min(10, "messageMin").max(5000, "messageMax"),
  // Honeypot: field tersembunyi yang hanya diisi bot. Bila terisi, server
  // pura-pura sukses tanpa menyimpan (bot tidak tahu dirinya ditolak).
  website: z.string().max(500).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  { ok: true } | { ok: false; error: "validation" | "rate_limited" | "server" };
