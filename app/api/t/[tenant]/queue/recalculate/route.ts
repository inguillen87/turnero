import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { publishTenantEvent } from "@/lib/realtime";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return NextResponse.json({ message: "Tenant not found" }, { status: 404 });

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const hasAccess =
    role === "SUPER_ADMIN" ||
    (await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } }));

  if (!hasAccess) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const delayMinutes = Math.max(0, Number(body?.delayMinutes || 0));
  const staffId = body?.staffId ? String(body.staffId) : undefined;

  const where: any = {
    tenantId: tenant.id,
    status: { in: ["PENDING", "CONFIRMED"] },
    startAt: { gte: new Date() },
  };
  if (staffId) where.staffId = staffId;

  const upcoming = await prisma.appointment.findMany({
    where,
    include: { service: true, contact: true },
    orderBy: { startAt: "asc" },
  });

  if (delayMinutes === 0 || upcoming.length === 0) {
    return NextResponse.json({ ok: true, moved: 0 });
  }

  let moved = 0;
  for (const appt of upcoming) {
    const nextStart = new Date(appt.startAt.getTime() + delayMinutes * 60_000);
    const duration = (appt.service?.durationMin || 30) * 60_000;
    const nextEnd = new Date(nextStart.getTime() + duration);

    await prisma.appointment.update({
      where: { id: appt.id },
      data: { startAt: nextStart, endAt: nextEnd, notes: `${appt.notes || ""}\n[AutoQueue] +${delayMinutes}m` },
    });
    moved += 1;
  }

  publishTenantEvent(slug, {
    type: "delay.alert",
    title: "Demora aplicada",
    body: `Se recalcularon ${moved} turnos con +${delayMinutes} minutos.`,
  });

  return NextResponse.json({ ok: true, moved, delayMinutes });
}
