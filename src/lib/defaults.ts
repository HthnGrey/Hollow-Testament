import type { SiteSettings } from "@/types/database";

export const DEFAULT_SETTINGS: Omit<SiteSettings, "id" | "updated_at"> = {
  hero_headline: "Hollow Testament",
  hero_subheadline:
    "Music that feels like a conversation, not a performance.",
  about_short:
    "Indie alt rock built on raw emotion, movement, and honesty — songs for anyone trying to make it through another day.",
  about_long:
    "Hollow Testament is a band built around connection, the kind that happens when a song says the thing you've been carrying but never knew how to put into words. Through raw emotion, movement, and honesty, we're trying to create music that feels like a conversation instead of a performance. For anyone struggling, stuck in cycles, grieving, healing, or just trying to make it through another day, these songs are meant to remind you that you are not alone.",
  featured_release_title: "Latest Release",
  featured_release_cover_url: null,
  featured_release_spotify_url: null,
  featured_release_youtube_url: null,
  featured_youtube_url: null,
  spotify_embed_url: null,
  youtube_channel_url: null,
  instagram_url: "https://www.instagram.com/hollow.testament/",
  tumblr_url: "https://www.tumblr.com/hollowtestament",
  x_url: "https://x.com/hollowtestament",
  contact_email: "hollowtestament@gmail.com",
  contact_phone: "989-954-2590",
};

export const SITE_NAME = "Hollow Testament";
export const SITE_TAGLINE = "Indie Alt Rock";
