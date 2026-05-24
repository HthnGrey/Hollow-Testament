import { SiteLayout } from "@/components/layout/site-layout";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "About",
    description: settings.about_short ?? undefined,
    path: "/about",
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_48%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <p className="font-heading text-sm text-accent">About</p>
          <h1 className="font-heading mt-3 text-5xl leading-none md:text-7xl">
            Hollow Testament
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            {settings.about_short}
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[280px_1fr] md:px-8 md:py-20">
          <div>
            <h2 className="font-heading text-2xl">The Story</h2>
            <p className="mt-3 text-sm uppercase text-muted-foreground">
              Raw, honest, built for connection.
            </p>
          </div>
          <p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {settings.about_long}
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
