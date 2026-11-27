import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/entity-form";
import { PageHeader } from "@/components/admin/page-header";
import { getCategoryOptions } from "@/lib/admin/data";
import { ENTITIES, isEntityKey, toFormValues } from "@/lib/admin/entities";

export async function generateMetadata({
  params,
}: PageProps<"/admin/[entity]/new">): Promise<Metadata> {
  const { entity } = await params;
  return {
    title: isEntityKey(entity)
      ? `Tambah ${ENTITIES[entity].singular}`
      : "Tidak ditemukan",
  };
}

export default async function NewEntityPage({
  params,
}: PageProps<"/admin/[entity]/new">) {
  const { entity: key } = await params;
  if (!isEntityKey(key)) notFound();
  const entity = ENTITIES[key];
  const categoryOptions =
    key === "projects" ? await getCategoryOptions() : undefined;

  return (
    <>
      <PageHeader
        title={`Tambah ${entity.singular}`}
        back={{ href: `/admin/${key}`, label: entity.label }}
      />
      <EntityForm
        entityKey={key}
        id={null}
        initialValues={toFormValues(key, null)}
        categoryOptions={categoryOptions}
      />
    </>
  );
}
