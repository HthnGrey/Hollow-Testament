import type { MetadataRoute } from "next";
import { getPublishedUpdates } from "@/lib/data/updates";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hollowtestament.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updates = await getPublishedUpdates();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/music`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/updates`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const updateRoutes: MetadataRoute.Sitemap = updates.map((update) => ({
    url: `${siteUrl}/updates/${update.slug}`,
    lastModified: update.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...updateRoutes];
}
