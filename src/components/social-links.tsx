import type { SiteSettings } from "@/types/database";

export function SocialLinks({
  settings,
}: {
  settings: Pick<SiteSettings, "instagram_url" | "tumblr_url" | "x_url">;
}) {
  const links = [
    { label: "Instagram", href: settings.instagram_url },
    { label: "Tumblr", href: settings.tumblr_url },
    { label: "X", href: settings.x_url },
  ].filter((l) => l.href);

  if (!links.length) return null;

  return (
    <ul className="flex flex-wrap gap-4">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-sm tracking-wider text-link uppercase underline-offset-4 hover:text-link-hover hover:underline"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
