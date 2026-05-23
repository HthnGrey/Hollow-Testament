import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/database";

function withDefaults(row: Partial<SiteSettings> | null): SiteSettings {
  return {
    id: row?.id ?? "default",
    ...DEFAULT_SETTINGS,
    ...row,
    updated_at: row?.updated_at ?? null,
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
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return withDefaults(null);
    }

    return withDefaults(data as SiteSettings);
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

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  const payload = { ...settings, updated_at: new Date().toISOString() };

  if (existing?.id) {
    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("site_settings").insert(payload);

    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}
