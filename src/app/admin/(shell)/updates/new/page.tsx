import { UpdateForm } from "@/app/admin/(shell)/updates/update-form";

export default function AdminNewUpdatePage() {
  return (
    <section>
      <h1 className="font-heading text-3xl tracking-wide">New Update</h1>
      <UpdateForm />
    </section>
  );
}
