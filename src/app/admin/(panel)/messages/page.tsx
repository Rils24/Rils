import type { Metadata } from "next";
import { MessageItem } from "@/components/admin/message-item";
import { PageHeader } from "@/components/admin/page-header";
import { getMessages } from "@/lib/admin/data";
import { formatDate } from "@/lib/admin/format";

export const metadata: Metadata = { title: "Pesan" };

export default async function MessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <PageHeader
        title="Pesan"
        description={
          messages.length
            ? `${messages.length} pesan, ${unread} belum dibaca.`
            : "Pesan dari form kontak akan muncul di sini."
        }
      />
      {messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
          Belum ada pesan.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <MessageItem
              key={m.id}
              message={{
                ...m,
                dateLabel: formatDate(m.created_at, "datetime"),
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
