export const runtime = "nodejs";

import twilio from "twilio";
import { Redis } from "@upstash/redis";
import { analyzeMessage } from "@/lib/ai";
import { DEFAULT_SERVICES, Session, handleMessage } from "@/lib/bot/stateMachine";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Fallback memory store if Redis fails or isn't set
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
    .replace(/\"/g, "&quot;")
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

function buildPublicUrl(req: Request) {
  // Allow overriding the URL via env var for "bulletproof" signature validation in Prod
  if (process.env.NEXT_PUBLIC_APP_URL) {
      return `${process.env.NEXT_PUBLIC_APP_URL}`; // Should include /api/webhooks/twilio if configured that way, or we append it
  }

  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}${requestUrl.pathname}`;
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

async function aiRouteToCommand(bodyRaw: string, session: Session): Promise<string> {
  const clean = normalizeBody(bodyRaw);
  const alreadyStructured = ["1", "2", "3", "4", "5", "9", "0", "hola", "menu", "menú"].includes(clean);
  if (alreadyStructured) return clean;

  const ai = await analyzeMessage(bodyRaw, {
    services: DEFAULT_SERVICES.map((s) => ({ id: s.id, name: s.name, priceCents: s.price * 100 })),
    conversationHistory: [],
    now: new Date(),
    tenantName: process.env.APP_NAME || "Turnero Pro",
    locale: "es",
  });

  if (ai.intent === "booking") return session.state === "CONFIRM" ? "1" : "1";
  if (ai.intent === "query_prices") return "2";
  if (ai.intent === "cancellation") return "3";
  if (ai.intent === "handoff") return "5";
  if (ai.intent === "confirmation") return session.state === "CONFIRM" ? "1" : clean;
  if (ai.intent === "other") return clean;

  return ai.message ? clean : clean;
}

// --- HANDLER ---

export async function handleTwilioWebhook(req: Request) {
  try {
    const raw = await req.text();
    const params = new URLSearchParams(raw);

    const from = params.get("From") || "";
    const bodyRaw = params.get("Body") || "";
    const messageSid = params.get("MessageSid") || "";

    const url = buildPublicUrl(req);
    const signature = req.headers.get("x-twilio-signature");

    const paramsObj: Record<string, string> = {};
    params.forEach((v, k) => (paramsObj[k] = v));

    // Validate Signature
    if (process.env.NODE_ENV === 'production' && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const valid = validateTwilioSignature(paramsObj, url, signature);
            if (!valid) {
                console.warn("[WA TURNERO] Firma Twilio inválida", { url, from, signature });
                return new Response(twiml("Unauthorized"), { status: 403, headers: { "Content-Type": "text/xml" } });
            }
        } catch (e: any) {
            console.error("[WA TURNERO] Error validación Twilio:", e?.message || e);
            return new Response(twiml("Server misconfigured"), { status: 500, headers: { "Content-Type": "text/xml" } });
        }
      } catch (e: any) {
        console.error("[WA TURNERO] Error validación Twilio:", e?.message || e);
        return new Response(twiml("Server misconfigured"), { status: 500, headers: { "Content-Type": "text/xml" } });
      }
    }

    if (await dedupeSeen(messageSid)) {
        console.log("[WA TURNERO] Mensaje duplicado ignorado", messageSid);
        return new Response(twiml(""), { status: 200, headers: { "Content-Type": "text/xml" } });
    }

    const userKey = `turnero:${from}`;
    const session = await getSession(userKey);
    const routedBody = await aiRouteToCommand(bodyRaw, session);

    console.log("[WA TURNERO]", { from, body: bodyRaw, routedBody, state: session.state });

    // Handle Logic
    const { reply, session: nextSession } = await handleMessage(body, session);

    await setSession(userKey, nextSession);

    return new Response(twiml(reply), { status: 200, headers: { "Content-Type": "text/xml" } });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response(twiml("Error interno"), { status: 500, headers: { "Content-Type": "text/xml" } });
  }
}

export async function GET(req: Request) {
  return new Response("OK /api/webhooks/twilio (WhatsApp Webhook Active)", { status: 200, headers: { "Content-Type": "text/plain" } });
}
