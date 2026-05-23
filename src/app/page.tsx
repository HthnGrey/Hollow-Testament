import Image from "next/image";
import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";
import { YouTubeEmbed } from "@/components/embed";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/data/settings";
import { getPublishedUpdates } from "@/lib/data/updates";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({});
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const updates = await getPublishedUpdates();
  const latestUpdate = updates[0];

  const spotifyUrl =
    settings.featured_release_spotify_url ?? settings.spotify_embed_url;
  const youtubeUrl =
    settings.featured_release_youtube_url ?? settings.youtube_channel_url;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-to-b from-accent-deep/20 to-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24 fade-in">
          <div className="flex flex-col justify-center">
            <p className="font-heading text-sm tracking-[0.3em] text-accent">Indie Alt Rock</p>
            <h1 className="font-heading mt-4 text-5xl leading-none tracking-wide md:text-7xl">
              {settings.hero_headline}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              {settings.hero_subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {spotifyUrl && (
                <Button asChild>
                  <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
                    Listen on Spotify
                  </a>
                </Button>
              )}
              {youtubeUrl && (
                <Button variant="outline" asChild>
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                    Watch on YouTube
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="relative aspect-square max-h-[480px] w-full justify-self-center overflow-hidden rounded-sm border border-border bg-card">
            <Image
              src={settings.featured_release_cover_url || "/logo.jpg"}
              alt={settings.featured_release_title || "Hollow Testament"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="font-heading text-sm tracking-widest text-accent">Featured Release</p>
          <h2 className="font-heading mt-2 text-3xl md:text-4xl">
            {settings.featured_release_title}
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {settings.featured_release_spotify_url && (
              <Button asChild size="sm">
                <a href={settings.featured_release_spotify_url} target="_blank" rel="noopener noreferrer">
                  Stream
                </a>
              </Button>
            )}
            {settings.featured_release_youtube_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={settings.featured_release_youtube_url} target="_blank" rel="noopener noreferrer">
                  Watch Video
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="font-heading text-2xl tracking-wide">About</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {settings.about_short}
          </p>
          <Link href="/about" className="mt-6 inline-block text-link hover:text-link-hover">
            Read the full story →
          </Link>
        </div>
      </section>

      {settings.featured_youtube_url && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <h2 className="font-heading mb-8 text-2xl tracking-wide">Latest Video</h2>
            <YouTubeEmbed url={settings.featured_youtube_url} title="Featured Hollow Testament video" />
          </div>
        </section>
      )}

      {latestUpdate && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <h2 className="font-heading text-2xl tracking-wide">Latest Update</h2>
            <Link href={`/updates/${latestUpdate.slug}`} className="mt-4 block group">
              <p className="text-sm text-muted-foreground">
                {latestUpdate.published_at
                  ? new Date(latestUpdate.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : null}
              </p>
              <h3 className="mt-2 text-xl group-hover:text-link">{latestUpdate.title}</h3>
            </Link>
            <Link href="/updates" className="mt-4 inline-block text-sm text-link hover:text-link-hover">
              All updates →
            </Link>
          </div>
        </section>
      )}

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="font-heading text-2xl tracking-wide">Stay Connected</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Follow along for new music, shows, and honest updates from the road and the studio.
          </p>
          <div className="mt-6">
            <SocialLinks settings={settings} />
          </div>
          <div className="mt-8">
            <Button variant="outline" asChild>
              <a href={`mailto:${settings.contact_email}?subject=Get%20Updates`}>
                Get Updates
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
