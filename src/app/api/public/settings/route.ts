import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data/settings";

export async function GET() {
  const settings = await getSiteSettings();
  const { id: _id, ...publicSettings } = settings;
  return NextResponse.json(publicSettings);
}
