import { SettingsForm } from "@/app/admin/(shell)/settings/settings-form";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <section className="space-y-8">
      <div className="border border-border bg-card p-6 md:p-8">
        <p className="font-heading text-sm text-accent">Admin</p>
        <h1 className="font-heading mt-3 text-4xl leading-none md:text-5xl">
          Site Settings
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Manage public-facing copy, new release links, video embeds, social profiles, and contact details.
          Saved changes appear on the public site immediately.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </section>
  );
}
