import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTenant } from "@/lib/tenant";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1),
  durationMin: z.number().int().positive(),
  price: z.number().min(0),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id },
  });

  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        name: data.name,
        durationMin: data.durationMin,
        price: data.price,
        active: data.active ?? true,
        tenantId: tenant.id,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
