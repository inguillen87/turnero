import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const channelId = req.headers.get("x-goog-channel-id");
  const resourceId = req.headers.get("x-goog-resource-id");
  const resourceState = req.headers.get("x-goog-resource-state");
  const channelToken = req.headers.get("x-goog-channel-token"); // Verification token

  console.log(`Received Google Calendar webhook: ${resourceState} for channel ${channelId}`);

  if (resourceState === "sync") {
    return new NextResponse("Sync OK", { status: 200 });
  }

  if (resourceState === "exists") {
    // 1. Find Integration by Channel ID (stored in config or separate table)
    // Here we'd need to search integrations where config includes channelId
    // For now, just log.

    // 2. Fetch changes from Google Calendar API
    // GET https://www.googleapis.com/calendar/v3/calendars/primary/events?syncToken=...

    // 3. Update Appointments in DB
    // ...

    return new NextResponse("Processed", { status: 200 });
  }

  return new NextResponse("Unknown State", { status: 200 });
}
