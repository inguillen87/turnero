import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { publishTenantEvent } from "@/lib/realtime";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  const { tenant: slug, id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return NextResponse.json({ message: "Tenant not found" }, { status: 404 });

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const hasAccess =
    role === "SUPER_ADMIN" ||
    (await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } }));
  if (!hasAccess) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const nextStatus = String(body?.status || "").toUpperCase();
  if (!nextStatus) return NextResponse.json({ message: "Missing status" }, { status: 400 });

  const appt = await prisma.appointment.update({
    where: { id },
    data: { status: nextStatus },
    include: { contact: true, service: true },
  });

  if (nextStatus === "CANCELLED") {
    publishTenantEvent(slug, {
      type: "appointment.cancelled",
      title: "Turno cancelado",
      body: `${appt.contact?.name || "Cliente"} canceló ${appt.service?.name || "turno"}.`,
    });
  }

  return NextResponse.json({ ok: true, appointment: appt });
}
