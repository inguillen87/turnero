import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Verify user session
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "dummy-client-id";
  const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/integrations/google-calendar/callback`;

  const scope = "https://www.googleapis.com/auth/calendar";

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
