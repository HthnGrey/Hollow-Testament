"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  contactEmail: string | null;
};

export function ContactForm({ contactEmail }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
          formLoadedAt: formData.get("formLoadedAt"),
        }),
      });

      const data = await res.json();

      if (data.fallback && data.mailto) {
        setStatus("success");
        setMessage(data.message);
        window.location.href = data.mailto;
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Message sent. We'll be in touch.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Unable to send. Please email us directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" name="formLoadedAt" value={Date.now()} />

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={6} />
      </div>

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </Button>

      {message && (
        <p className={status === "success" ? "text-link" : "text-accent"}>{message}</p>
      )}

      {status === "error" && contactEmail && (
        <p className="text-sm text-muted-foreground">
          Or email{" "}
          <a href={`mailto:${contactEmail}`} className="text-link hover:underline">
            {contactEmail}
          </a>
        </p>
      )}
    </form>
  );
}
