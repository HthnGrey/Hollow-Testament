export type InstagramPost = {
  id: string;
  permalink: string;
  mediaUrl: string;
  mediaType: string;
  caption: string | null;
  timestamp: string | null;
};

type GraphMediaItem = {
  id: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp?: string;
};

type GraphMediaResponse = {
  data?: GraphMediaItem[];
  error?: { message: string };
};

const MEDIA_FIELDS =
  "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp";
const POST_LIMIT = 12;

export function parseInstagramUsername(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;

  try {
    const parsed = new URL(url.trim());
    const segment = parsed.pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
    if (!segment) return null;

    const username = segment.replace(/^@/, "");
    if (!username || ["p", "reel", "reels", "stories", "explore"].includes(username)) {
      return null;
    }

    return username;
  } catch {
    return null;
  }
}

function displayImageUrl(item: GraphMediaItem): string | null {
  if (item.media_type === "VIDEO") {
    return item.thumbnail_url ?? item.media_url ?? null;
  }

  return item.media_url ?? item.thumbnail_url ?? null;
}

function mapMediaItem(item: GraphMediaItem): InstagramPost | null {
  const mediaUrl = displayImageUrl(item);
  if (!mediaUrl) return null;

  return {
    id: item.id,
    permalink: item.permalink,
    mediaUrl,
    mediaType: item.media_type,
    caption: item.caption ?? null,
    timestamp: item.timestamp ?? null,
  };
}

async function fetchInstagramMedia(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!token) return [];

  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set("fields", MEDIA_FIELDS);
  url.searchParams.set("limit", String(POST_LIMIT));
  url.searchParams.set("access_token", token);

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    console.error("Instagram API error:", response.status, await response.text());
    return [];
  }

  const payload = (await response.json()) as GraphMediaResponse;

  if (payload.error?.message) {
    console.error("Instagram API error:", payload.error.message);
    return [];
  }

  return (payload.data ?? [])
    .map(mapMediaItem)
    .filter((post): post is InstagramPost => post !== null);
}

export type InstagramFeed = {
  posts: InstagramPost[];
  username: string | null;
  profileUrl: string | null;
  configured: boolean;
};

export async function getInstagramFeed(profileUrl: string | null): Promise<InstagramFeed> {
  const username = parseInstagramUsername(profileUrl);
  const configured = Boolean(process.env.INSTAGRAM_ACCESS_TOKEN?.trim());

  if (!profileUrl) {
    return { posts: [], username, profileUrl: null, configured };
  }

  const posts = configured ? await fetchInstagramMedia() : [];

  return {
    posts,
    username,
    profileUrl,
    configured,
  };
}
