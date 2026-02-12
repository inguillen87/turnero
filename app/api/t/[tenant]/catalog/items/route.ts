import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { tenant: string } }) {
  try {
    const tenantSlug = params.tenant;

    // Optimized: Fetch tenant and its items in one query to preserve 404 behavior
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        catalogItems: {
          where: { active: true },
          // id is a default sort key if createdAt doesn't exist
        },
      },
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
