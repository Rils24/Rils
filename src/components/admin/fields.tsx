"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Markdown } from "@/components/markdown";
import { slugify, type Field } from "@/lib/admin/entities";
import { ImageInput, ImagesInput, PdfInput } from "./upload";

export const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm transition-colors placeholder:text-muted hover:border-foreground/30 aria-[invalid=true]:border-accent";

type Props = {
  field: Field;
  name: string; // nama kolom (untuk bilingual: title_id / title_en)
  required: boolean;
  langBadge?: "ID" | "EN";
  folder: string;
  options?: { value: string; label: string }[];
  /** Slug: jangan menimpa otomatis (mode edit). */
  slugLocked?: boolean;
};

/** Label, bantuan, dan pesan error di sekitar satu input. */
function Shell({
  field,
  name,
  required,
  langBadge,
  children,
}: Omit<Props, "folder"> & { children: React.ReactNode }) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const labelFor = field.type === "checkbox" ? undefined : name;

  return (
    <div className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
      {field.type !== "checkbox" && (
        <label
          htmlFor={labelFor}
          className="mb-1.5 flex items-center gap-2 text-sm font-medium"
        >
          {field.label}
          {required && (
            <span className="text-accent-text" aria-hidden="true">
              *
            </span>
          )}
          {langBadge && (
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-muted">
              {langBadge}
            </span>
          )}
        </label>
      )}
      {children}
      {field.help && !error && (
        <p id={`${name}-help`} className="mt-1.5 text-xs text-muted">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-accent-text">
          {error}
        </p>
      )}
    </div>
  );
}

function a11y(name: string, invalid: boolean, help?: string) {
  return {
    id: name,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid
      ? `${name}-error`
      : help
        ? `${name}-help`
        : undefined,
  };
}

/** Input teks yang menyimpan array (tags: dipisah koma, lines: per baris). */
function ListText({
  name,
  separator,
  rows,
  invalid,
  help,
}: {
  name: string;
  separator: "," | "\n";
  rows?: number;
  invalid: boolean;
  help?: string;
}) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ListTextInner
          value={(field.value as string[]) ?? []}
          onChange={field.onChange}
          onBlur={field.onBlur}
          separator={separator}
          rows={rows}
          {...a11y(name, invalid, help)}
        />
      )}
    />
  );
}

function ListTextInner({
  value,
  onChange,
  onBlur,
  separator,
  rows,
  ...rest
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onBlur: () => void;
  separator: "," | "\n";
  rows?: number;
  id: string;
}) {
  // Teks mentah disimpan lokal supaya koma/baris kosong saat mengetik tidak hilang.
  const [text, setText] = useState(() =>
    value.join(separator === "," ? ", " : "\n"),
  );
  const update = (next: string) => {
    setText(next);
    onChange(next.split(separator));
  };
  return separator === "," ? (
    <input
      type="text"
      className={inputClass}
      value={text}
      onChange={(e) => update(e.target.value)}
      onBlur={onBlur}
      {...rest}
    />
  ) : (
    <textarea
      className={`${inputClass} resize-y`}
      rows={rows ?? 4}
      value={text}
      onChange={(e) => update(e.target.value)}
      onBlur={onBlur}
      {...rest}
    />
  );
}

function MarkdownInput({
  name,
  rows,
  invalid,
  help,
}: {
  name: string;
  rows?: number;
  invalid: boolean;
  help?: string;
}) {
  const { register, control } = useFormContext();
  const value = (useWatch({ control, name }) as string) ?? "";
  const [preview, setPreview] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div
        role="tablist"
        aria-label="Mode editor"
        className="flex border-b border-border bg-surface-2 text-sm"
      >
        {[
          { key: false, label: "Tulis" },
          { key: true, label: "Pratinjau" },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={preview === tab.key}
            onClick={() => setPreview(tab.key)}
            className="px-4 py-2 font-medium text-muted aria-selected:bg-background aria-selected:text-foreground"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <textarea
        rows={rows ?? 16}
        hidden={preview}
        className="block w-full resize-y bg-background px-4 py-3 font-mono text-sm outline-offset-[-2px]"
        {...a11y(name, invalid, help)}
        {...register(name)}
      />
      {preview && (
        <div className="min-h-64 bg-background px-6 py-5">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-muted">Belum ada isi.</p>
          )}
        </div>
      )}
    </div>
  );
}

function SlugInput({
  name,
  source,
  locked,
  invalid,
  help,
}: {
  name: string;
  source: string;
  locked: boolean;
  invalid: boolean;
  help?: string;
}) {
  const { register, setValue, control } = useFormContext();
  const sourceValue = (useWatch({ control, name: source }) as string) ?? "";
  const [touched, setTouched] = useState(locked);

  // Slug mengikuti judul sampai admin mengubahnya sendiri.
  useEffect(() => {
    if (!touched)
      setValue(name, slugify(sourceValue), { shouldValidate: false });
  }, [sourceValue, touched, name, setValue]);

  const reg = register(name);
  return (
    <input
      type="text"
      className={`${inputClass} font-mono`}
      {...a11y(name, invalid, help)}
      {...reg}
      onChange={(e) => {
        setTouched(true);
        return reg.onChange(e);
      }}
    />
  );
}

export function FieldInput(props: Props) {
  const { field, name, folder, options, slugLocked } = props;
  const { register, control, formState } = useFormContext();
  const invalid = Boolean(formState.errors[name]);
  const common = a11y(name, invalid, field.help);

  let input: React.ReactNode;
  switch (field.type) {
    case "text":
    case "url":
    case "email":
      input = (
        <input
          type={field.type === "text" ? "text" : field.type}
          inputMode={field.type === "url" ? "url" : undefined}
          placeholder={field.type === "url" ? "https://" : undefined}
          className={inputClass}
          {...common}
          {...register(name)}
        />
      );
      break;
    case "textarea":
      input = (
        <textarea
          rows={field.rows ?? 4}
          className={`${inputClass} resize-y`}
          {...common}
          {...register(name)}
        />
      );
      break;
    case "markdown":
      input = (
        <MarkdownInput
          name={name}
          rows={field.rows}
          invalid={invalid}
          help={field.help}
        />
      );
      break;
    case "slug":
      input = (
        <SlugInput
          name={name}
          source={field.slugFrom ?? "title_id"}
          locked={Boolean(slugLocked)}
          invalid={invalid}
          help={field.help}
        />
      );
      break;
    case "number":
      input = (
        <input
          type="number"
          min={0}
          step={1}
          className={`${inputClass} max-w-40`}
          {...common}
          {...register(name)}
        />
      );
      break;
    case "month":
      input = (
        <input
          type="month"
          className={`${inputClass} max-w-56`}
          {...common}
          {...register(name)}
        />
      );
      break;
    case "date":
      input = (
        <input
          type="date"
          className={`${inputClass} max-w-56`}
          {...common}
          {...register(name)}
        />
      );
      break;
    case "checkbox":
      input = (
        <label
          htmlFor={name}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background px-3.5 py-3 text-sm"
        >
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-[var(--accent-solid)]"
            {...common}
            {...register(name)}
          />
          <span className="font-medium">{field.label}</span>
        </label>
      );
      break;
    case "select":
    case "category": {
      const list =
        field.type === "category" ? (options ?? []) : (field.options ?? []);
      input = (
        <select className={inputClass} {...common} {...register(name)}>
          <option value="">— Pilih —</option>
          {list.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    }
    case "tags":
      input = (
        <ListText
          name={name}
          separator=","
          invalid={invalid}
          help={field.help}
        />
      );
      break;
    case "lines":
      input = (
        <ListText
          name={name}
          separator={"\n"}
          rows={field.rows}
          invalid={invalid}
          help={field.help}
        />
      );
      break;
    case "image":
    case "pdf":
      input = (
        <Controller
          control={control}
          name={name}
          render={({ field: f }) =>
            field.type === "image" ? (
              <ImageInput
                value={(f.value as string) ?? ""}
                onChange={f.onChange}
                folder={folder}
              />
            ) : (
              <PdfInput
                value={(f.value as string) ?? ""}
                onChange={f.onChange}
                folder={folder}
              />
            )
          }
        />
      );
      break;
    case "images":
      input = (
        <Controller
          control={control}
          name={name}
          render={({ field: f }) => (
            <ImagesInput
              value={(f.value as string[]) ?? []}
              onChange={f.onChange}
              folder={folder}
            />
          )}
        />
      );
      break;
  }

  return <Shell {...props}>{input}</Shell>;
}
