import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encode } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  // Verify user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
      return new NextResponse("Missing tenant slug", { status: 400 });
  }

  // Verify access to tenant
  const tenant = await prisma.tenant.findUnique({
      where: { slug }
  });

  if (!tenant) {
      return new NextResponse("Tenant not found", { status: 404 });
  }

  // Check if user is member or super admin
  const isMember = await prisma.tenantUser.findFirst({
      where: {
          tenantId: tenant.id,
          userId: (session.user as any).id
      }
  });

  const isSuperAdmin = (session.user as any).globalRole === 'SUPER_ADMIN';

  if (!isMember && !isSuperAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
  }

  // Create state token to preserve tenant context securely
  const secret = process.env.NEXTAUTH_SECRET || "development-secret-fallback";
  const state = await encode({
      token: {
          tenantId: tenant.id,
          userId: (session.user as any).id
      },
      secret,
  });

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "dummy-client-id";
  const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/integrations/google-calendar/callback`;

  const scope = "https://www.googleapis.com/auth/calendar";

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

  return NextResponse.redirect(authUrl);
}
