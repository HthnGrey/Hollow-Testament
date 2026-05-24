import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    if (
      error.message.toLowerCase().includes("bucket") &&
      error.message.toLowerCase().includes("not found")
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase storage bucket 'media' was not found. Run supabase/migrations/007_media_storage_bucket.sql in the Supabase SQL Editor.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
