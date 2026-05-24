import type { SiteSettings } from "@/types/database";

type SocialIconProps = {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

function InstagramIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TumblrIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14.1 20.2c-3.4 0-5.2-1.7-5.2-5.1V11H6.7V8.3c2.6-.8 3.5-2.8 3.7-5h2.7V8h3.5v3h-3.5v3.8c0 1.4.7 2.1 1.9 2.1.7 0 1.3-.2 1.9-.5v3.1c-.7.4-1.6.7-2.8.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m4.8 4 5.7 7.7L4.5 20h2.9l4.5-6.2 4.6 6.2h3L13.4 12 19.1 4h-2.9L12 9.8 7.8 4h-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SocialLinks({
  settings,
  iconOnly = false,
  direction = "row",
}: {
  settings: Pick<SiteSettings, "instagram_url" | "tumblr_url" | "x_url">;
  iconOnly?: boolean;
  direction?: "row" | "column";
}) {
  const links = [
    { label: "Instagram", href: settings.instagram_url, icon: InstagramIcon },
    { label: "Tumblr", href: settings.tumblr_url, icon: TumblrIcon },
    { label: "X", href: settings.x_url, icon: XIcon },
  ].filter((l) => l.href);

  if (!links.length) return null;

  return (
    <ul className={direction === "column" ? "flex flex-col gap-3" : "flex flex-wrap gap-4"}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            className={
              iconOnly
                ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent"
                : "font-heading text-sm text-link uppercase underline-offset-4 hover:text-link-hover hover:underline"
            }
            aria-label={link.label}
          >
            {iconOnly ? (
              <link.icon className="h-4 w-4" aria-hidden="true" />
            ) : (
              link.label
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
