export type YouTubeEmbedItem = {
  url: string;
  title: string | null;
};

export type SiteSettings = {
  id: string;
  hero_headline: string | null;
  hero_subheadline: string | null;
  hero_image_url: string | null;
  about_short: string | null;
  about_long: string | null;
  featured_release_title: string | null;
  featured_release_cover_url: string | null;
  featured_release_spotify_url: string | null;
  featured_release_youtube_url: string | null;
  /** @deprecated Use featured_youtube_embeds. Kept for legacy rows. */
  featured_youtube_url: string | null;
  featured_youtube_embeds: YouTubeEmbedItem[];
  spotify_embed_url: string | null;
  youtube_channel_url: string | null;
  instagram_url: string | null;
  tumblr_url: string | null;
  x_url: string | null;
  contact_email: string | null;
  updated_at: string | null;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  venue: string;
  location: string;
  event_date: string;
  ticket_url: string | null;
  body: string | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type EventInput = {
  title: string;
  venue: string;
  location: string;
  event_date: string;
  ticket_url?: string | null;
  body?: string | null;
  image_url?: string | null;
  is_published?: boolean;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryImageInput = {
  image_url: string;
  alt_text?: string | null;
  caption?: string | null;
  sort_order?: number | null;
  is_published?: boolean;
};
