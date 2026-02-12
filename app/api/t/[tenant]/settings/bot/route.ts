import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;

  // Auth Check
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
      const tenant = await prisma.tenant.findUnique({
          where: { slug },
          include: { integrations: true }
      });

      if (!tenant) return NextResponse.json({ message: "Tenant not found" }, { status: 404 });

      // Verify user has access to this tenant
      const userRole = (session.user as any).role;
      const userId = (session.user as any).id;

      const hasAccess = userRole === 'SUPER_ADMIN' || await prisma.tenantUser.findFirst({
          where: {
              userId: userId,
              tenantId: tenant.id
          }
      });

      if (!hasAccess) {
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      const body = await req.json();

      const existingConfig = tenant.integrations.find(i => i.provider === 'bot_settings');

      if (existingConfig) {
          await prisma.integration.update({
              where: { id: existingConfig.id },
              data: {
                  config: JSON.stringify(body),
                  updatedAt: new Date()
              }
          });
      } else {
          await prisma.integration.create({
              data: {
                  tenantId: tenant.id,
                  provider: 'bot_settings',
                  status: 'active',
                  config: JSON.stringify(body)
              }
          });
      }

      return NextResponse.json({ success: true });

  } catch (error) {
      console.error("Bot Settings Save Error:", error);
      return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
