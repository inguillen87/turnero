import { EventEmitter } from "events";

export type TenantRealtimeEvent = {
  type: "appointment.created" | "payment.received" | "whatsapp.message";
  title: string;
  body: string;
  createdAt: string;
};

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

function channel(tenantSlug: string) {
  return `tenant:${tenantSlug}`;
}

export function publishTenantEvent(tenantSlug: string, event: Omit<TenantRealtimeEvent, "createdAt"> & { createdAt?: string }) {
  emitter.emit(channel(tenantSlug), {
    ...event,
    createdAt: event.createdAt ?? new Date().toISOString(),
  } satisfies TenantRealtimeEvent);
}

export function subscribeTenantEvents(tenantSlug: string, handler: (event: TenantRealtimeEvent) => void) {
  const key = channel(tenantSlug);
  emitter.on(key, handler);
  return () => emitter.off(key, handler);
}
