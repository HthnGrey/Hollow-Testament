import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/site-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import { getEventBySlug } from "@/lib/data/events";
import { formatEventDateParts, isUpcoming } from "@/lib/format-event-date";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return buildMetadata({ title: "Event Not Found" });

  return buildMetadata({
    title: `${event.venue} — ${event.location}`,
    description: event.body?.slice(0, 160) ?? `Live show on ${formatEventDateParts(event.event_date).full}`,
    path: `/events/${slug}`,
    image: event.image_url,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const { full, time } = formatEventDateParts(event.event_date);
  const upcoming = isUpcoming(event);

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="font-heading text-sm tracking-widest text-accent">Live Show</p>
        <h1 className="font-heading mt-2 text-4xl md:text-5xl">{event.venue}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{event.location}</p>
        <p className="mt-4 text-muted-foreground">
          {full} · {time}
        </p>

        {event.image_url && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-sm border border-border">
            <Image
              src={event.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {event.body && (
          <div className="prose-site mt-10">
            <MarkdownContent content={event.body} />
          </div>
        )}

        {event.ticket_url && upcoming && (
          <Button asChild className="mt-10">
            <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
              Get Tickets
            </a>
          </Button>
        )}
      </article>
    </SiteLayout>
  );
}
