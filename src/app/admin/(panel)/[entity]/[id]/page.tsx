import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/entity-form";
import { PageHeader } from "@/components/admin/page-header";
import { getCategoryOptions, getRecord } from "@/lib/admin/data";
import { ENTITIES, isEntityKey, toFormValues } from "@/lib/admin/entities";

export async function generateMetadata({
  params,
}: PageProps<"/admin/[entity]/[id]">): Promise<Metadata> {
  const { entity } = await params;
  return {
    title: isEntityKey(entity)
      ? `Edit ${ENTITIES[entity].singular}`
      : "Tidak ditemukan",
  };
}

/** Halaman publik untuk konten yang punya halaman sendiri. */
const PUBLIC_PATH: Partial<Record<string, string>> = {
  projects: "/id/projects/",
  posts: "/id/blog/",
};

export default async function EditEntityPage({
  params,
  searchParams,
}: PageProps<"/admin/[entity]/[id]">) {
  const [{ entity: key, id }, { saved }] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!isEntityKey(key)) notFound();

  const entity = ENTITIES[key];
  const [row, categoryOptions] = await Promise.all([
    getRecord(key, id),
    key === "projects" ? getCategoryOptions() : Promise.resolve(undefined),
  ]);
  if (!row) notFound();

  const publicPath = PUBLIC_PATH[key];
  const title = String(row[entity.titleColumn] ?? "");

  return (
    <>
      <PageHeader
        title={title || `Edit ${entity.singular}`}
        description={`Edit ${entity.singular}`}
        back={{ href: `/admin/${key}`, label: entity.label }}
        action={
          publicPath && typeof row.slug === "string" ? (
            <a
              href={`${publicPath}${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              Lihat di website
            </a>
          ) : undefined
        }
      />
      <EntityForm
        key={id}
        entityKey={key}
        id={id}
        initialValues={toFormValues(key, row)}
        categoryOptions={categoryOptions}
        saved={saved === "1"}
      />
    </>
  );
}
