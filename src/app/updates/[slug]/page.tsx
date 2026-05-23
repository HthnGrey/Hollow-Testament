import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/site-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { getUpdateBySlug } from "@/lib/data/updates";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const update = await getUpdateBySlug(slug);
  if (!update) return buildMetadata({ title: "Update Not Found" });

  return buildMetadata({
    title: update.title,
    description: update.body.slice(0, 160),
    path: `/updates/${slug}`,
    image: update.image_url,
  });
}

export default async function UpdateDetailPage({ params }: Props) {
  const { slug } = await params;
  const update = await getUpdateBySlug(slug);
  if (!update) notFound();

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <time
          dateTime={update.published_at ?? update.created_at}
          className="text-sm text-muted-foreground"
        >
          {update.published_at
            ? new Date(update.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null}
        </time>
        <h1 className="font-heading mt-4 text-4xl md:text-5xl">{update.title}</h1>

        {update.image_url && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-sm border border-border">
            <Image
              src={update.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="prose-site mt-10">
          <MarkdownContent content={update.body} />
        </div>
      </article>
    </SiteLayout>
  );
}
