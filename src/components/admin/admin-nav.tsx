"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ExternalLink, Images, LayoutDashboard, LogOut, Settings, UserCog } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SITE_NAME } from "@/lib/defaults";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery Uploads", icon: Images },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/account", label: "Account Settings", icon: UserCog },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <aside className="border-b border-border bg-card md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-border p-4 md:p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center border border-border bg-background">
              <Image
                src="/logo.jpg"
                alt={SITE_NAME}
                width={32}
                height={32}
                className="h-7 w-7 object-cover"
                priority
              />
            </span>
            <span>
              <span className="font-heading block text-base leading-none">
                {SITE_NAME}
              </span>
              <span className="mt-1 block text-xs uppercase text-muted-foreground">
                Admin
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-visible md:p-4">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-w-fit items-center gap-3 border border-transparent px-3 py-3 text-sm transition-colors",
                  active
                    ? "border-border bg-background text-foreground"
                    : "text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("h-4 w-4", active ? "text-accent" : "")}
                  aria-hidden
                />
                <span className="font-heading">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-border p-4 md:block">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            <span>View site</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span>Sign out</span>
          </button>
        </div>

        <div className="flex border-t border-border md:hidden">
          <Link
            href="/"
            target="_blank"
            className="flex flex-1 items-center justify-center gap-2 px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex flex-1 items-center justify-center gap-2 border-l border-border px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
