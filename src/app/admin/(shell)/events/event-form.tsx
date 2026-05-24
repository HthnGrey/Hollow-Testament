"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  CalendarDays,
  FileText,
  ImageUp,
  Link2,
  Loader2,
  MapPin,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toDatetimeLocalValue } from "@/lib/format-event-date";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/database";

type EventFormProps = {
  event?: Event;
};

function Panel({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card">
      <div className="border-b border-border p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background text-accent">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-heading text-2xl leading-none">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(event?.image_url ?? "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadNote, setImageUploadNote] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const formData = new FormData(e.currentTarget);
    const eventDate = String(formData.get("event_date"));
    const payload = {
      title: String(formData.get("title")),
      venue: String(formData.get("venue")),
      location: String(formData.get("location")),
      event_date: new Date(eventDate).toISOString(),
      ticket_url: String(formData.get("ticket_url") || "") || null,
      body: String(formData.get("body") || "") || null,
      image_url: String(formData.get("image_url") || "") || null,
      is_published: formData.get("is_published") === "on",
    };

    const url = event ? `/api/admin/events/${event.id}` : "/api/admin/events";
    const method = event ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Failed to save");
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Failed to save event");
    }
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setImageUploadNote("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        const input = document.querySelector<HTMLInputElement>('input[name="image_url"]');
        if (input) input.value = data.url;
        setImagePreview(data.url);
        setImageUploadNote("Image uploaded. Save the event to publish it.");
      } else {
        setImageUploadNote(data.error ?? "Upload failed. Try again.");
      }
    } catch {
      setImageUploadNote("Upload failed. Try again.");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete() {
    if (!event || !confirm("Delete this event?")) return;

    const res = await fetch(`/api/admin/events/${event.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/events");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel
            title="Event Details"
            description="Core show information shown on event lists and detail pages."
            icon={CalendarDays}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Event title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={event?.title ?? ""}
                  placeholder="Album release show"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date">Date & time</Label>
                <Input
                  id="event_date"
                  name="event_date"
                  type="datetime-local"
                  required
                  className="datetime-icon-white"
                  defaultValue={toDatetimeLocalValue(event?.event_date)}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  name="venue"
                  required
                  defaultValue={event?.venue ?? ""}
                  placeholder="The Roxy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  defaultValue={event?.location ?? ""}
                  placeholder="Detroit, MI"
                />
              </div>
            </div>
          </Panel>

          <Panel
            title="Links & Copy"
            description="Optional ticket link and longer event notes."
            icon={FileText}
          >
            <div className="space-y-2">
              <Label htmlFor="ticket_url">Ticket URL</Label>
              <Input
                id="ticket_url"
                name="ticket_url"
                type="url"
                defaultValue={event?.ticket_url ?? ""}
                placeholder="https://"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Details</Label>
              <Textarea
                id="body"
                name="body"
                rows={7}
                defaultValue={event?.body ?? ""}
                placeholder="Optional event details. Markdown is supported."
              />
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel
            title="Event Image"
            description="Optional artwork or venue photo."
            icon={ImageUp}
          >
            <div className="relative aspect-square overflow-hidden border border-border bg-background">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Event image preview"
                  fill
                  className="object-cover"
                  sizes="360px"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <ImageUp className="h-10 w-10" aria-hidden />
                  <span className="text-sm">No image selected</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                defaultValue={event?.image_url ?? ""}
                onChange={(e) => setImagePreview(e.target.value)}
                placeholder="https://"
              />
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={uploadImage}
              disabled={imageUploading}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={imageUploading}
              onClick={() => imageInputRef.current?.click()}
            >
              {imageUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ImageUp className="h-4 w-4" aria-hidden />
              )}
              {imageUploading ? "Uploading..." : "Choose image"}
            </Button>

            {imageUploadNote && (
              <p className={cn("text-xs", imageUploadNote.includes("failed") ? "text-accent" : "text-muted-foreground")}>
                {imageUploadNote}
              </p>
            )}
          </Panel>

          <Panel
            title="Publish"
            description="Control whether this event appears publicly."
            icon={MapPin}
          >
            <label className="flex items-center justify-between gap-4 border border-border bg-background px-4 py-3 text-sm">
              <span>
                <span className="font-heading block">Publish on site</span>
                <span className="mt-1 block text-muted-foreground">
                  Draft events stay hidden from visitors.
                </span>
              </span>
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={event?.is_published ?? false}
                className="h-5 w-5 accent-[var(--accent)]"
              />
            </label>
          </Panel>
        </aside>
      </div>

      <div className="sticky bottom-0 z-20 border border-border bg-background/95 p-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5">
            {error ? (
              <p className="text-sm text-accent">{error}</p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link2 className="h-4 w-4" aria-hidden />
                Review event details before saving.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Save className="h-4 w-4" aria-hidden />
              )}
              {status === "saving" ? "Saving..." : "Save event"}
            </Button>
            {event && (
              <Button type="button" variant="outline" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" aria-hidden />
                Delete
              </Button>
            )}
            <Button type="button" variant="ghost" asChild>
              <Link href="/admin/events">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
