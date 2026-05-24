import Image from "next/image";
import { SiteLayout } from "@/components/layout/site-layout";
import { SpotifyEmbed } from "@/components/embed";
import { YouTubeEmbedCards } from "@/components/youtube-embed-cards";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";
import { getYouTubeThumbnailUrl } from "@/lib/youtube-embeds";

const SPOTIFY_ARTIST_EMBED_URL =
  "https://open.spotify.com/embed/artist/6xpG6NBhTq9MAeaQsbTtx5?utm_source=generator&theme=0";

export async function generateMetadata() {
  return buildMetadata({
    title: "Music",
    description:
      "Stream Hollow Testament — indie alt rock with raw emotion and honest connection. Listen on Spotify and watch music videos on YouTube.",
    path: "/music",
  });
}

export default async function MusicPage() {
  const settings = await getSiteSettings();
  const releaseCoverUrl = settings.featured_release_cover_url?.trim();
  const youtubeThumbnailUrl = getYouTubeThumbnailUrl(settings.featured_release_youtube_url);
  const releaseImageUrl =
    releaseCoverUrl || youtubeThumbnailUrl || "/logo.jpg";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <p className="font-heading text-sm tracking-widest text-accent">Music</p>
        <h1 className="font-heading mt-2 text-4xl md:text-5xl">Stream &amp; Listen</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Hollow Testament is an indie alt rock band creating emotional alternative rock
          meant to feel like a conversation — not a performance.
        </p>

        <section className="mt-12">
          <h2 className="font-heading mb-6 text-2xl">On Spotify</h2>
          <SpotifyEmbed url={SPOTIFY_ARTIST_EMBED_URL} title="Hollow Testament on Spotify" />
        </section>

        <section className="mt-16 border-t border-border pt-16">
          <h2 className="font-heading text-2xl">New Release</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-sm border border-border">
              <Image
                src={releaseImageUrl}
                alt={settings.featured_release_title || "New release"}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
            <div>
              <h3 className="text-2xl font-medium">{settings.featured_release_title}</h3>
              <div className="mt-6 flex flex-wrap gap-4">
                {settings.featured_release_spotify_url && (
                  <Button asChild>
                    <a href={settings.featured_release_spotify_url} target="_blank" rel="noopener noreferrer">
                      Listen on Spotify
                    </a>
                  </Button>
                )}
                {settings.featured_release_youtube_url && (
                  <Button variant="outline" asChild>
                    <a href={settings.featured_release_youtube_url} target="_blank" rel="noopener noreferrer">
                      Watch on YouTube
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {settings.featured_youtube_embeds.length > 0 && (
          <YouTubeEmbedCards
            embeds={settings.featured_youtube_embeds}
            sectionTitle={settings.featured_youtube_embeds.length === 1 ? "Music Video" : "Music Videos"}
            className="mt-16 border-t border-border pt-16"
          />
        )}
      </div>
    </SiteLayout>
  );
}
