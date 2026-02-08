import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTenant } from "@/lib/tenant";
import { z } from "zod";

const staffSchema = z.object({
  name: z.string().min(1),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const staff = await prisma.staff.findMany({
    where: { tenantId: tenant.id },
  });

  return NextResponse.json(staff);
}

export async function POST(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = staffSchema.parse(body);

    const staffMember = await prisma.staff.create({
      data: {
        name: data.name,
        active: data.active ?? true,
        tenantId: tenant.id,
      },
    });

    return NextResponse.json(staffMember, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
