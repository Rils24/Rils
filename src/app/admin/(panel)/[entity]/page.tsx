import { Pencil, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteRecord } from "@/components/admin/delete-record";
import { PageHeader } from "@/components/admin/page-header";
import { buttonClass } from "@/components/ui/button";
import { listRecords } from "@/lib/admin/data";
import { ENTITIES, isEntityKey, type Column } from "@/lib/admin/entities";
import { formatDate } from "@/lib/admin/format";

export async function generateMetadata({
  params,
}: PageProps<"/admin/[entity]">): Promise<Metadata> {
  const { entity } = await params;
  return {
    title: isEntityKey(entity) ? ENTITIES[entity].label : "Tidak ditemukan",
  };
}

function Cell({ column, value }: { column: Column; value: unknown }) {
  switch (column.type) {
    case "bool":
      return value ? (
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium">
          Ya
        </span>
      ) : (
        <span className="text-muted">—</span>
      );
    case "date":
      return <>{formatDate(value)}</>;
    case "month":
      return <>{formatDate(value, "month")}</>;
    default:
      return (
        <>
          {value === null || value === undefined || value === ""
            ? "—"
            : String(value)}
        </>
      );
  }
}

export default async function EntityListPage({
  params,
}: PageProps<"/admin/[entity]">) {
  const { entity: key } = await params;
  if (!isEntityKey(key)) notFound();

  const entity = ENTITIES[key];
  const rows = await listRecords(key);
  const [titleColumn, ...otherColumns] = entity.columns;

  return (
    <>
      <PageHeader
        title={entity.label}
        description={`${rows.length} data`}
        action={
          <Link href={`/admin/${key}/new`} className={buttonClass("primary")}>
            <Plus aria-hidden="true" className="size-4" />
            Tambah {entity.singular}
          </Link>
        }
      />

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
          Belum ada {entity.singular}.{" "}
          <Link
            href={`/admin/${key}/new`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Tambah sekarang
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-border text-xs text-muted">
              <tr>
                {entity.columns.map((c) => (
                  <th
                    key={c.name}
                    scope="col"
                    className="px-5 py-3 font-medium"
                  >
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-5 py-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => {
                const label = String(row[entity.titleColumn] ?? "data ini");
                return (
                  <tr key={row.id} className="hover:bg-surface-2/50">
                    <th scope="row" className="px-5 py-3 font-medium">
                      <Link
                        href={`/admin/${key}/${row.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        <Cell
                          column={titleColumn}
                          value={row[titleColumn.name]}
                        />
                      </Link>
                    </th>
                    {otherColumns.map((c) => (
                      <td key={c.name} className="px-5 py-3 whitespace-nowrap">
                        <Cell column={c} value={row[c.name]} />
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/${key}/${row.id}`}
                          aria-label={`Edit ${label}`}
                          className="inline-flex h-9 items-center rounded-lg px-3 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                        </Link>
                        <DeleteRecord
                          entityKey={key}
                          id={row.id}
                          label={label}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
