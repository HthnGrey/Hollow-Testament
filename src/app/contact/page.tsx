import { SiteLayout } from "@/components/layout/site-layout";
import { SocialLinks } from "@/components/social-links";
import { ContactForm } from "@/app/contact/contact-form";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Contact",
    description: "Get in touch with Hollow Testament — booking, press, or general inquiries.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <p className="font-heading text-sm tracking-widest text-accent">Contact</p>
          <h1 className="font-heading mt-2 text-4xl md:text-5xl">Get In Touch</h1>
          <p className="mt-4 text-muted-foreground">
            Questions, collaborations, or just want to say hello — we&apos;d love to hear from you.
          </p>
          <ContactForm contactEmail={settings.contact_email} />
        </div>

        <aside className="space-y-8 border-t border-border pt-8 md:border-t-0 md:border-l md:pl-12 md:pt-0">
          <div>
            <h2 className="font-heading text-lg tracking-wide">Direct</h2>
            {settings.contact_email && (
              <p className="mt-3">
                <a href={`mailto:${settings.contact_email}`} className="text-link hover:underline">
                  {settings.contact_email}
                </a>
              </p>
            )}
            {settings.contact_phone && (
              <p className="mt-2">
                <a href={`tel:${settings.contact_phone}`} className="text-link hover:underline">
                  {settings.contact_phone}
                </a>
              </p>
            )}
          </div>

          <div>
            <h2 className="font-heading text-lg tracking-wide">Follow</h2>
            <div className="mt-4">
              <SocialLinks settings={settings} />
            </div>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
