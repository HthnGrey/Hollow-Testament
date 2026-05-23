import { slugify, uniqueSlug } from "@/lib/slug";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Update, UpdateInput } from "@/types/database";

export async function getPublishedUpdates(): Promise<Update[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("updates")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error || !data) return [];
    return data as Update[];
  } catch {
    return [];
  }
}

export async function getAllUpdates(): Promise<Update[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("updates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Update[];
}

export async function getUpdateBySlug(slug: string): Promise<Update | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("updates")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Update;
}

export async function getUpdateById(id: string): Promise<Update | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("updates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Update;
}

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  return supabase;
}

export async function createUpdate(
  input: UpdateInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await requireAuth();
    const baseSlug = slugify(input.title) || "update";

    const { data: existingSlugs } = await supabase.from("updates").select("slug");
    const slug = uniqueSlug(
      baseSlug,
      (existingSlugs ?? []).map((r) => r.slug),
    );

    const { data, error } = await supabase
      .from("updates")
      .insert({
        title: input.title,
        body: input.body,
        slug,
        image_url: input.image_url ?? null,
        published_at: input.is_published
          ? (input.published_at ?? new Date().toISOString())
          : null,
        is_published: input.is_published ?? false,
      })
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data.id };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create update",
    };
  }
}

export async function updateUpdateRecord(
  id: string,
  input: UpdateInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await requireAuth();

    const payload: Record<string, unknown> = {
      title: input.title,
      body: input.body,
      image_url: input.image_url ?? null,
      is_published: input.is_published ?? false,
      updated_at: new Date().toISOString(),
    };

    if (input.is_published) {
      payload.published_at = input.published_at ?? new Date().toISOString();
    }

    const { error } = await supabase.from("updates").update(payload).eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update",
    };
  }
}

export async function deleteUpdate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await requireAuth();
    const { error } = await supabase.from("updates").delete().eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete",
    };
  }
}

export function excerpt(body: string, maxLength = 160): string {
  const plain = body.replace(/[#*_`>\[\]()]/g, "").trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}…`;
}
