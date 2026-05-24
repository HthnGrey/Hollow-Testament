import { notFound } from "next/navigation";
import { EventForm } from "@/app/admin/(shell)/events/event-form";
import { getEventById } from "@/lib/data/events";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <section className="space-y-8">
      <div className="border border-border bg-card p-6 md:p-8">
        <p className="font-heading text-sm text-accent">Admin</p>
        <h1 className="font-heading mt-3 text-4xl leading-none md:text-5xl">
          Edit Event
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Update show details, publishing status, ticket links, and event artwork.
        </p>
      </div>
      <EventForm event={event} />
    </section>
  );
}
