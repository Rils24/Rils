"use client";

import { Mail, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteMessage, setMessageRead } from "@/lib/admin/actions";
import { ConfirmDelete } from "./confirm-delete";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  dateLabel: string;
};

export function MessageItem({ message }: { message: MessageRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleRead(next: boolean) {
    startTransition(async () => {
      await setMessageRead(message.id, next);
      router.refresh();
    });
  }

  return (
    <article
      className={`rounded-2xl border bg-surface p-5 sm:p-6 ${message.is_read ? "border-border" : "border-accent/50"}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold">
            {!message.is_read && (
              <span
                className="size-2 rounded-full bg-accent"
                aria-label="Belum dibaca"
              />
            )}
            {message.name}
          </h2>
          <a
            href={`mailto:${message.email}?subject=${encodeURIComponent("Re: pesan dari website")}`}
            className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            {message.email}
          </a>
        </div>
        <time dateTime={message.created_at} className="text-sm text-muted">
          {message.dateLabel}
        </time>
      </header>

      <p className="mt-4 text-sm leading-relaxed whitespace-pre-line">
        {message.message}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-1 border-t border-border pt-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => toggleRead(!message.is_read)}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-60"
        >
          {message.is_read ? (
            <>
              <Mail aria-hidden="true" className="size-4" /> Tandai belum dibaca
            </>
          ) : (
            <>
              <MailOpen aria-hidden="true" className="size-4" /> Tandai sudah
              dibaca
            </>
          )}
        </button>
        <ConfirmDelete
          itemLabel={`Pesan dari ${message.name}`}
          action={() => deleteMessage(message.id)}
        />
      </div>
    </article>
  );
}
