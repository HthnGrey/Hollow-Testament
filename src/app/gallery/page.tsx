import Image from "next/image";
import { SiteLayout } from "@/components/layout/site-layout";
import { getPublishedGalleryImages } from "@/lib/data/gallery";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Gallery",
    description:
      "Photos and moments from Hollow Testament - indie alt rock live shots, behind-the-scenes images, and updates.",
    path: "/gallery",
  });
}

export default async function GalleryPage() {
  const images = await getPublishedGalleryImages();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="font-heading text-sm text-accent">Gallery</p>
        <h1 className="font-heading mt-2 text-4xl md:text-5xl">Photos</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Live shots, behind-the-scenes images, and moments from Hollow Testament.
        </p>

        {images.length > 0 ? (
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {images.map((image) => (
              <li key={image.id}>
                <figure className="group">
                  <div className="relative aspect-square overflow-hidden border border-border bg-card">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || image.caption || "Hollow Testament gallery image"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="mt-3 text-sm text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 border border-dashed border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">
              No gallery images have been published yet.
            </p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
