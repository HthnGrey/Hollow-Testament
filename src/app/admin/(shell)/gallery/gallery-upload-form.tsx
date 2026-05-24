"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageUp, Loader2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GalleryImage } from "@/types/database";

type GalleryUploadFormProps = {
  images: GalleryImage[];
};

export function GalleryUploadForm({ images }: GalleryUploadFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed");
        return;
      }

      setImageUrl(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function saveImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      image_url: imageUrl.trim(),
      alt_text: String(formData.get("alt_text") ?? ""),
      caption: String(formData.get("caption") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_published: formData.get("is_published") === "on",
    };

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save image");
        return;
      }

      setImageUrl("");
      e.currentTarget.reset();
      router.refresh();
    } catch {
      setError("Failed to save image");
    } finally {
      setSaving(false);
    }
  }

  async function deleteImage(id: string) {
    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to delete image");
        return;
      }

      router.refresh();
    } catch {
      setError("Failed to delete image");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <form onSubmit={saveImage} className="h-fit border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-heading text-2xl">Upload Image</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a photo, add optional caption text, and publish it to the public gallery.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-3">
            <Label>Image upload</Label>
            <div className="relative aspect-square overflow-hidden border border-dashed border-border bg-background">
              {imageUrl ? (
                <Image src={imageUrl} alt="Gallery upload preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <ImageUp className="h-10 w-10" aria-hidden />
                  <span className="text-sm">No image selected</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={uploadImage}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ImageUp className="h-4 w-4" aria-hidden />
              )}
              {uploading ? "Uploading..." : "Choose image"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt_text">Alt text</Label>
            <Input id="alt_text" name="alt_text" placeholder="Describe the image" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea id="caption" name="caption" rows={3} placeholder="Optional caption" />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={0} />
            </div>
            <label className="flex h-11 items-center gap-2 border border-border px-3 text-sm text-muted-foreground">
              <input name="is_published" type="checkbox" defaultChecked className="accent-[var(--accent)]" />
              Published
            </label>
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}

          <Button type="submit" disabled={!imageUrl || saving} className="w-full">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
            {saving ? "Saving..." : "Save to gallery"}
          </Button>
        </div>
      </form>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl">Gallery Images</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {images.length} uploaded {images.length === 1 ? "image" : "images"}.
            </p>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            No gallery images yet.
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {images.map((image) => (
              <li key={image.id} className="border border-border bg-card">
                <div className="relative aspect-square bg-background">
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || image.caption || "Gallery image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 33vw"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="border border-border px-2 py-1 text-xs uppercase text-muted-foreground">
                      {image.is_published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-muted-foreground">Order {image.sort_order}</span>
                  </div>
                  {image.caption && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {image.caption}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={deletingId === image.id}
                    onClick={() => deleteImage(image.id)}
                  >
                    {deletingId === image.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Trash2 className="h-4 w-4" aria-hidden />
                    )}
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
