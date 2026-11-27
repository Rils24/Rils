"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createPublicClient } from "@/lib/supabase/public";
import {
  contactSchema,
  type ContactInput,
  type ContactResult,
} from "@/lib/validation/contact";

function hashIp(ip: string) {
  // IP tidak disimpan mentah; cukup hash untuk menghitung rate limit.
  const salt = process.env.RATE_LIMIT_SALT ?? "portfolio-contact";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function sendContactMessage(
  input: ContactInput,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };

  const { name, email, message, website } = parsed.data;

  // Honeypot terisi: kemungkinan bot. Balas sukses tanpa menyimpan.
  if (website) return { ok: true };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;

  const { error } = await createPublicClient().rpc("submit_message", {
    p_name: name,
    p_email: email,
    p_message: message,
    p_ip_hash: ip ? hashIp(ip) : undefined,
  });

  if (error) {
    if (error.message.includes("rate_limited"))
      return { ok: false, error: "rate_limited" };
    console.error("submit_message gagal:", error.message);
    return { ok: false, error: "server" };
  }

  return { ok: true };
}
