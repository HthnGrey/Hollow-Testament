import { NextResponse } from "next/server";
import { createGalleryImage } from "@/lib/data/gallery";

export async function POST(request: Request) {
  const body = await request.json();

  const imageUrl = String(body.image_url ?? "").trim();
  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  }

  const sortOrder = Number(body.sort_order ?? 0);
  const result = await createGalleryImage({
    image_url: imageUrl,
    alt_text: String(body.alt_text ?? "").trim() || null,
    caption: String(body.caption ?? "").trim() || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_published: Boolean(body.is_published ?? true),
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
