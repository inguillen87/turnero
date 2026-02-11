import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { tenant: string } }) {
  try {
    const tenantSlug = params.tenant;
    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const items = await prisma.catalogItem.findMany({
      where: { tenantId: tenant.id, active: true },
      // id is a default sort key if createdAt doesn't exist
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Fetch Items Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
