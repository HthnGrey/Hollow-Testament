import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";
import { EventRow } from "@/components/event-row";
import { Button } from "@/components/ui/button";
import { getPublishedEvents } from "@/lib/data/events";
import { isUpcoming } from "@/lib/format-event-date";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Events",
    description:
      "Upcoming live shows and tour dates for Hollow Testament — indie alt rock.",
    path: "/events",
  });
}

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const upcoming = events.filter(isUpcoming);
  const past = events.filter((e) => !isUpcoming(e)).reverse();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <p className="font-heading text-sm tracking-widest text-accent">Live Shows</p>
        <h1 className="font-heading mt-2 text-4xl md:text-5xl">Events</h1>
        <p className="mt-4 text-muted-foreground">
          Catch Hollow Testament on stage — tickets and details below.
        </p>

        {events.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No events scheduled yet. Check back soon.</p>
        ) : (
          <div className="mt-12 space-y-12">
            {upcoming.length > 0 && (
              <section>
                <h2 className="font-heading mb-6 text-xl tracking-wide">Upcoming</h2>
                <ul className="space-y-4">
                  {upcoming.map((event) => (
                    <li key={event.id}>
                      <EventRow event={event} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="font-heading mb-6 text-xl tracking-wide">Past Shows</h2>
                <ul className="space-y-4">
                  {past.map((event) => (
                    <li key={event.id}>
                      <EventRow event={event} showDetailLink />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/contact">Book or inquire</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
