import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { GalleryImage, GalleryImageInput } from "@/types/database";

const MISSING_GALLERY_TABLE =
  "Supabase is missing public.gallery_images. Run supabase/migrations/006_gallery_images.sql in the Supabase SQL Editor, then retry.";

function isMissingGalleryTable(error: { code?: string; message?: string } | null) {
  return Boolean(
    error &&
      (error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message?.includes("gallery_images") ||
        error.message?.includes("schema cache")),
  );
}

export async function getPublishedGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as GalleryImage[];
  } catch {
    return [];
  }
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (isMissingGalleryTable(error)) {
    return [];
  }
  if (error || !data) return [];
  return data as GalleryImage[];
}

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  return supabase;
}

export async function createGalleryImage(
  input: GalleryImageInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        image_url: input.image_url,
        alt_text: input.alt_text ?? null,
        caption: input.caption ?? null,
        sort_order: input.sort_order ?? 0,
        is_published: input.is_published ?? true,
      })
      .select("id")
      .single();

    if (isMissingGalleryTable(error)) {
      return { success: false, error: MISSING_GALLERY_TABLE };
    }
    if (error) return { success: false, error: error.message };
    return { success: true, id: data.id };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create gallery image",
    };
  }
}

export async function deleteGalleryImage(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await requireAuth();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (isMissingGalleryTable(error)) {
      return { success: false, error: MISSING_GALLERY_TABLE };
    }
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete gallery image",
    };
  }
}
