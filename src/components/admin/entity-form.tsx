"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { buttonClass } from "@/components/ui/button";
import { saveRecord } from "@/lib/admin/actions";
import { ENTITIES, entitySchema, type EntityKey } from "@/lib/admin/entities";
import { FieldInput } from "./fields";

type Values = Record<string, unknown>;
type Lang = "id" | "en";

export function EntityForm({
  entityKey,
  id,
  initialValues,
  categoryOptions,
  saved = false,
}: {
  entityKey: EntityKey;
  id: string | null;
  initialValues: Values;
  categoryOptions?: { value: string; label: string }[];
  saved?: boolean;
}) {
  const entity = ENTITIES[entityKey];
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("id");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    saved ? { ok: true, text: "Tersimpan." } : null,
  );

  const form = useForm<Values>({
    // Skema dibangun dinamis dari registry, jadi tipenya generik.
    resolver: zodResolver(
      entitySchema(entityKey) as unknown as Parameters<typeof zodResolver>[0],
    ) as unknown as Resolver<Values>,
    defaultValues: initialValues,
    mode: "onBlur",
  });
  const { errors, isSubmitting, isDirty } = form.formState;
  const hasBilingual = entity.fields.some((f) => f.bilingual);
  const langHasError = (l: Lang) =>
    Object.keys(errors).some((k) => k.endsWith(`_${l}`));

  async function onSubmit(values: Values) {
    setStatus(null);
    const result = await saveRecord(entityKey, id, values);
    if (!result.ok) {
      setStatus({ ok: false, text: result.error });
      for (const [name, message] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(name, { message });
      }
      return;
    }
    if (!id) {
      // Data baru: pindah ke halaman edit agar unggahan berikutnya tersimpan ke baris yang sama.
      router.replace(`/admin/${entityKey}/${result.id}?saved=1`);
      return;
    }
    form.reset(form.getValues());
    setStatus({
      ok: true,
      text: "Tersimpan. Halaman publik sudah diperbarui.",
    });
    router.refresh();
  }

  function onInvalid(errs: typeof errors) {
    setStatus({ ok: false, text: "Periksa kembali isian yang ditandai." });
    // Pindah ke tab bahasa yang berisi error pertama.
    const first = Object.keys(errs)[0];
    if (first?.endsWith("_en")) setLang("en");
    else if (first?.endsWith("_id")) setLang("id");
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="flex flex-col gap-6"
      >
        {hasBilingual && (
          <div className="sticky top-0 z-10 -mx-1 flex items-center gap-3 bg-background/90 px-1 py-2 backdrop-blur">
            <div
              role="tablist"
              aria-label="Bahasa konten"
              className="inline-flex rounded-xl border border-border bg-surface p-1 text-sm font-medium"
            >
              {(["id", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lang === l}
                  onClick={() => setLang(l)}
                  className="relative rounded-lg px-4 py-1.5 text-muted aria-selected:bg-foreground aria-selected:text-background"
                >
                  {l === "id" ? "Indonesia" : "English"}
                  {langHasError(l) && (
                    <span
                      aria-label="ada error"
                      className="absolute -top-1 -right-1 size-2.5 rounded-full bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted">
              {lang === "en"
                ? "Versi Inggris boleh kosong; website akan menampilkan versi Indonesia."
                : "Kolom bertanda * wajib diisi."}
            </p>
          </div>
        )}

        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          {entity.fields.map((field) =>
            field.bilingual ? (
              (["id", "en"] as const).map((l) => (
                // Kedua bahasa tetap ter-render (hanya disembunyikan) agar nilainya ikut tersimpan.
                <div
                  key={`${field.name}_${l}`}
                  hidden={lang !== l}
                  className={field.half ? "sm:col-span-1" : "sm:col-span-2"}
                >
                  <FieldInput
                    field={{ ...field, half: false }}
                    name={`${field.name}_${l}`}
                    required={Boolean(field.required) && l === "id"}
                    langBadge={l === "id" ? "ID" : "EN"}
                    folder={entityKey}
                  />
                </div>
              ))
            ) : (
              <FieldInput
                key={field.name}
                field={field}
                name={field.name}
                required={Boolean(field.required)}
                folder={entityKey}
                options={categoryOptions}
                slugLocked={Boolean(id)}
              />
            ),
          )}
        </div>

        <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 border-t border-border bg-background/95 px-1 py-4 backdrop-blur">
          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonClass("primary", "md")}
          >
            {isSubmitting ? "Menyimpan…" : "Simpan"}
          </button>
          <div role="status" aria-live="polite" className="text-sm">
            {status ? (
              <p
                className={`flex items-center gap-2 ${status.ok ? "" : "text-accent-text"}`}
              >
                {status.ok && (
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 text-accent"
                  />
                )}
                {status.text}
              </p>
            ) : (
              isDirty && (
                <p className="text-muted">Ada perubahan yang belum disimpan.</p>
              )
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
