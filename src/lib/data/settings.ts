import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { normalizeFeaturedYouTubeEmbeds } from "@/lib/youtube-embeds";
import type { SiteSettings } from "@/types/database";

const SITE_SETTINGS_COLUMNS = [
  "id",
  "hero_headline",
  "hero_subheadline",
  "hero_image_url",
  "about_short",
  "about_long",
  "featured_release_title",
  "featured_release_cover_url",
  "featured_release_spotify_url",
  "featured_release_youtube_url",
  "featured_youtube_url",
  "featured_youtube_embeds",
  "spotify_embed_url",
  "youtube_channel_url",
  "instagram_url",
  "tumblr_url",
  "x_url",
  "contact_email",
  "updated_at",
] as const;

const WRITABLE_SITE_SETTINGS_COLUMNS = SITE_SETTINGS_COLUMNS.filter(
  (column) => column !== "id" && column !== "updated_at",
);

const MISSING_SITE_SETTINGS_TABLE =
  "Supabase is missing public.site_settings. Run supabase/migrations/005_repair_site_settings.sql in the Supabase SQL Editor, then retry.";

function isMissingSiteSettingsTable(error: { code?: string; message?: string } | null) {
  return Boolean(
    error &&
      (error.code === "42P01" ||
        error.code === "PGRST205" ||
        error.message?.includes("site_settings") ||
        error.message?.includes("schema cache")),
  );
}

function sanitizeSettingsPayload(
  settings: Partial<Omit<SiteSettings, "id" | "updated_at">>,
) {
  return Object.fromEntries(
    WRITABLE_SITE_SETTINGS_COLUMNS
      .filter((column) => Object.prototype.hasOwnProperty.call(settings, column))
      .map((column) => [column, settings[column as keyof typeof settings]]),
  );
}

function withDefaults(row: Partial<SiteSettings> | null): SiteSettings {
  const merged = {
    id: row?.id ?? "default",
    ...DEFAULT_SETTINGS,
    ...row,
    updated_at: row?.updated_at ?? null,
  };

  return {
    ...merged,
    featured_youtube_embeds: normalizeFeaturedYouTubeEmbeds(merged),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return withDefaults(null);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(SITE_SETTINGS_COLUMNS.join(","))
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return withDefaults(null);
    }

    return withDefaults(data as unknown as SiteSettings);
  } catch {
    return withDefaults(null);
  }
}

export async function updateSiteSettings(
  settings: Partial<Omit<SiteSettings, "id" | "updated_at">>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: existing, error: existingError } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (isMissingSiteSettingsTable(existingError)) {
    return { success: false, error: MISSING_SITE_SETTINGS_TABLE };
  }

  const payload = {
    ...sanitizeSettingsPayload(settings),
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", existing.id);

    if (isMissingSiteSettingsTable(error)) {
      return { success: false, error: MISSING_SITE_SETTINGS_TABLE };
    }
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("site_settings").insert(payload);

    if (isMissingSiteSettingsTable(error)) {
      return { success: false, error: MISSING_SITE_SETTINGS_TABLE };
    }
    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}
