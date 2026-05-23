export type SiteSettings = {
  id: string;
  hero_headline: string | null;
  hero_subheadline: string | null;
  about_short: string | null;
  about_long: string | null;
  featured_release_title: string | null;
  featured_release_cover_url: string | null;
  featured_release_spotify_url: string | null;
  featured_release_youtube_url: string | null;
  featured_youtube_url: string | null;
  spotify_embed_url: string | null;
  youtube_channel_url: string | null;
  instagram_url: string | null;
  tumblr_url: string | null;
  x_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  updated_at: string | null;
};

export type Update = {
  id: string;
  title: string;
  slug: string;
  body: string;
  image_url: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type UpdateInput = {
  title: string;
  body: string;
  image_url?: string | null;
  published_at?: string | null;
  is_published?: boolean;
};
