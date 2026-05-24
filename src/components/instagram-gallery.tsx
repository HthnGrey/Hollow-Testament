import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InstagramFeed } from "@/lib/instagram";

type InstagramGalleryProps = {
  feed: InstagramFeed;
};

export function InstagramGallery({ feed }: InstagramGalleryProps) {
  const { posts, username, profileUrl, configured } = feed;

  if (!profileUrl) {
    return (
      <p className="mt-12 text-muted-foreground">
        Instagram is not linked yet. Add a profile URL in site settings.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mt-12 rounded-sm border border-border bg-card/40 p-8 text-center">
        <p className="text-muted-foreground">
          {configured
            ? "No posts to show right now. Check back soon or visit our Instagram."
            : "Gallery posts load from Instagram once an access token is configured for this site."}
        </p>
        <Button className="mt-6" asChild>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            {username ? `@${username}` : "View on Instagram"}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-accent"
            >
              <Image
                src={post.mediaUrl}
                alt={post.caption?.slice(0, 120) || "Instagram post"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className="sr-only">Open post on Instagram</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Button variant="outline" asChild>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            {username ? `Follow @${username} on Instagram` : "Follow on Instagram"}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </>
  );
}
