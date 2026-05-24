import { YouTubeEmbed } from "@/components/embed";
import type { YouTubeEmbedItem } from "@/types/database";

type YouTubeEmbedCardsProps = {
  embeds: YouTubeEmbedItem[];
  sectionTitle?: string;
  className?: string;
};

export function YouTubeEmbedCards({
  embeds,
  sectionTitle = "Videos",
  className,
}: YouTubeEmbedCardsProps) {
  if (embeds.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="font-heading mb-8 text-2xl tracking-wide">{sectionTitle}</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {embeds.map((embed, index) => {
          const iframeTitle =
            embed.title?.trim() || `Hollow Testament video ${index + 1}`;

          return (
            <article
              key={`${embed.url}-${index}`}
              className="overflow-hidden rounded-sm border border-border bg-card"
            >
              {embed.title?.trim() ? (
                <h3 className="font-heading border-b border-border px-4 py-3 text-lg tracking-wide">
                  {embed.title.trim()}
                </h3>
              ) : null}
              <div className={embed.title?.trim() ? "p-4" : "p-4 pt-4"}>
                <YouTubeEmbed url={embed.url} title={iframeTitle} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
