"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { buttonClass } from "@/components/ui/button";
import { sendContactMessage } from "@/lib/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

type Status = "idle" | "success" | "validation" | "rate_limited" | "server";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-base transition-colors placeholder:text-muted hover:border-foreground/30 aria-[invalid=true]:border-accent";

export function ContactForm() {
  const t = useTranslations("Contact");
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  async function onSubmit(values: ContactInput) {
    setStatus("idle");
    try {
      const result = await sendContactMessage(values);
      if (result.ok) {
        reset();
        setStatus("success");
      } else {
        setStatus(result.error);
      }
    } catch {
      setStatus("server");
    }
  }

  const fieldError = (name: keyof ContactInput) => {
    const key = errors[name]?.message;
    return key ? (
      <p id={`${id}-${name}-error`} className="mt-2 text-sm text-accent-text">
        {t(`errors.${key}` as "errors.validation")}
      </p>
    ) : null;
  };

  const a11y = (name: keyof ContactInput) => ({
    id: `${id}-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <div>
        <label
          htmlFor={`${id}-name`}
          className="mb-2 block text-sm font-medium"
        >
          {t("name")}
        </label>
        <input
          type="text"
          autoComplete="name"
          className={inputClass}
          {...a11y("name")}
          {...register("name")}
        />
        {fieldError("name")}
      </div>

      <div>
        <label
          htmlFor={`${id}-email`}
          className="mb-2 block text-sm font-medium"
        >
          {t("email")}
        </label>
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          className={inputClass}
          {...a11y("email")}
          {...register("email")}
        />
        {fieldError("email")}
      </div>

      <div>
        <label
          htmlFor={`${id}-message`}
          className="mb-2 block text-sm font-medium"
        >
          {t("message")}
        </label>
        <textarea
          rows={6}
          className={`${inputClass} resize-y`}
          {...a11y("message")}
          {...register("message")}
        />
        {fieldError("message")}
      </div>

      {/* Honeypot: disembunyikan dari pengunjung dan pembaca layar, diisi bot. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${id}-website`}>{t("honeypot")}</label>
        <input
          id={`${id}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClass("primary", "lg")}
        >
          {isSubmitting ? t("sending") : t("submit")}
        </button>

        <div role="status" aria-live="polite" className="text-sm">
          {status === "success" && (
            <p className="flex items-center gap-2">
              <CheckCircle2
                aria-hidden="true"
                className="size-4 shrink-0 text-accent"
              />
              {t("success")}
            </p>
          )}
          {(status === "validation" ||
            status === "rate_limited" ||
            status === "server") && (
            <p className="text-accent-text">{t(`errors.${status}`)}</p>
          )}
        </div>
      </div>
    </form>
  );
}
