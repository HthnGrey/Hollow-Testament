import { notFound } from "next/navigation";
import { UpdateForm } from "@/app/admin/(shell)/updates/update-form";
import { getUpdateById } from "@/lib/data/updates";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditUpdatePage({ params }: Props) {
  const { id } = await params;
  const update = await getUpdateById(id);
  if (!update) notFound();

  return (
    <section>
      <h1 className="font-heading text-3xl tracking-wide">Edit Update</h1>
      <UpdateForm update={update} />
    </section>
  );
}
