import { cn } from "@/lib/utils";

type EmbedProps = {
  src: string;
  title: string;
  variant?: "video" | "spotify" | "default";
  className?: string;
  loading?: "lazy" | "eager";
};

export function Embed({
  src,
  title,
  variant = "default",
  className,
  loading = "lazy",
}: EmbedProps) {
  if (!src) return null;

  const variantClass =
    variant === "video"
      ? "embed-responsive--video"
      : variant === "spotify"
        ? "embed-responsive--spotify"
        : "";

  return (
    <div className={cn("embed-responsive", variantClass, className)}>
      <iframe
        src={src}
        title={title}
        loading={loading}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
    if (parsed.pathname.startsWith("/embed/")) return url;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts[0] === "shorts" && parts[1]) {
      return `https://www.youtube.com/embed/${parts[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function YouTubeEmbed({
  url,
  title,
  className,
}: {
  url: string | null | undefined;
  title: string;
  className?: string;
}) {
  if (!url) return null;
  const embedSrc = youtubeEmbedUrl(url);
  if (!embedSrc) return null;
  return (
    <Embed src={embedSrc} title={title} variant="video" className={className} />
  );
}

export function SpotifyEmbed({
  url,
  title,
  className,
}: {
  url: string | null | undefined;
  title: string;
  className?: string;
}) {
  if (!url) return null;

  let embedSrc = url;
  if (!url.includes("embed")) {
    embedSrc = url.replace(
      "open.spotify.com/",
      "open.spotify.com/embed/",
    );
  }

  return (
    <Embed
      src={embedSrc}
      title={title}
      variant="spotify"
      className={className}
    />
  );
}
