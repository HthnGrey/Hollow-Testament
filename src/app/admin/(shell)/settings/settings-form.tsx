"use client";

import type { ComponentType } from "react";
import {
  AtSign,
  FileText,
  ImageUp,
  Link2,
  Loader2,
  Mail,
  Music,
  Save,
  Sparkles,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/youtube-embeds";
import type { SiteSettings, YouTubeEmbedItem } from "@/types/database";
import { YouTubeEmbedsEditor } from "./youtube-embeds-editor";

type SettingsFormProps = {
  settings: SiteSettings;
};

type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: IconType;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card">
      <div className="border-b border-border p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background text-accent">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-heading text-2xl leading-none">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5 md:p-6">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [heroPreview, setHeroPreview] = useState(settings.hero_image_url ?? "");
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadNote, setHeroUploadNote] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState(settings.featured_release_cover_url ?? "");
  const [releaseYoutubeUrl, setReleaseYoutubeUrl] = useState(
    settings.featured_release_youtube_url ?? "",
  );
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadNote, setCoverUploadNote] = useState("");
  const [youtubeEmbeds, setYoutubeEmbeds] = useState<YouTubeEmbedItem[]>(
    () => settings.featured_youtube_embeds,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      featured_youtube_embeds: youtubeEmbeds
        .map((item) => ({
          url: item.url.trim(),
          title: item.title?.trim() || null,
        }))
        .filter((item) => item.url),
      featured_youtube_url: null,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Failed to save");
        return;
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setError("Failed to save settings");
    }
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    setCoverUploadNote("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        const input = document.querySelector<HTMLInputElement>('input[name="featured_release_cover_url"]');
        if (input) input.value = data.url;
        setCoverPreview(data.url);
        setCoverUploadNote("Cover uploaded. Save settings to publish.");
      } else {
        setCoverUploadNote(data.error ?? "Upload failed. Try again.");
      }
    } catch {
      setCoverUploadNote("Upload failed. Try again.");
    } finally {
      setCoverUploading(false);
      e.target.value = "";
    }
  }

  async function uploadHeroImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeroUploading(true);
    setHeroUploadNote("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        const input = document.querySelector<HTMLInputElement>('input[name="hero_image_url"]');
        if (input) input.value = data.url;
        setHeroPreview(data.url);
        setHeroUploadNote("Hero image uploaded. Save settings to publish.");
      } else {
        setHeroUploadNote(data.error ?? "Upload failed. Try again.");
      }
    } catch {
      setHeroUploadNote("Upload failed. Try again.");
    } finally {
      setHeroUploading(false);
      e.target.value = "";
    }
  }

  type TextField = {
    [K in keyof SiteSettings]: SiteSettings[K] extends string | null ? K : never;
  }[keyof SiteSettings];

  function field(name: TextField, label: string, type = "text") {
    const value = settings[name];
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input id={name} name={name} type={type} defaultValue={value ?? ""} />
      </div>
    );
  }

  const coverPreviewSrc =
    coverPreview || getYouTubeThumbnailUrl(releaseYoutubeUrl) || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsSection
        title="Hero"
        description="Primary landing page headline and supporting copy."
        icon={Sparkles}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {field("hero_headline", "Headline")}
          {field("hero_subheadline", "Subheadline")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero_image_url">Hero card image URL</Label>
          <Input
            id="hero_image_url"
            name="hero_image_url"
            type="url"
            defaultValue={settings.hero_image_url ?? ""}
            placeholder="/logo.jpg"
            onChange={(e) => setHeroPreview(e.target.value)}
          />
        </div>
        <div className="border border-dashed border-border bg-background/60 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border border-border bg-input">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroPreview || "/logo.jpg"}
                alt="Hero card preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload the image used in the home page hero card. Leave blank to use the logo.
              </p>
              <input
                ref={heroInputRef}
                id="hero-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={uploadHeroImage}
                disabled={heroUploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={heroUploading}
                onClick={() => heroInputRef.current?.click()}
              >
                {heroUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ImageUp className="h-4 w-4" aria-hidden />
                )}
                {heroUploading ? "Uploading..." : "Choose hero image"}
              </Button>
              {heroUploadNote ? (
                <p className={cn("text-xs", heroUploadNote.includes("failed") ? "text-accent" : "text-muted-foreground")}>
                  {heroUploadNote}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="About"
        description="Band bio content used on the dedicated About page and metadata."
        icon={FileText}
      >
        <div className="space-y-2">
          <Label htmlFor="about_short">Short bio</Label>
          <Textarea id="about_short" name="about_short" rows={3} defaultValue={settings.about_short ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="about_long">Full bio</Label>
          <Textarea id="about_long" name="about_long" rows={8} defaultValue={settings.about_long ?? ""} />
        </div>
      </SettingsSection>

      <SettingsSection
        title="New Release"
        description="Album or single details shown in the landing page hero and new release block."
        icon={Music}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {field("featured_release_title", "Title")}
          <div className="space-y-2">
            <Label htmlFor="featured_release_cover_url">Cover image URL</Label>
            <Input
              id="featured_release_cover_url"
              name="featured_release_cover_url"
              type="url"
              defaultValue={settings.featured_release_cover_url ?? ""}
              onChange={(e) => setCoverPreview(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-dashed border-border bg-background/60 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div
              className={cn(
                "relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border border-border bg-input",
                !coverPreviewSrc && "border-dashed",
              )}
            >
              {coverPreviewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreviewSrc} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <ImageUp className="h-8 w-8 text-muted-foreground/60" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload album art as JPG or PNG. The image URL field updates automatically.
              </p>
              <input
                ref={coverInputRef}
                id="cover-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={uploadCover}
                disabled={coverUploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={coverUploading}
                onClick={() => coverInputRef.current?.click()}
              >
                {coverUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ImageUp className="h-4 w-4" aria-hidden />
                )}
                {coverUploading ? "Uploading..." : "Choose cover image"}
              </Button>
              {coverUploadNote ? (
                <p className={cn("text-xs", coverUploadNote.includes("failed") ? "text-accent" : "text-muted-foreground")}>
                  {coverUploadNote}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {field("featured_release_spotify_url", "Spotify URL")}
          <div className="space-y-2">
            <Label htmlFor="featured_release_youtube_url">YouTube URL</Label>
            <Input
              id="featured_release_youtube_url"
              name="featured_release_youtube_url"
              type="url"
              defaultValue={settings.featured_release_youtube_url ?? ""}
              onChange={(e) => setReleaseYoutubeUrl(e.target.value)}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Embeds & Links"
        description="Streaming embeds and video cards used across music-focused pages."
        icon={Video}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {field("spotify_embed_url", "Spotify embed URL")}
          {field("youtube_channel_url", "YouTube channel URL")}
        </div>
        <YouTubeEmbedsEditor embeds={youtubeEmbeds} onChange={setYoutubeEmbeds} />
      </SettingsSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsSection
          title="Social"
          description="Public social profiles linked from the site."
          icon={AtSign}
        >
          {field("instagram_url", "Instagram")}
          {field("tumblr_url", "Tumblr")}
          {field("x_url", "X / Twitter")}
        </SettingsSection>

        <SettingsSection
          title="Contact"
          description="Booking and contact details shown to visitors."
          icon={Mail}
        >
          {field("contact_email", "Email", "email")}
        </SettingsSection>
      </div>

      <div className="sticky bottom-0 z-20 border border-border bg-background/95 p-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5">
            {error ? (
              <p className="text-sm text-accent">{error}</p>
            ) : status === "saved" ? (
              <p className="text-sm text-muted-foreground">Settings saved.</p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link2 className="h-4 w-4" aria-hidden />
                Review changes before saving.
              </p>
            )}
          </div>
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save settings"}
          </Button>
        </div>
      </div>
    </form>
  );
}
