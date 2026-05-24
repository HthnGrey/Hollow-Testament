import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[260px_1fr]">
      <AdminNav />
      <main className="w-full px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
