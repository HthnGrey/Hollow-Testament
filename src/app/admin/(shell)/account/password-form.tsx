"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function PasswordForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("saving");
    setError("");

    const formData = new FormData(form);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");

    if (password.length < 8) {
      setStatus("error");
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setError("Passwords do not match.");
      return;
    }

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setStatus("error");
        setError(updateError.message);
        return;
      }

      form.reset();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to update password.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-card">
      <div className="border-b border-border p-5 md:p-6">
        <h2 className="font-heading text-2xl leading-none">Change Password</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the password for the currently signed-in admin account.
        </p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword((value) => !value)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
          {showPassword ? "Hide password" : "Show password"}
        </button>

        {error && <p className="text-sm text-accent">{error}</p>}
        {status === "saved" && (
          <p className="text-sm text-muted-foreground">Password updated.</p>
        )}

        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Save className="h-4 w-4" aria-hidden />
          )}
          {status === "saving" ? "Saving..." : "Update password"}
        </Button>
      </div>
    </form>
  );
}
