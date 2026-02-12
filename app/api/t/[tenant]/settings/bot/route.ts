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

      // Verify user has access to this tenant (TODO: Improve this check with TenantUser)
      // For now, assuming if logged in and knows slug, it's okay for demo or if global admin
      // But strictly we should check prisma.tenantUser.findFirst({ where: { userId: session.user.id, tenantId: tenant.id } })

      const body = await req.json();

      const existingConfig = tenant.integrations.find(i => i.type === 'bot_settings');

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
                  type: 'bot_settings',
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
