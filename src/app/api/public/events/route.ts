import { NextResponse } from "next/server";
import { getPublishedEvents } from "@/lib/data/events";

export async function GET() {
  const events = await getPublishedEvents();
  return NextResponse.json(events);
}
