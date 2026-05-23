import Link from "next/link";
import type { SiteSettings } from "@/types/database";
import { SITE_NAME } from "@/lib/defaults";

type FooterProps = {
  settings: Pick<
    SiteSettings,
    "instagram_url" | "tumblr_url" | "x_url" | "contact_email"
  >;
};

export function Footer({ settings }: FooterProps) {
  const socials = [
    { label: "Instagram", href: settings.instagram_url },
    { label: "Tumblr", href: settings.tumblr_url },
    { label: "X", href: settings.x_url },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-heading text-xl tracking-widest">{SITE_NAME}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Indie alt rock — raw, honest, built for connection.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer">
            <Link href="/" className="hover:text-link">Home</Link>
            <Link href="/music" className="hover:text-link">Music</Link>
            <Link href="/about" className="hover:text-link">About</Link>
            <Link href="/updates" className="hover:text-link">Updates</Link>
            <Link href="/contact" className="hover:text-link">Contact</Link>
          </nav>
          <div>
            <p className="font-heading mb-3 text-sm tracking-wider">Follow</p>
            <ul className="flex flex-col gap-2 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:text-link-hover"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
