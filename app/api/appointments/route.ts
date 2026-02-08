import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTenant } from "@/lib/tenant";
import { z } from "zod";
import { parseISO } from "date-fns";

const appointmentSchema = z.object({
  staffId: z.string().min(1),
  serviceId: z.string().min(1),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  clientPhone: z.string().optional(),
  startAt: z.string().datetime(), // ISO string
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {
    tenantId: tenant.id,
  };

  if (from && to) {
    where.startAt = {
      gte: parseISO(from),
      lte: parseISO(to),
    };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      client: true,
      service: true,
      staff: true,
    },
    orderBy: {
      startAt: "asc",
    },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = appointmentSchema.parse(body);

    // Get service duration
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service || service.tenantId !== tenant.id) {
       return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const start = new Date(data.startAt);
    const end = new Date(start.getTime() + service.durationMin * 60000);

    const appointment = await prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        staffId: data.staffId,
        serviceId: data.serviceId,
        clientId: data.clientId,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        startAt: start,
        endAt: end,
        notes: data.notes,
        status: "confirmed",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
