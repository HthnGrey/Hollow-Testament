import type { SiteSettings, YouTubeEmbedItem } from "@/types/database";

export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const iframeSrc = url.match(/src=["']([^"']+)["']/i)?.[1];
    const parsed = new URL(iframeSrc ?? url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (hostname.endsWith("youtube.com")) {
      const watchId = parsed.searchParams.get("v");
      if (watchId) return watchId;

      const parts = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0]) && parts[1]) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnailUrl(url: string | null | undefined): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null;
}

export function parseYouTubeEmbeds(raw: unknown): YouTubeEmbedItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): YouTubeEmbedItem | null => {
      if (typeof item === "string" && item.trim()) {
        return { url: item.trim(), title: null };
      }
      if (item && typeof item === "object" && "url" in item) {
        const url = String((item as { url: unknown }).url ?? "").trim();
        if (!url) return null;
        const titleRaw = (item as { title?: unknown }).title;
        const title =
          typeof titleRaw === "string" && titleRaw.trim() ? titleRaw.trim() : null;
        return { url, title };
      }
      return null;
    })
    .filter((item): item is YouTubeEmbedItem => item !== null);
}

export function normalizeFeaturedYouTubeEmbeds(
  row: Pick<SiteSettings, "featured_youtube_embeds" | "featured_youtube_url">,
): YouTubeEmbedItem[] {
  const fromJson = parseYouTubeEmbeds(row.featured_youtube_embeds);
  if (fromJson.length > 0) return fromJson;

  const legacy = row.featured_youtube_url?.trim();
  if (legacy) return [{ url: legacy, title: null }];

  return [];
}
