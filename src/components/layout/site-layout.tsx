import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getSiteSettings } from "@/lib/data/settings";

export async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="grain flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
