import { EventForm } from "@/app/admin/(shell)/events/event-form";

export default function AdminNewEventPage() {
  return (
    <section className="space-y-8">
      <div className="border border-border bg-card p-6 md:p-8">
        <p className="font-heading text-sm text-accent">Admin</p>
        <h1 className="font-heading mt-3 text-4xl leading-none md:text-5xl">
          New Event
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Add a live date, ticket link, details, and optional event artwork.
        </p>
      </div>
      <EventForm />
    </section>
  );
}
