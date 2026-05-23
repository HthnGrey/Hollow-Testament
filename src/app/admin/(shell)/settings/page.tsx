import { SettingsForm } from "@/app/admin/(shell)/settings/settings-form";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <section>
      <h1 className="font-heading text-3xl tracking-wide">Site Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Changes appear on the public site immediately after saving.
      </p>
      <SettingsForm settings={settings} />
    </section>
  );
}
