"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/types/database";

type SettingsFormProps = {
  settings: SiteSettings;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

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

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>, fieldName: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok && data.url) {
      const input = document.querySelector<HTMLInputElement>(`input[name="${fieldName}"]`);
      if (input) input.value = data.url;
    }
  }

  function field(name: keyof SiteSettings, label: string, type = "text") {
    const value = settings[name];
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input id={name} name={name} type={type} defaultValue={value ?? ""} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <section className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide">Hero</h2>
        {field("hero_headline", "Headline")}
        {field("hero_subheadline", "Subheadline")}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide">About</h2>
        <div className="space-y-2">
          <Label htmlFor="about_short">Short bio</Label>
          <Textarea id="about_short" name="about_short" rows={3} defaultValue={settings.about_short ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="about_long">Full bio</Label>
          <Textarea id="about_long" name="about_long" rows={8} defaultValue={settings.about_long ?? ""} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide">Featured Release</h2>
        {field("featured_release_title", "Title")}
        {field("featured_release_cover_url", "Cover image URL")}
        <div>
          <Label htmlFor="cover-upload">Upload cover</Label>
          <Input id="cover-upload" type="file" accept="image/*" className="mt-2" onChange={(e) => uploadFile(e, "featured_release_cover_url")} />
        </div>
        {field("featured_release_spotify_url", "Spotify URL")}
        {field("featured_release_youtube_url", "YouTube URL")}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide">Embeds &amp; Links</h2>
        {field("spotify_embed_url", "Spotify embed URL")}
        {field("featured_youtube_url", "Featured YouTube video URL")}
        {field("youtube_channel_url", "YouTube channel URL")}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide">Social</h2>
        {field("instagram_url", "Instagram")}
        {field("tumblr_url", "Tumblr")}
        {field("x_url", "X / Twitter")}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg tracking-wide">Contact</h2>
        {field("contact_email", "Email", "email")}
        {field("contact_phone", "Phone", "tel")}
      </section>

      {error && <p className="text-sm text-accent">{error}</p>}

      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save settings"}
      </Button>
    </form>
  );
}
