import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllUpdates } from "@/lib/data/updates";

export default async function AdminUpdatesPage() {
  const updates = await getAllUpdates();

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-wide">Updates</h1>
          <p className="mt-2 text-muted-foreground">Manage announcements and news posts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/updates/new">New update</Link>
        </Button>
      </div>

      {updates.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No updates yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-border">
          {updates.map((update) => (
            <li key={update.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium">{update.title}</p>
                <p className="text-sm text-muted-foreground">
                  {update.is_published ? "Published" : "Draft"} · /updates/{update.slug}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/updates/${update.id}`}>Edit</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
