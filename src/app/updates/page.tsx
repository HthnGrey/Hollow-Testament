import Link from "next/link";
import { SiteLayout } from "@/components/layout/site-layout";
import { excerpt, getPublishedUpdates } from "@/lib/data/updates";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Updates",
    description: "News, announcements, and updates from Hollow Testament.",
    path: "/updates",
  });
}

export default async function UpdatesPage() {
  const updates = await getPublishedUpdates();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="font-heading text-sm tracking-widest text-accent">Updates</p>
        <h1 className="font-heading mt-2 text-4xl md:text-5xl">News &amp; Announcements</h1>

        {updates.length === 0 ? (
          <p className="mt-8 text-muted-foreground">No updates yet. Check back soon.</p>
        ) : (
          <ul className="mt-12 divide-y divide-border">
            {updates.map((update) => (
              <li key={update.id} className="py-8">
                <Link href={`/updates/${update.slug}`} className="group block">
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
                  <h2 className="mt-2 text-2xl group-hover:text-link">{update.title}</h2>
                  <p className="mt-3 text-muted-foreground">{excerpt(update.body)}</p>
                  <span className="mt-4 inline-block text-sm text-link">Read more →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}
