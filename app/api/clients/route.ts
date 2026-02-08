import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTenant } from "@/lib/tenant";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const clients = await prisma.client.findMany({
    where: { tenantId: tenant.id },
  });

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = clientSchema.parse(body);

    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        tenantId: tenant.id,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
