import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const PROVIDER = "tenant_runtime_config";

async function resolveTenantAndAccess(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { integrations: true },
  });

  if (!tenant) {
    return { error: NextResponse.json({ message: "Tenant not found" }, { status: 404 }) };
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const hasAccess =
    role === "SUPER_ADMIN" ||
    (await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } }));

  if (!hasAccess) {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }

  return { tenant };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const resolved = await resolveTenantAndAccess(slug);
  if ("error" in resolved) return resolved.error;

  const configIntegration = resolved.tenant.integrations.find((i) => i.provider === PROVIDER);
  const config = configIntegration?.config ? JSON.parse(configIntegration.config) : {};

  return NextResponse.json({ config });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const resolved = await resolveTenantAndAccess(slug);
  if ("error" in resolved) return resolved.error;

  const payload = await req.json();
  const safePayload = {
    mercadopago: {
      accessToken: payload?.mercadopago?.accessToken || "",
      publicKey: payload?.mercadopago?.publicKey || "",
      autoGenerateLinks: payload?.mercadopago?.autoGenerateLinks ?? true,
      defaultConcept: payload?.mercadopago?.defaultConcept || "consulta",
    },
    whatsapp: {
      mode: payload?.whatsapp?.mode || "twilio_shared",
      twilioFrom: payload?.whatsapp?.twilioFrom || "",
      webhookUrl: payload?.whatsapp?.webhookUrl || "",
    },
    notifications: {
      newPayment: payload?.notifications?.newPayment ?? true,
      newAppointment: payload?.notifications?.newAppointment ?? true,
      cancellation: payload?.notifications?.cancellation ?? true,
      delay: payload?.notifications?.delay ?? true,
    },
    calendar: {
      provider: payload?.calendar?.provider || "google",
      googleCalendarId: payload?.calendar?.googleCalendarId || "primary",
      calendlyUrl: payload?.calendar?.calendlyUrl || "",
      icalUrl: payload?.calendar?.icalUrl || "",
      blockedRanges: Array.isArray(payload?.calendar?.blockedRanges)
        ? payload.calendar.blockedRanges
            .map((item: any) => ({
              id: String(item?.id || `block-${Date.now()}`),
              startAt: String(item?.startAt || ""),
              endAt: String(item?.endAt || ""),
              reason: String(item?.reason || "Bloqueo operativo"),
            }))
            .filter((item: any) => item.startAt && item.endAt)
        : [],
    },
    googleSheets: {
      enabled: payload?.googleSheets?.enabled ?? false,
      spreadsheetId: payload?.googleSheets?.spreadsheetId || "",
      worksheetName: payload?.googleSheets?.worksheetName || "Turnos",
      autoSyncAppointments: payload?.googleSheets?.autoSyncAppointments ?? true,
    },
  };

  const existing = resolved.tenant.integrations.find((i) => i.provider === PROVIDER);

  if (existing) {
    await prisma.integration.update({
      where: { id: existing.id },
      data: { config: JSON.stringify(safePayload), status: "active" },
    });
  } else {
    await prisma.integration.create({
      data: {
        tenantId: resolved.tenant.id,
        provider: PROVIDER,
        status: "active",
        config: JSON.stringify(safePayload),
      },
    });
  }

  return NextResponse.json({ ok: true, config: safePayload });
}
