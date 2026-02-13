import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import twilio from "twilio";
import { Redis } from "@upstash/redis";
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

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const localQuota = new Map<string, { resetAt: number; used: number }>();
const CAMPAIGN_MANAGER_ROLES = new Set(["OWNER", "ADMIN", "TENANT_ADMIN"]);

function hourlyQuotaKey(tenantSlug: string) {
  return `campaign:quota:${tenantSlug}:${Math.floor(Date.now() / 3600000)}`;
}

async function consumeCampaignQuota(tenantSlug: string, requested: number) {
  const maxHourly = Math.max(Number(process.env.CAMPAIGN_HOURLY_LIMIT || 2000), 1);

  if (redis) {
    try {
      const key = hourlyQuotaKey(tenantSlug);
      const used = await redis.incrby(key, requested);
      await redis.expire(key, 3600);
      if (used > maxHourly) {
        return { ok: false, maxHourly, used };
      }
      return { ok: true, maxHourly, used };
    } catch {
      // fallback local
    }
  }

  const now = Date.now();
  const current = localQuota.get(tenantSlug);
  if (!current || current.resetAt < now) {
    localQuota.set(tenantSlug, { resetAt: now + 3600000, used: requested });
    return { ok: requested <= maxHourly, maxHourly, used: requested };
  }

  current.used += requested;
  localQuota.set(tenantSlug, current);
  return { ok: current.used <= maxHourly, maxHourly, used: current.used };
}

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
  const membership = await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } });
  const isCampaignManager = membership ? CAMPAIGN_MANAGER_ROLES.has(membership.role) : false;
  const hasAccess = role === "SUPER_ADMIN" || Boolean(isCampaignManager);
  if (!hasAccess) return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };

  return { tenant, userId };
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

type Segmentation = { rubro?: string; tag?: string; lastSeenDays?: number };

async function fetchEligibleContacts(params: {
  tenantId: string;
  segmentation: Segmentation;
  limit: number;
  optOutPhones: string[];
}) {
  const contacts = await prisma.contact.findMany({
    where: { tenantId: params.tenantId, phoneE164: { not: "" } },
    orderBy: { lastSeen: "desc" },
    take: Math.max(params.limit * 4, 800),
    select: { id: true, phoneE164: true, name: true, tags: true, lastSeen: true, meta: true },
  });

  return contacts
    .filter((c) => matchesSegmentation(c, params.segmentation, params.optOutPhones))
    .slice(0, params.limit);
}

async function sendBatch(params: {
  tenant: any;
  contacts: Array<{ phoneE164: string }>;
  message: string;
  flyerUrl?: string;
}) {
  const runtimeConfig = params.tenant.integrations.find((i: any) => i.provider === "tenant_runtime_config")?.config;
  const parsedConfig = runtimeConfig ? JSON.parse(runtimeConfig) : {};

  const twilioFrom = parsedConfig?.whatsapp?.twilioFrom || process.env.TWILIO_WHATSAPP_FROM || "";
  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN || "";

  if (!twilioFrom || !accountSid || !authToken) {
    return { error: "Faltan credenciales Twilio o número origen WhatsApp." };
  }

  const client = twilio(accountSid, authToken);
  const failures: { phone: string; reason: string }[] = [];
  let sent = 0;

  for (const contact of params.contacts) {
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

  return { sent, failed: failures.length, attempted: params.contacts.length, failures };
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
  const userId = resolved.userId;
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

  const segmentation: Segmentation = {
    rubro: body?.segmentation?.rubro ? String(body.segmentation.rubro) : undefined,
    tag: body?.segmentation?.tag ? String(body.segmentation.tag) : undefined,
    lastSeenDays: body?.segmentation?.lastSeenDays ? Number(body.segmentation.lastSeenDays) : undefined,
  };

  if (action === "schedule") {
    const message = String(body?.message || "").trim();
    const flyerUrl = normalizeMediaUrl(body?.flyerUrl);
    const scheduledAt = String(body?.scheduledAt || "").trim();
    const limit = Math.min(Math.max(Number(body?.limit || 100), 1), 500);

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
        attempted: limit,
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
      const quota = await consumeCampaignQuota(slug, item.attempted || 100);
      if (!quota.ok) continue;

      const eligible = await fetchEligibleContacts({
        tenantId: tenant.id,
        segmentation: item.segmentation || {},
        limit: item.attempted || 100,
        optOutPhones: storage.optOutPhones,
      });

      const result = await sendBatch({ tenant, contacts: eligible, message: item.message, flyerUrl: item.flyerUrl });
      if (result.error) continue;

      const sent = result.sent ?? 0;
      const failed = result.failed ?? 0;
      totalSent += sent;
      totalFailed += failed;

      storage.history = [
        {
          ...item,
          status: "sent" as const,
          sent,
          failed,
          attempted: result.attempted ?? 0,
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

  if (action === "send_ab") {
    const messageA = String(body?.messageA || "").trim();
    const messageB = String(body?.messageB || "").trim();
    const flyerA = normalizeMediaUrl(body?.flyerUrlA);
    const flyerB = normalizeMediaUrl(body?.flyerUrlB);
    const limit = Math.min(Math.max(Number(body?.limit || 100), 2), 500);

    if (!messageA || !messageB) return NextResponse.json({ message: "messageA and messageB are required" }, { status: 400 });

    const quota = await consumeCampaignQuota(slug, limit);
    if (!quota.ok) return NextResponse.json({ message: `Límite horario superado (${quota.maxHourly})` }, { status: 429 });

    const eligible = await fetchEligibleContacts({ tenantId: tenant.id, segmentation, limit, optOutPhones: storage.optOutPhones });
    const half = Math.ceil(eligible.length / 2);
    const groupA = eligible.slice(0, half);
    const groupB = eligible.slice(half);

    const [resultA, resultB] = await Promise.all([
      sendBatch({ tenant, contacts: groupA, message: messageA, flyerUrl: flyerA }),
      sendBatch({ tenant, contacts: groupB, message: messageB, flyerUrl: flyerB }),
    ]);

    if (resultA.error || resultB.error) {
      return NextResponse.json({ message: resultA.error || resultB.error || "ab_send_error" }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    storage.history = [
      {
        id: `abA_${Date.now()}`,
        status: "sent" as const,
        message: messageA,
        flyerUrl: flyerA,
        sent: resultA.sent ?? 0,
        failed: resultA.failed ?? 0,
        attempted: resultA.attempted ?? 0,
        createdAt: nowIso,
        segmentation,
      },
      {
        id: `abB_${Date.now()}`,
        status: "sent" as const,
        message: messageB,
        flyerUrl: flyerB,
        sent: resultB.sent ?? 0,
        failed: resultB.failed ?? 0,
        attempted: resultB.attempted ?? 0,
        createdAt: nowIso,
        segmentation,
      },
      ...storage.history,
    ].slice(0, 300);

    await saveCampaignStorage(tenant.id, marketing?.id, storage);

    publishTenantEvent(slug, {
      type: "whatsapp.message",
      title: "A/B test enviado",
      body: `A: ${resultA.sent}/${resultA.attempted} | B: ${resultB.sent}/${resultB.attempted}`,
    });

    return NextResponse.json({ ok: true, resultA, resultB, metrics: buildCampaignStats(storage.history) });
  }

  const message = String(body?.message || "").trim();
  const flyerUrl = normalizeMediaUrl(body?.flyerUrl);
  const limit = Math.min(Math.max(Number(body?.limit || 100), 1), 500);

  if (!message) {
    return NextResponse.json({ message: "Campaign message is required" }, { status: 400 });
  }

  const quota = await consumeCampaignQuota(slug, limit);
  if (!quota.ok) return NextResponse.json({ message: `Límite horario superado (${quota.maxHourly})` }, { status: 429 });

  const eligible = await fetchEligibleContacts({ tenantId: tenant.id, segmentation, limit, optOutPhones: storage.optOutPhones });
  const result = await sendBatch({ tenant, contacts: eligible, message, flyerUrl });
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
    audit: { byUserId: userId, at: new Date().toISOString() },
  });
}
