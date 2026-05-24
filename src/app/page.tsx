import Image from "next/image";
import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/data/settings";
import { getUpcomingEvents } from "@/lib/data/events";
import { buildMetadata } from "@/lib/seo";
import { formatEventDateParts } from "@/lib/format-event-date";
import { getYouTubeThumbnailUrl } from "@/lib/youtube-embeds";

export async function generateMetadata() {
  return buildMetadata({});
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <span className="h-px bg-border" />
      <h2 className="font-heading text-lg">{children}</h2>
      <span className="h-px bg-border" />
    </div>
  );
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const upcomingEvents = await getUpcomingEvents(3);

  const releaseTitle = settings.featured_release_title || "Ashes of the Fallen";
  const spotifyUrl =
    settings.featured_release_spotify_url ?? settings.spotify_embed_url;
  const youtubeUrl =
    settings.featured_release_youtube_url ?? settings.youtube_channel_url;
  const primaryListenUrl = spotifyUrl ?? youtubeUrl;
  const releaseCoverUrl = settings.featured_release_cover_url?.trim();
  const youtubeThumbnailUrl = getYouTubeThumbnailUrl(settings.featured_release_youtube_url);
  const releaseImageUrl =
    releaseCoverUrl || youtubeThumbnailUrl || "/logo.jpg";
  const heroImageUrl = settings.hero_image_url?.trim() || "/logo.jpg";

  return (
    <SiteLayout>
      <section className="border-b border-border bg-[radial-gradient(circle_at_20%_20%,rgba(188,45,16,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_42%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1fr_minmax(280px,520px)] md:px-8 md:py-20">
          <div className="flex min-h-[440px] flex-col justify-center">
            <h1 className="font-heading max-w-xl text-6xl leading-[0.92] md:text-8xl">
              {settings.hero_headline || releaseTitle}
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              {settings.hero_subheadline ||
                "Music that feels like a conversation, not a performance."}
            </p>
            {primaryListenUrl && (
              <Button variant="outline" asChild className="mt-8 w-fit">
                <a href={primaryListenUrl} target="_blank" rel="noopener noreferrer">
                  Listen Now
                </a>
              </Button>
            )}
          </div>

          <div className="relative aspect-square self-center overflow-hidden border border-border bg-card">
            <Image
              src={heroImageUrl}
              alt="Hollow Testament hero image"
              fill
              className="object-cover opacity-90"
              priority
              sizes="(max-width: 768px) 100vw, 520px"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <SectionTitle>New Release</SectionTitle>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-[240px_1fr] md:items-center">
            <div className="relative aspect-square overflow-hidden border border-border bg-card">
              <Image
                src={releaseImageUrl}
                alt={releaseTitle}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl">{releaseTitle}</h2>
              <p className="mt-2 text-sm uppercase text-muted-foreground">Out now</p>
              <p className="mt-4 max-w-md text-muted-foreground">
                The latest Hollow Testament release is available everywhere. Stream,
                watch, and follow for the next drop.
              </p>
              {primaryListenUrl && (
                <Button variant="outline" asChild className="mt-6">
                  <a href={primaryListenUrl} target="_blank" rel="noopener noreferrer">
                    Stream Now
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <SectionTitle>Upcoming Shows</SectionTitle>
          {upcomingEvents.length > 0 ? (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {upcomingEvents.map((event) => {
                const date = formatEventDateParts(event.event_date);
                return (
                  <article key={event.id} className="grid grid-cols-[92px_1fr] border border-border bg-card/40">
                    <div className="flex flex-col items-center justify-center border-r border-border p-4">
                      <span className="font-heading text-sm text-muted-foreground">{date.month}</span>
                      <span className="font-heading text-4xl leading-none">{date.day}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-sm">{event.venue}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{event.location}</p>
                      {event.ticket_url && (
                        <Button variant="outline" size="sm" asChild className="mt-4">
                          <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                            Tickets
                          </a>
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-center text-muted-foreground">
              No live dates announced yet.
            </p>
          )}
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1fr_auto] md:px-8 md:py-16">
          <div>
            <h2 className="font-heading text-3xl">Contact</h2>
            <p className="mt-2 text-sm uppercase text-muted-foreground">Get in touch</p>
          </div>
          <div className="space-y-6 md:min-w-[320px]">
            <div>
              <h3 className="font-heading text-sm">Booking</h3>
              {settings.contact_email && (
                <a className="text-sm text-link hover:text-link-hover" href={`mailto:${settings.contact_email}`}>
                  {settings.contact_email}
                </a>
              )}
            </div>
            <div>
              <h3 className="font-heading text-sm">Follow Us</h3>
              <div className="mt-3">
                <SocialLinks settings={settings} iconOnly />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
