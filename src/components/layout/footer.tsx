import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { SITE_NAME } from "@/lib/defaults";
import type { SiteSettings } from "@/types/database";

type FooterProps = {
  settings: Pick<
    SiteSettings,
    "instagram_url" | "tumblr_url" | "x_url" | "contact_email"
  >;
};

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="relative mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex h-12 w-fit items-center gap-3 border border-border px-4">
            <Image
              src="/logo.jpg"
              alt={SITE_NAME}
              width={32}
              height={32}
              className="h-7 w-7 object-cover"
            />
            <p className="font-heading text-sm">{SITE_NAME}</p>
          </div>

          <nav
            className="flex flex-wrap gap-6 text-xs uppercase text-muted-foreground"
            aria-label="Footer"
          >
            <Link href="/" className="hover:text-link">
              Home
            </Link>
            <Link href="/events" className="hover:text-link">
              Events
            </Link>
            <Link href="/music" className="hover:text-link">
              Music
            </Link>
            <Link href="/gallery" className="hover:text-link">
              Gallery
            </Link>
            <Link href="/about" className="hover:text-link">
              About
            </Link>
            <Link href="/contact" className="hover:text-link">
              Contact
            </Link>
          </nav>

          <SocialLinks settings={settings} iconOnly />
        </div>

        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          (c) {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
      <Link
        href="/admin"
        aria-label="Admin panel"
        className="absolute bottom-4 right-4 h-8 w-8 opacity-0 focus:opacity-100"
      />
    </footer>
  );
}
