import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllUpdates } from "@/lib/data/updates";

export default async function AdminDashboardPage() {
  const updates = await getAllUpdates();
  const published = updates.filter((u) => u.is_published).length;

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wide">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Update site content and publish announcements from here.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-border p-6">
          <p className="text-sm text-muted-foreground">Published updates</p>
          <p className="mt-2 text-3xl font-medium">{published}</p>
        </div>
        <div className="rounded-sm border border-border p-6">
          <p className="text-sm text-muted-foreground">Draft updates</p>
          <p className="mt-2 text-3xl font-medium">{updates.length - published}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/admin/settings">Edit site settings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/updates/new">New update</Link>
        </Button>
      </div>
    </div>
  );
}
