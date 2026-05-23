import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/defaults";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hollowtestament.com";

export function buildMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TAGLINE}`;
  const desc =
    description ??
    "Hollow Testament — indie alt rock built on raw emotion and honest connection. Listen on Spotify, watch on YouTube, and stay connected.";
  const url = `${siteUrl}${path}`;
  const ogImage = image ?? `${siteUrl}/logo.jpg`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

export function musicGroupJsonLd(settings: {
  instagram_url?: string | null;
  tumblr_url?: string | null;
  x_url?: string | null;
  contact_email?: string | null;
}) {
  const sameAs = [
    settings.instagram_url,
    settings.tumblr_url,
    settings.x_url,
  ].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: SITE_NAME,
    genre: "Indie Alt Rock",
    sameAs,
    ...(settings.contact_email && {
      contactPoint: {
        "@type": "ContactPoint",
        email: settings.contact_email,
        contactType: "customer support",
      },
    }),
  };
}
