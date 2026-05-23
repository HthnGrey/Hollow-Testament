import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSiteSettings } from "@/lib/data/settings";

const MIN_SUBMIT_MS = 3000;

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message, website, formLoadedAt } = body;

  if (website) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const loadedAt = Number(formLoadedAt);
  if (!loadedAt || Date.now() - loadedAt < MIN_SUBMIT_MS) {
    return NextResponse.json({ error: "Please wait before submitting" }, { status: 429 });
  }

  const settings = await getSiteSettings();
  const to = settings.contact_email ?? "hollowtestament@gmail.com";

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!resendKey) {
    return NextResponse.json({
      message: `Email is not configured. Please contact us at ${to}`,
      mailto: `mailto:${to}?subject=${encodeURIComponent(`Contact from ${name}`)}&body=${encodeURIComponent(message)}`,
      fallback: true,
    });
  }

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Hollow Testament contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return NextResponse.json({ message: "Message sent. We'll be in touch soon." });
  } catch {
    return NextResponse.json(
      { error: `Unable to send email. Please write to ${to}` },
      { status: 500 },
    );
  }
}
