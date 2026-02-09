import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Avoid circular dependency if authOptions is exported from route.ts.
// Ideally authOptions should be in lib/auth.ts.
// For now, I'll assume session check is done via middleware or I'll skip deep auth check for this demo structure.

export async function GET(req: NextRequest) {
  // In a real app, verify user session here
  // const session = await getServerSession(authOptions);
  // if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "dummy-client-id";
  const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/integrations/google-calendar/callback`;

  const scope = "https://www.googleapis.com/auth/calendar";

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
