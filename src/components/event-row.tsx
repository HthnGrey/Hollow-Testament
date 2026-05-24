import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatEventDateParts, isUpcoming } from "@/lib/format-event-date";
import type { Event } from "@/types/database";

type EventRowProps = {
  event: Event;
  showDetailLink?: boolean;
};

export function EventRow({ event, showDetailLink = true }: EventRowProps) {
  const { month, day } = formatEventDateParts(event.event_date);
  const upcoming = isUpcoming(event);

  return (
    <div className="flex flex-col gap-6 border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-6">
        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center border border-border bg-card">
          <span className="font-heading text-xs tracking-widest text-accent">{month}</span>
          <span className="font-heading text-2xl leading-none">{day}</span>
        </div>
        <div>
          <h2 className="font-heading text-xl tracking-wide">{event.venue}</h2>
          <p className="mt-1 text-muted-foreground">{event.location}</p>
          {event.title && event.title !== event.venue && (
            <p className="mt-2 text-sm">{event.title}</p>
          )}
          {!upcoming && (
            <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
              Past show
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        {event.ticket_url && upcoming && (
          <Button asChild size="sm">
            <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
              Tickets
            </a>
          </Button>
        )}
        {showDetailLink && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/${event.slug}`}>Details</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export function EventCard({ event }: { event: Event }) {
  const { month, day } = formatEventDateParts(event.event_date);

  return (
    <div className="border border-border p-6">
      <div className="font-heading text-sm tracking-widest text-accent">
        {month} {day}
      </div>
      <h3 className="font-heading mt-3 text-lg tracking-wide">{event.venue}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
      {event.ticket_url && isUpcoming(event) && (
        <Button asChild size="sm" className="mt-4">
          <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
            Tickets
          </a>
        </Button>
      )}
    </div>
  );
}
