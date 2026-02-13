import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseCampaignStorage } from "@/lib/marketing-campaigns";

async function resolveTenant(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };

  const tenant = await prisma.tenant.findUnique({ where: { slug }, include: { integrations: true } });
  if (!tenant) return { error: NextResponse.json({ message: "Tenant not found" }, { status: 404 }) };

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const hasAccess = role === "SUPER_ADMIN" || (await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } }));
  if (!hasAccess) return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };

  return { tenant };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const resolved = await resolveTenant(slug);
  if ("error" in resolved) return resolved.error;

  const tenant = resolved.tenant;
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [cancelled, pendingPayments] = await Promise.all([
    prisma.appointment.count({ where: { tenantId: tenant.id, status: "CANCELLED", startAt: { gte: since24h } } }),
    prisma.appointment.count({
      where: {
        tenantId: tenant.id,
        paymentStatus: { in: ["PENDING", "pending", "UNPAID"] },
        startAt: { gte: since24h },
      },
    }),
  ]);

  return NextResponse.json({
    suggestions: {
      reactivationFromCancellations: cancelled,
      paymentReminderFromPending: pendingPayments,
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const resolved = await resolveTenant(slug);
  if ("error" in resolved) return resolved.error;

  const tenant = resolved.tenant;
  const body = await req.json();
  const action = String(body?.action || "plan");
  const scheduleOffsetHours = Math.max(Number(body?.scheduleOffsetHours || 24), 1);

  const marketing = tenant.integrations.find((i: any) => i.provider === "marketing_whatsapp_campaigns");
  const storage = parseCampaignStorage(marketing?.config);

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [cancelledCount, pendingCount] = await Promise.all([
    prisma.appointment.count({ where: { tenantId: tenant.id, status: "CANCELLED", startAt: { gte: since24h } } }),
    prisma.appointment.count({
      where: {
        tenantId: tenant.id,
        paymentStatus: { in: ["PENDING", "pending", "UNPAID"] },
        startAt: { gte: since24h },
      },
    }),
  ]);

  const plans = [] as any[];

  if (cancelledCount > 0) {
    plans.push({
      id: `journey_cancel_${Date.now()}`,
      status: "scheduled" as const,
      message: "¡Hola! Se liberaron nuevos horarios esta semana. Si querés, te ayudamos a reprogramar tu turno en 1 minuto.",
      sent: 0,
      failed: 0,
      attempted: Math.min(cancelledCount, 200),
      createdAt: new Date().toISOString(),
      scheduledAt: new Date(Date.now() + scheduleOffsetHours * 60 * 60 * 1000).toISOString(),
      segmentation: { lastSeenDays: 60 },
    });
  }

  if (pendingCount > 0) {
    plans.push({
      id: `journey_pending_${Date.now()}`,
      status: "scheduled" as const,
      message: "Recordatorio: todavía tenés un pago pendiente de seña/consulta. Si querés, te reenviamos el link para completarlo hoy.",
      sent: 0,
      failed: 0,
      attempted: Math.min(pendingCount, 200),
      createdAt: new Date().toISOString(),
      scheduledAt: new Date(Date.now() + scheduleOffsetHours * 60 * 60 * 1000).toISOString(),
      segmentation: { lastSeenDays: 45 },
    });
  }

  if (action === "plan") {
    return NextResponse.json({ ok: true, planned: plans.length, plans });
  }

  if (action === "enqueue") {
    storage.scheduled = [...plans, ...storage.scheduled].slice(0, 100);

    if (marketing) {
      await prisma.integration.update({
        where: { id: marketing.id },
        data: { config: JSON.stringify(storage), status: "active" },
      });
    } else {
      await prisma.integration.create({
        data: {
          tenantId: tenant.id,
          provider: "marketing_whatsapp_campaigns",
          status: "active",
          config: JSON.stringify(storage),
        },
      });
    }

    return NextResponse.json({ ok: true, enqueued: plans.length, scheduledTotal: storage.scheduled.length });
  }

  return NextResponse.json({ message: "Unknown action" }, { status: 400 });
}
