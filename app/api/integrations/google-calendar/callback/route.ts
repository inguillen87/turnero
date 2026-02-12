import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // 1. Identify Tenant (For demo, pick first active tenant)
  const tenant = await prisma.tenant.findFirst({ where: { status: "active" } });
  if (!tenant) return NextResponse.json({ error: "No active tenant found" }, { status: 404 });

  try {
    // 2. Exchange Code for Tokens
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/integrations/google-calendar/callback`;

    let tokens = {
       access_token: "dummy_access_token",
       refresh_token: "dummy_refresh_token",
       scope: "https://www.googleapis.com/auth/calendar",
       token_type: "Bearer",
       expiry_date: Date.now() + 3600 * 1000
    };

    if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code: code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code"
            })
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error("Google Token Error:", errorText);
            return NextResponse.json({ error: "Failed to exchange token", details: errorText }, { status: 500 });
        }
        tokens = await tokenResponse.json();
    } else {
        console.warn("Missing Google Credentials - Using Mock Tokens");
    }

    // 3. Save Integration
    await prisma.integration.create({
        data: {
            tenantId: tenant.id,
            provider: "google_calendar",
            status: "active",
            config: JSON.stringify(tokens)
        }
    });

    // 4. Redirect to Settings
    return NextResponse.redirect(new URL(`/t/${tenant.slug}/settings?calendar_connected=true`, req.url));

  } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
