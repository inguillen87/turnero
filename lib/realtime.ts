import { EventEmitter } from "events";
import { Redis } from "@upstash/redis";

export type TenantRealtimeEvent = {
  seq: number;
  type: "appointment.created" | "appointment.cancelled" | "delay.alert" | "payment.received" | "whatsapp.message";
  title: string;
  body: string;
  createdAt: string;
};

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

const EVENT_LOG_LIMIT = Number(process.env.REALTIME_EVENT_LOG_LIMIT || 300);
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const localSeq = new Map<string, number>();
const localBacklog = new Map<string, TenantRealtimeEvent[]>();

function channel(tenantSlug: string) {
  return `tenant:${tenantSlug}`;
}

function logKey(tenantSlug: string) {
  return `realtime:events:${tenantSlug}`;
}

function seqKey(tenantSlug: string) {
  return `realtime:seq:${tenantSlug}`;
}

function nextLocalSeq(tenantSlug: string) {
  const current = localSeq.get(tenantSlug) || 0;
  const next = current + 1;
  localSeq.set(tenantSlug, next);
  return next;
}

function pushLocalBacklog(tenantSlug: string, event: TenantRealtimeEvent) {
  const existing = localBacklog.get(tenantSlug) || [];
  const next = [...existing, event].slice(-EVENT_LOG_LIMIT);
  localBacklog.set(tenantSlug, next);
}

async function withRetry<T>(task: () => Promise<T>, retries = 3): Promise<T> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < retries) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      attempt += 1;
      await new Promise((r) => setTimeout(r, 50 * attempt));
    }
  }
  throw lastError;
}

export function publishTenantEvent(
  tenantSlug: string,
  event: Omit<TenantRealtimeEvent, "createdAt" | "seq"> & { createdAt?: string }
) {
  void (async () => {
    const base = {
      type: event.type,
      title: event.title,
      body: event.body,
      createdAt: event.createdAt ?? new Date().toISOString(),
    } as const;

    if (redis) {
      try {
        const seq = await withRetry(() => redis.incr(seqKey(tenantSlug)));
        const payload: TenantRealtimeEvent = { ...base, seq };

        await withRetry(async () => {
          await redis.rpush(logKey(tenantSlug), JSON.stringify(payload));
          await redis.ltrim(logKey(tenantSlug), -EVENT_LOG_LIMIT, -1);
        });

        emitter.emit(channel(tenantSlug), payload);
        return;
      } catch (error) {
        console.error("[realtime] redis publish failed, falling back to in-memory", error);
      }
    }

    const payload: TenantRealtimeEvent = { ...base, seq: nextLocalSeq(tenantSlug) };
    pushLocalBacklog(tenantSlug, payload);
    emitter.emit(channel(tenantSlug), payload);
  })();
}

export function subscribeTenantEvents(tenantSlug: string, handler: (event: TenantRealtimeEvent) => void) {
  const key = channel(tenantSlug);
  emitter.on(key, handler);
  return () => emitter.off(key, handler);
}

export async function fetchTenantEventsSince(tenantSlug: string, sinceSeq: number, limit = 50) {
  if (redis) {
    try {
      const rows = await withRetry(() => redis.lrange<string>(logKey(tenantSlug), -EVENT_LOG_LIMIT, -1));
      const parsed = rows
        .map((r) => {
          try {
            return JSON.parse(r) as TenantRealtimeEvent;
          } catch {
            return null;
          }
        })
        .filter((e): e is TenantRealtimeEvent => Boolean(e))
        .filter((e) => e.seq > sinceSeq)
        .slice(0, limit);
      return parsed;
    } catch (error) {
      console.error("[realtime] redis backlog fetch failed, using in-memory", error);
    }
  }

  return (localBacklog.get(tenantSlug) || []).filter((e) => e.seq > sinceSeq).slice(0, limit);
}
