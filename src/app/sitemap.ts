import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/data/events";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hollowtestament.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getPublishedEvents();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/music`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/gallery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/events`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: event.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes];
}
