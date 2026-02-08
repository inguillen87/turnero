import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTenant } from "@/lib/tenant";

export async function GET(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  const appointments = await prisma.appointment.findMany({
    where: { tenantId: tenant.id },
    include: { service: true }
  });

  return NextResponse.json(appointments);
}
