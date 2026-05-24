import { GalleryUploadForm } from "@/app/admin/(shell)/gallery/gallery-upload-form";
import { getAllGalleryImages } from "@/lib/data/gallery";

export default async function AdminGalleryPage() {
  const images = await getAllGalleryImages();

  return (
    <section className="space-y-8">
      <div className="border border-border bg-card p-6 md:p-8">
        <p className="font-heading text-sm text-accent">Admin</p>
        <h1 className="font-heading mt-3 text-4xl leading-none md:text-5xl">
          Gallery Uploads
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Upload and publish images for the public gallery page.
        </p>
      </div>

      <GalleryUploadForm images={images} />
    </section>
  );
}
