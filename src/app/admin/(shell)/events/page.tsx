import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/data/events";
import { formatEventDateParts } from "@/lib/format-event-date";

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-wide">Events</h1>
          <p className="mt-2 text-muted-foreground">Manage live shows and tour dates.</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">New event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No events yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-border">
          {events.map((event) => {
            const { full } = formatEventDateParts(event.event_date);
            return (
              <li key={event.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-sm text-muted-foreground">
                    {full} · {event.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.is_published ? "Published" : "Draft"}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/events/${event.id}`}>Edit</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
