import Link from "next/link";
import type { ComponentType } from "react";
import {
  CalendarDays,
  Eye,
  FilePenLine,
  Images,
  Music,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/data/events";
import { formatEventDateParts, isUpcoming } from "@/lib/format-event-date";

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-4xl font-semibold leading-none">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-accent">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <p className="mt-4 text-xs uppercase text-muted-foreground">{detail}</p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 border border-border bg-card p-5 transition-colors hover:border-accent"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground group-hover:text-accent">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span>
        <span className="font-heading block text-lg">{label}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const events = await getAllEvents();
  const published = events.filter((e) => e.is_published).length;
  const upcomingEvents = events.filter((e) => e.is_published && isUpcoming(e));
  const draftEvents = events.length - published;
  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden border border-border bg-card">
        <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8">
          <div>
            <p className="font-heading text-sm text-accent">Admin</p>
            <h1 className="font-heading mt-3 text-4xl leading-none md:text-5xl">
              Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Manage public site content, live dates, and new release settings from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/events/new">
                <Plus className="h-4 w-4" aria-hidden />
                New event
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/" target="_blank">
                <Eye className="h-4 w-4" aria-hidden />
                View site
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid border-t border-border sm:grid-cols-3">
          <StatCard
            label="Published events"
            value={published}
            detail="Visible on the public site"
            icon={CalendarDays}
          />
          <StatCard
            label="Upcoming shows"
            value={upcomingEvents.length}
            detail="Published dates still ahead"
            icon={Music}
          />
          <StatCard
            label="Draft events"
            value={draftEvents}
            detail="Saved but hidden from visitors"
            icon={FilePenLine}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl">Quick Actions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Common admin tasks.
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            <QuickAction
              href="/admin/settings"
              label="Site settings"
              description="Update hero text, releases, social links, embeds, and contact details."
              icon={Settings}
            />
            <QuickAction
              href="/admin/events"
              label="Manage events"
              description="Review published dates, drafts, ticket links, and event pages."
              icon={CalendarDays}
            />
            <QuickAction
              href="/admin/events/new"
              label="Create event"
              description="Add a new show and decide when it should appear publicly."
              icon={Plus}
            />
            <QuickAction
              href="/admin/gallery"
              label="Gallery uploads"
              description="Upload photos and publish them to the public gallery page."
              icon={Images}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl">Recent Events</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest event records by update time.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/events">All events</Link>
            </Button>
          </div>

          <div className="border border-border bg-card">
            {recentEvents.length === 0 ? (
              <div className="p-6">
                <p className="text-muted-foreground">No events have been created yet.</p>
                <Button asChild className="mt-5">
                  <Link href="/admin/events/new">Create first event</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentEvents.map((event) => {
                  const date = formatEventDateParts(event.event_date);
                  return (
                    <li
                      key={event.id}
                      className="grid gap-4 p-5 sm:grid-cols-[72px_1fr_auto] sm:items-center"
                    >
                      <div className="flex h-16 w-16 flex-col items-center justify-center border border-border bg-background">
                        <span className="font-heading text-xs text-muted-foreground">
                          {date.month}
                        </span>
                        <span className="font-heading text-2xl leading-none">
                          {date.day}
                        </span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-lg">{event.venue}</h3>
                          <span className="border border-border px-2 py-1 text-xs uppercase text-muted-foreground">
                            {event.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.location}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/events/${event.id}`}>Edit</Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
