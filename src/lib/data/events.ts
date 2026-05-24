import { slugify, uniqueSlug } from "@/lib/slug";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Event, EventInput } from "@/types/database";

export async function getPublishedEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: true });

    if (error || !data) return [];
    return data as Event[];
  } catch {
    return [];
  }
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const events = await getPublishedEvents();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming = events.filter(
    (event) => new Date(event.event_date) >= startOfToday,
  );

  return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getAllEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error || !data) return [];
  return data as Event[];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Event;
}

export async function getEventById(id: string): Promise<Event | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Event;
}

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  return supabase;
}

export async function createEvent(
  input: EventInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await requireAuth();
    const baseSlug = slugify(`${input.title}-${input.venue}`) || "event";

    const { data: existingSlugs } = await supabase.from("events").select("slug");
    const slug = uniqueSlug(
      baseSlug,
      (existingSlugs ?? []).map((r) => r.slug),
    );

    const { data, error } = await supabase
      .from("events")
      .insert({
        title: input.title,
        venue: input.venue,
        location: input.location,
        event_date: input.event_date,
        ticket_url: input.ticket_url ?? null,
        body: input.body ?? null,
        image_url: input.image_url ?? null,
        slug,
        is_published: input.is_published ?? false,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data.id };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create event",
    };
  }
}

export async function updateEventRecord(
  id: string,
  input: EventInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await requireAuth();

    const { error } = await supabase
      .from("events")
      .update({
        title: input.title,
        venue: input.venue,
        location: input.location,
        event_date: input.event_date,
        ticket_url: input.ticket_url ?? null,
        body: input.body ?? null,
        image_url: input.image_url ?? null,
        is_published: input.is_published ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update event",
    };
  }
}

export async function deleteEvent(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await requireAuth();
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete event",
    };
  }
}
