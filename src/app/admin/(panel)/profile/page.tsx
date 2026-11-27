import type { Metadata } from "next";
import { EntityForm } from "@/components/admin/entity-form";
import { PageHeader } from "@/components/admin/page-header";
import { getProfileRow } from "@/lib/admin/data";
import { toFormValues } from "@/lib/admin/entities";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const profile = await getProfileRow();

  return (
    <>
      <PageHeader
        title="Profil"
        description="Nama, jabatan, bio, foto hero, CV, dan link sosial media."
      />
      {profile ? (
        <EntityForm
          entityKey="profile"
          id={profile.id}
          initialValues={toFormValues("profile", profile)}
        />
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
          Baris profil belum ada. Jalankan <code>npm run db:push</code> untuk
          mengisi data awal.
        </p>
      )}
    </>
  );
}
