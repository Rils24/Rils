"use client";

import { deleteRecord } from "@/lib/admin/actions";
import type { EntityKey } from "@/lib/admin/entities";
import { ConfirmDelete } from "./confirm-delete";

/** Tombol hapus untuk baris di tabel daftar konten. */
export function DeleteRecord({
  entityKey,
  id,
  label,
}: {
  entityKey: EntityKey;
  id: string;
  label: string;
}) {
  return (
    <ConfirmDelete
      compact
      itemLabel={label}
      action={() => deleteRecord(entityKey, id)}
    />
  );
}
