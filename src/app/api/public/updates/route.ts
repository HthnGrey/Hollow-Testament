import { NextResponse } from "next/server";
import { getPublishedUpdates } from "@/lib/data/updates";

export async function GET() {
  const updates = await getPublishedUpdates();
  return NextResponse.json(updates);
}
