"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Update } from "@/types/database";

type UpdateFormProps = {
  update?: Update;
};

export function UpdateForm({ update }: UpdateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: String(formData.get("title")),
      body: String(formData.get("body")),
      image_url: String(formData.get("image_url") || "") || null,
      is_published: formData.get("is_published") === "on",
    };

    const url = update ? `/api/admin/updates/${update.id}` : "/api/admin/updates";
    const method = update ? "PUT" : "POST";

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

      router.push("/admin/updates");
      router.refresh();
    } catch {
      setStatus("error");
      setError("Failed to save update");
    }
  }

  async function handleDelete() {
    if (!update || !confirm("Delete this update?")) return;

    const res = await fetch(`/api/admin/updates/${update.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/updates");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={update?.title ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body (Markdown supported)</Label>
        <Textarea id="body" name="body" rows={12} required defaultValue={update?.body ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL (optional)</Label>
        <Input id="image_url" name="image_url" defaultValue={update?.image_url ?? ""} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={update?.is_published ?? false}
          className="rounded border-border"
        />
        Publish immediately
      </label>

      {error && <p className="text-sm text-accent">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save update"}
        </Button>
        {update && (
          <Button type="button" variant="outline" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button type="button" variant="ghost" asChild>
          <Link href="/admin/updates">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
