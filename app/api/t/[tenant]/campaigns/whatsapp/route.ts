import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import twilio from "twilio";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { publishTenantEvent } from "@/lib/realtime";
import {
  buildCampaignStats,
  defaultCampaignStorage,
  matchesSegmentation,
  normalizePhone,
  parseCampaignStorage,
} from "@/lib/marketing-campaigns";

function toWhatsAppAddress(phoneE164: string) {
  return `whatsapp:${normalizePhone(phoneE164)}`;
}

function normalizeMediaUrl(value?: string) {
  const url = (value || "").trim();
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return undefined;
    return parsed.toString();
  } catch {
    return undefined;
  }
}

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

async function saveCampaignStorage(tenantId: string, integrationId: string | undefined, storage: ReturnType<typeof defaultCampaignStorage>) {
  if (integrationId) {
    await prisma.integration.update({
      where: { id: integrationId },
      data: { provider: "marketing_whatsapp_campaigns", status: "active", config: JSON.stringify(storage) },
    });
    return;
  }

  await prisma.integration.create({
    data: {
      tenantId,
      provider: "marketing_whatsapp_campaigns",
      status: "active",
      config: JSON.stringify(storage),
    },
  });
}

async function runCampaign(params: {
  tenant: any;
  message: string;
  flyerUrl?: string;
  limit: number;
  segmentation: { rubro?: string; tag?: string; lastSeenDays?: number };
  storage: ReturnType<typeof defaultCampaignStorage>;
}) {
  const runtimeConfig = params.tenant.integrations.find((i: any) => i.provider === "tenant_runtime_config")?.config;
  const parsedConfig = runtimeConfig ? JSON.parse(runtimeConfig) : {};

  const twilioFrom = parsedConfig?.whatsapp?.twilioFrom || process.env.TWILIO_WHATSAPP_FROM || "";
  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN || "";

  if (!twilioFrom || !accountSid || !authToken) {
    return { error: "Faltan credenciales Twilio o número origen WhatsApp." };
  }

  const contacts = await prisma.contact.findMany({
    where: { tenantId: params.tenant.id, phoneE164: { not: "" } },
    orderBy: { lastSeen: "desc" },
    take: Math.max(params.limit * 4, 800),
    select: { id: true, phoneE164: true, name: true, tags: true, lastSeen: true, meta: true },
  });

  const eligible = contacts
    .filter((c) =>
      matchesSegmentation(c, params.segmentation, params.storage.optOutPhones)
    )
    .slice(0, params.limit);

  if (eligible.length === 0) {
    return { sent: 0, failed: 0, attempted: 0, failures: [], error: "No hay contactos que cumplan la segmentación" };
  }

  const client = twilio(accountSid, authToken);
  const failures: { phone: string; reason: string }[] = [];
  let sent = 0;

  for (const contact of eligible) {
    try {
      await client.messages.create({
        from: twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`,
        to: toWhatsAppAddress(contact.phoneE164),
        body: params.message,
        mediaUrl: params.flyerUrl ? [params.flyerUrl] : undefined,
      });
      sent += 1;
    } catch (error: any) {
      failures.push({ phone: contact.phoneE164, reason: error?.message || "send_error" });
    }
  }

  return { sent, failed: failures.length, attempted: eligible.length, failures };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const resolved = await resolveTenant(slug);
  if ("error" in resolved) return resolved.error;

  const marketing = resolved.tenant.integrations.find((i: any) => i.provider === "marketing_whatsapp_campaigns");
  const storage = parseCampaignStorage(marketing?.config);

  return NextResponse.json({
    templates: storage.templates,
    scheduled: storage.scheduled,
    history: storage.history.slice(0, 20),
    optOutPhones: storage.optOutPhones,
    metrics: buildCampaignStats(storage.history),
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
  const action = String(body?.action || "send_now");

  const marketing = tenant.integrations.find((i: any) => i.provider === "marketing_whatsapp_campaigns");
  const storage = parseCampaignStorage(marketing?.config);

  if (action === "save_template") {
    const name = String(body?.name || "").trim();
    const message = String(body?.message || "").trim();
    const flyerUrl = normalizeMediaUrl(body?.flyerUrl);
    const rubro = String(body?.rubro || "").trim() || undefined;

    if (!name || !message) return NextResponse.json({ message: "Template name and message are required" }, { status: 400 });

    storage.templates = [
      {
        id: `tpl_${Date.now()}`,
        name,
        message,
        flyerUrl,
        rubro,
        createdAt: new Date().toISOString(),
      },
      ...storage.templates,
    ].slice(0, 50);

    await saveCampaignStorage(tenant.id, marketing?.id, storage);
    return NextResponse.json({ ok: true, templates: storage.templates });
  }

  if (action === "schedule") {
    const message = String(body?.message || "").trim();
    const flyerUrl = normalizeMediaUrl(body?.flyerUrl);
    const scheduledAt = String(body?.scheduledAt || "").trim();
    const limit = Math.min(Math.max(Number(body?.limit || 100), 1), 500);
    const segmentation = {
      rubro: body?.segmentation?.rubro ? String(body.segmentation.rubro) : undefined,
      tag: body?.segmentation?.tag ? String(body.segmentation.tag) : undefined,
      lastSeenDays: body?.segmentation?.lastSeenDays ? Number(body.segmentation.lastSeenDays) : undefined,
    };

    if (!message || !scheduledAt) {
      return NextResponse.json({ message: "Message and scheduledAt are required" }, { status: 400 });
    }

    storage.scheduled = [
      {
        id: `sch_${Date.now()}`,
        status: "scheduled" as const,
        message,
        flyerUrl,
        sent: 0,
        failed: 0,
        attempted: 0,
        createdAt: new Date().toISOString(),
        scheduledAt,
        segmentation,
      },
      ...storage.scheduled,
    ].slice(0, 100);

    await saveCampaignStorage(tenant.id, marketing?.id, storage);
    return NextResponse.json({ ok: true, scheduled: storage.scheduled });
  }

  if (action === "dispatch_scheduled") {
    const now = new Date();
    const due = storage.scheduled.filter((s) => s.scheduledAt && new Date(s.scheduledAt) <= now);

    let totalSent = 0;
    let totalFailed = 0;

    for (const item of due) {
      const result = await runCampaign({
        tenant,
        message: item.message,
        flyerUrl: item.flyerUrl,
        limit: item.attempted || 100,
        segmentation: item.segmentation || {},
        storage,
      });
      if (result.error) continue;

      const sent = result.sent ?? 0;
      const failed = result.failed ?? 0;
      const attempted = result.attempted ?? 0;

      totalSent += sent;
      totalFailed += failed;

      storage.history = [
        {
          ...item,
          status: "sent" as const,
          sent,
          failed,
          attempted,
          createdAt: new Date().toISOString(),
        },
        ...storage.history,
      ].slice(0, 300);
    }

    storage.scheduled = storage.scheduled.filter((s) => !(s.scheduledAt && new Date(s.scheduledAt) <= now));
    await saveCampaignStorage(tenant.id, marketing?.id, storage);

    publishTenantEvent(slug, {
      type: "whatsapp.message",
      title: "Campañas programadas procesadas",
      body: `Enviados: ${totalSent} | Fallidos: ${totalFailed}`,
    });

    return NextResponse.json({ ok: true, sent: totalSent, failed: totalFailed, remainingScheduled: storage.scheduled.length });
  }

  const message = String(body?.message || "").trim();
  const flyerUrl = normalizeMediaUrl(body?.flyerUrl);
  const limit = Math.min(Math.max(Number(body?.limit || 100), 1), 500);
  const segmentation = {
    rubro: body?.segmentation?.rubro ? String(body.segmentation.rubro) : undefined,
    tag: body?.segmentation?.tag ? String(body.segmentation.tag) : undefined,
    lastSeenDays: body?.segmentation?.lastSeenDays ? Number(body.segmentation.lastSeenDays) : undefined,
  };

  if (!message) {
    return NextResponse.json({ message: "Campaign message is required" }, { status: 400 });
  }

  const result = await runCampaign({ tenant, message, flyerUrl, limit, segmentation, storage });
  if (result.error) return NextResponse.json({ message: result.error }, { status: 400 });

  const sentNow = result.sent ?? 0;
  const failedNow = result.failed ?? 0;
  const attemptedNow = result.attempted ?? 0;

  storage.history = [
    {
      id: `cmp_${Date.now()}`,
      status: "sent" as const,
      message,
      flyerUrl,
      sent: sentNow,
      failed: failedNow,
      attempted: attemptedNow,
      createdAt: new Date().toISOString(),
      segmentation,
    },
    ...storage.history,
  ].slice(0, 300);

  await saveCampaignStorage(tenant.id, marketing?.id, storage);

  publishTenantEvent(slug, {
    type: "whatsapp.message",
    title: "Campaña WhatsApp enviada",
    body: `Enviados: ${sentNow}. Fallidos: ${failedNow}.`,
  });

  return NextResponse.json({
    ok: true,
    sent: sentNow,
    failed: failedNow,
    attempted: attemptedNow,
    failures: (result.failures || []).slice(0, 20),
    metrics: buildCampaignStats(storage.history),
  });
}
