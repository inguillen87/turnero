import { NextResponse } from "next/server";
import { fetchTenantEventsSince, subscribeTenantEvents } from "@/lib/realtime";

export const runtime = "nodejs";

function parseLastEventId(req: Request) {
  const raw = req.headers.get("last-event-id") || "0";
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;

  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let cursor = parseLastEventId(req);

      const sendEvent = (event: { seq: number; [k: string]: unknown }) => {
        if (event.seq <= cursor) return;
        cursor = event.seq;
        controller.enqueue(encoder.encode(`id: ${event.seq}\nevent: message\ndata: ${JSON.stringify(event)}\n\n`));
      };

      const syncBacklog = async () => {
        const pending = await fetchTenantEventsSince(tenant, cursor, 50);
        for (const item of pending) sendEvent(item);
      };

      void syncBacklog();

      const poll = setInterval(() => {
        void syncBacklog();
      }, 2000);

      const ping = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: ${JSON.stringify({ ts: Date.now(), cursor })}\n\n`));
      }, 15000);

      const unsubscribe = subscribeTenantEvents(tenant, (event) => {
        sendEvent(event);
      });

      controller.enqueue(
        encoder.encode(
          `event: ready\ndata: ${JSON.stringify({ ok: true, tenant, connectedAt: new Date().toISOString(), cursor })}\n\n`
        )
      );

      cleanup = () => {
        clearInterval(ping);
        clearInterval(poll);
        unsubscribe();
      };
    },
    cancel() {
      cleanup();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
