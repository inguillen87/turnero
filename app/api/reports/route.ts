import { NextRequest, NextResponse } from "next/server";
import { getAppointments } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  const appointments = await getAppointments(slug, {});
  return NextResponse.json(appointments);
}
