import { NextRequest, NextResponse } from "next/server";
import { getAppointments, createAppointment } from "@/lib/db";
import { z } from "zod";
import { parseISO } from "date-fns";

export const runtime = "nodejs";

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
  const slug = req.headers.get("x-tenant-slug") || "demo";
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const appointments = await getAppointments(slug, { from, to });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const slug = req.headers.get("x-tenant-slug") || "demo";
  try {
    const body = await req.json();
    const data = appointmentSchema.parse(body);
    const appointment = await createAppointment(slug, data);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
