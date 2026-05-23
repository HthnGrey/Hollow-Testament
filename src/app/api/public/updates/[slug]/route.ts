import { NextResponse } from "next/server";
import { getUpdateBySlug } from "@/lib/data/updates";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const update = await getUpdateBySlug(slug);

  if (!update) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(update);
}
