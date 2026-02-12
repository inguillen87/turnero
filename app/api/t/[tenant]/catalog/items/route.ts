import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenant: string }> }) {
  try {
    const { tenant: tenantSlug } = await params;
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: { catalogItems: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({ items: tenant.catalogItems });
  } catch (error) {
    console.error("Fetch Items Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
