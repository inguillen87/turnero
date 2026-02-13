import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import twilio from "twilio";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { publishTenantEvent } from "@/lib/realtime";

function toWhatsAppAddress(phoneE164: string) {
  const normalized = phoneE164.startsWith("+") ? phoneE164 : `+${phoneE164.replace(/^\+?/, "")}`;
  return `whatsapp:${normalized}`;
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { integrations: true },
  });

  if (!tenant) return NextResponse.json({ message: "Tenant not found" }, { status: 404 });

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const hasAccess =
    role === "SUPER_ADMIN" ||
    (await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } }));

  if (!hasAccess) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const message = String(body?.message || "").trim();
  const mediaUrl = normalizeMediaUrl(body?.flyerUrl);
  const limit = Math.min(Math.max(Number(body?.limit || 100), 1), 500);

  if (!message) {
    return NextResponse.json({ message: "Campaign message is required" }, { status: 400 });
  }

  const runtimeConfig = tenant.integrations.find((i) => i.provider === "tenant_runtime_config")?.config;
  const parsedConfig = runtimeConfig ? JSON.parse(runtimeConfig) : {};

  const twilioFrom = parsedConfig?.whatsapp?.twilioFrom || process.env.TWILIO_WHATSAPP_FROM || "";
  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN || "";

  if (!twilioFrom || !accountSid || !authToken) {
    return NextResponse.json(
      {
        message:
          "Faltan credenciales Twilio o número origen WhatsApp. Configurá TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN y whatsapp.twilioFrom.",
      },
      { status: 400 }
    );
  }

  const contacts = await prisma.contact.findMany({
    where: {
      tenantId: tenant.id,
      phoneE164: { not: "" },
    },
    orderBy: { lastSeen: "desc" },
    take: limit,
    select: { id: true, phoneE164: true, name: true },
  });

  if (contacts.length === 0) {
    return NextResponse.json({ message: "No hay contactos para enviar campaña", sent: 0, failed: 0 });
  }

  const client = twilio(accountSid, authToken);
  const failures: { phone: string; reason: string }[] = [];
  let sent = 0;

  for (const contact of contacts) {
    try {
      await client.messages.create({
        from: twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`,
        to: toWhatsAppAddress(contact.phoneE164),
        body: message,
        mediaUrl: mediaUrl ? [mediaUrl] : undefined,
      });
      sent += 1;
    } catch (error: any) {
      failures.push({ phone: contact.phoneE164, reason: error?.message || "send_error" });
    }
  }

  const campaignConfig = {
    lastCampaignAt: new Date().toISOString(),
    sent,
    failed: failures.length,
    message,
    flyerUrl: mediaUrl || null,
  };

  const existingCampaign = tenant.integrations.find((i) => i.provider === "marketing_whatsapp_campaigns");
  if (existingCampaign) {
    await prisma.integration.update({
      where: { id: existingCampaign.id },
      data: {
        config: JSON.stringify(campaignConfig),
        status: "active",
      },
    });
  } else {
    await prisma.integration.create({
      data: {
        tenantId: tenant.id,
        provider: "marketing_whatsapp_campaigns",
        status: "active",
        config: JSON.stringify(campaignConfig),
      },
    });
  }

  publishTenantEvent(slug, {
    type: "whatsapp.message",
    title: "Campaña WhatsApp enviada",
    body: `Enviados: ${sent}. Fallidos: ${failures.length}.`,
  });

  return NextResponse.json({
    ok: true,
    sent,
    failed: failures.length,
    attempted: contacts.length,
    failures: failures.slice(0, 20),
  });
}
