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
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="font-heading text-sm tracking-widest text-accent">About</p>
        <h1 className="font-heading mt-2 text-4xl md:text-5xl">Hollow Testament</h1>
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
          {settings.about_long}
        </p>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-heading text-xl tracking-wide">For Fans Of</h2>
          <p className="mt-4 text-muted-foreground">
            Indie alt rock, emotional alternative rock, raw and honest songwriting —
            music that meets you where you are.
          </p>
        </section>

        <section className="mt-12 border-t border-border pt-12">
          <h2 className="font-heading text-xl tracking-wide">Press</h2>
          <p className="mt-4 text-muted-foreground italic">
            Quotes and press features coming soon.
          </p>
        </section>
      </div>
    </SiteLayout>
  );
}
