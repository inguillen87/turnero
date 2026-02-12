import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decode } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const state = req.nextUrl.searchParams.get("state");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  if (!state) {
      return NextResponse.json({ error: "Missing state parameter" }, { status: 400 });
  }

  // Verify session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Decode state to get tenant context
  const secret = process.env.NEXTAUTH_SECRET || "development-secret-fallback";
  let decodedState;
  try {
      decodedState = await decode({ token: state, secret });
  } catch (e) {
      console.error("State decode error:", e);
      return NextResponse.json({ error: "Invalid state parameter" }, { status: 400 });
  }

  if (!decodedState || !decodedState.tenantId || !decodedState.userId) {
      return NextResponse.json({ error: "Invalid state payload" }, { status: 400 });
  }

  const { tenantId, userId } = decodedState;

  // Security Check: Ensure the user initiating the callback is the same who started the flow
  if (userId !== (session.user as any).id) {
       return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
  }

  // Security Check: Verify user still has access to the tenant
  const isMember = await prisma.tenantUser.findFirst({
      where: {
          tenantId: tenantId as string,
          userId: (session.user as any).id
      }
  });
  const isSuperAdmin = (session.user as any).globalRole === 'SUPER_ADMIN';

  if (!isMember && !isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden access to tenant" }, { status: 403 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId as string } });
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

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
    // Check if integration already exists, update it if so
    const existingIntegration = await prisma.integration.findFirst({
        where: {
            tenantId: tenant.id,
            provider: "google_calendar"
        }
    });

    if (existingIntegration) {
        await prisma.integration.update({
            where: { id: existingIntegration.id },
            data: {
                status: "active",
                config: JSON.stringify(tokens)
            }
        });
    } else {
        await prisma.integration.create({
            data: {
                tenantId: tenant.id,
                provider: "google_calendar",
                status: "active",
                config: JSON.stringify(tokens)
            }
        });
    }

    // 4. Redirect to Settings
    return NextResponse.redirect(new URL(`/t/${tenant.slug}/settings?calendar_connected=true`, req.url));

  } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
