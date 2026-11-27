"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/admin/actions";

/**
 * Tombol hapus + dialog konfirmasi (elemen <dialog> bawaan: fokus terkunci,
 * Esc untuk batal). Setelah berhasil, halaman dimuat ulang dari server.
 */
export function ConfirmDelete({
  itemLabel,
  action,
  compact = false,
}: {
  itemLabel: string;
  action: () => Promise<ActionResult>;
  compact?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      dialog.current?.close();
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={compact ? `Hapus ${itemLabel}` : undefined}
        className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-accent-text"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        {!compact && "Hapus"}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-0 text-foreground backdrop:bg-black/50"
      >
        <div className="p-6">
          <h2
            id={titleId}
            className="font-display text-xl font-bold tracking-tight"
          >
            Hapus data ini?
          </h2>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-foreground">{itemLabel}</span>{" "}
            akan dihapus permanen dan tidak bisa dikembalikan.
          </p>
          {error && <p className="mt-3 text-sm text-accent-text">{error}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              className="h-10 rounded-xl border border-border px-4 text-sm font-medium hover:border-foreground/40"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={pending}
              className="h-10 rounded-xl bg-accent-solid px-4 text-sm font-medium text-accent-foreground hover:bg-accent-solid-hover disabled:opacity-60"
            >
              {pending ? "Menghapus…" : "Ya, hapus"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
