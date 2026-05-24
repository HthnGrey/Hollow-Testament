import { PasswordForm } from "@/app/admin/(shell)/account/password-form";

export default function AdminAccountPage() {
  return (
    <section className="space-y-8">
      <div className="border border-border bg-card p-6 md:p-8">
        <p className="font-heading text-sm text-accent">Admin</p>
        <h1 className="font-heading mt-3 text-4xl leading-none md:text-5xl">
          Account Settings
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Manage login credentials for the current admin session.
        </p>
      </div>

      <PasswordForm />
    </section>
  );
}
