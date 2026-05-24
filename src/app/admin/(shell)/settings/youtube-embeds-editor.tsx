"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { YouTubeEmbedItem } from "@/types/database";

type YouTubeEmbedsEditorProps = {
  embeds: YouTubeEmbedItem[];
  onChange: (embeds: YouTubeEmbedItem[]) => void;
};

export function YouTubeEmbedsEditor({ embeds, onChange }: YouTubeEmbedsEditorProps) {
  function updateAt(index: number, patch: Partial<YouTubeEmbedItem>) {
    onChange(embeds.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeAt(index: number) {
    onChange(embeds.filter((_, i) => i !== index));
  }

  function addEmbed() {
    onChange([...embeds, { url: "", title: null }]);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-lg">YouTube embeds</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add one or more videos. Each appears in its own card on the home and music pages.
        </p>
      </div>

      {embeds.length === 0 ? (
        <p className="border border-dashed border-border bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground">
          No videos yet. Add one below.
        </p>
      ) : (
        <ul className="space-y-4">
          {embeds.map((embed, index) => (
            <li
              key={index}
              className="space-y-4 border border-border bg-background/60 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-heading text-sm text-accent">Video {index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-accent"
                  onClick={() => removeAt(index)}
                  aria-label={`Remove video ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Remove
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`youtube-title-${index}`}>Card title</Label>
                  <Input
                    id={`youtube-title-${index}`}
                    value={embed.title ?? ""}
                    placeholder="Latest single"
                    onChange={(e) =>
                      updateAt(index, { title: e.target.value || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`youtube-url-${index}`}>YouTube URL</Label>
                  <Input
                    id={`youtube-url-${index}`}
                    type="url"
                    value={embed.url}
                    placeholder="https://www.youtube.com/watch?v=..."
                    onChange={(e) => updateAt(index, { url: e.target.value })}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button type="button" variant="outline" size="sm" onClick={addEmbed}>
        <Plus className="h-4 w-4" aria-hidden />
        Add video
      </Button>
    </div>
  );
}
