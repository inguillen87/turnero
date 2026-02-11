export const runtime = "nodejs";

import twilio from "twilio";
import { Redis } from "@upstash/redis";
import { Session, handleMessage } from "@/lib/bot/stateMachine";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

// --- ENV & UTILS ---
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Fallback memory store
const memSessions = new Map<string, Session>();
const memDedupe = new Map<string, number>();

function now() {
  return Date.now();
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function twiml(message: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`;
}

function normalizeBody(s: string) {
  return (s || "").trim().toLowerCase();
}

function buildPublicUrl(req: NextRequest, tenantSlug: string) {
  // Use current host
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("host") || "";
  return `${proto}://${host}/api/webhooks/twilio/${tenantSlug}`;
}

function validateTwilioSignature(params: Record<string, string>, url: string, signature: string | null) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
      console.warn("TWILIO_AUTH_TOKEN missing, skipping validation (unsafe for prod)");
      return true;
  }
  if (!signature) return false;
  return twilio.validateRequest(authToken, signature, url, params);
}

async function dedupeSeen(messageSid: string) {
  if (!messageSid) return false;

  if (redis) {
    const key = `wa:dedupe:${messageSid}`;
    const exists = await redis.get(key);
    if (exists) return true;
    await redis.set(key, "1", { ex: 120 });
    return false;
  }

  const t = memDedupe.get(messageSid);
  if (t && now() - t < 120_000) return true;
  memDedupe.set(messageSid, now());
  return false;
}

async function getSession(userKey: string): Promise<Session> {
  if (redis) {
    const key = `wa:sess:${userKey}`;
    const s = await redis.get<Session>(key);
    if (s) return s;
    const fresh: Session = { state: "HOME", updatedAt: now() };
    await redis.set(key, fresh, { ex: 60 * 30 });
    return fresh;
  }
  const s = memSessions.get(userKey);
  if (s) return s;
  const fresh: Session = { state: "HOME", updatedAt: now() };
  memSessions.set(userKey, fresh);
  return fresh;
}

async function setSession(userKey: string, session: Session) {
  session.updatedAt = now();
  if (redis) {
    const key = `wa:sess:${userKey}`;
    await redis.set(key, session, { ex: 60 * 30 });
    return;
  }
  memSessions.set(userKey, session);
}

// --- HANDLER ---

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: tenantSlug } = await params;

  try {
    const raw = await req.text();
    const urlParams = new URLSearchParams(raw);

    const from = urlParams.get("From") || "";
    const bodyRaw = urlParams.get("Body") || "";
    const body = normalizeBody(bodyRaw);
    const messageSid = urlParams.get("MessageSid") || "";
    const signature = req.headers.get("x-twilio-signature");

    const paramsObj: Record<string, string> = {};
    urlParams.forEach((v, k) => (paramsObj[k] = v));

    const url = buildPublicUrl(req, tenantSlug);

    // Validate Signature
    if (process.env.NODE_ENV === 'production' && process.env.TWILIO_AUTH_TOKEN) {
        if (!validateTwilioSignature(paramsObj, url, signature)) {
            console.warn(`[WA ${tenantSlug}] Invalid Signature`, { url, from });
            return new Response(twiml("Unauthorized"), { status: 403, headers: { "Content-Type": "text/xml" } });
        }
    }

    // Deduplicate
    if (await dedupeSeen(messageSid)) {
        return new Response(twiml(""), { status: 200, headers: { "Content-Type": "text/xml" } });
    }

    // Fetch Tenant Context
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        include: {
            services: true,
            integrations: true
        }
    });

    if (!tenant) {
        console.warn(`[WA ${tenantSlug}] Tenant not found`);
        return new Response(twiml("Error: Clínica no encontrada."), { status: 404, headers: { "Content-Type": "text/xml" } });
    }

    // Bot Settings
    const botConfig = tenant.integrations.find(i => i.type === 'bot_settings')?.config;
    const botSettings = botConfig ? JSON.parse(botConfig) : undefined;

    // Get Session
    const userKey = `turnero:${tenantSlug}:${from}`;
    const session = await getSession(userKey);

    console.log(`[WA ${tenantSlug}]`, { from, body: bodyRaw, state: session.state });

    // Handle Logic
    const { reply, session: nextSession } = await handleMessage(body, session, {
        tenantName: tenant.name,
        services: tenant.services.length > 0 ? tenant.services : undefined,
        botSettings
    });

    // Save Session
    await setSession(userKey, nextSession);

    return new Response(twiml(reply), { status: 200, headers: { "Content-Type": "text/xml" } });

  } catch (err) {
      console.error("Webhook Error:", err);
      return new Response(twiml("Error interno"), { status: 500, headers: { "Content-Type": "text/xml" } });
  }
}
