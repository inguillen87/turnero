import { NextResponse } from "next/server";
import { subscribeTenantEvents } from "@/lib/realtime";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;

  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const ping = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`));
      }, 15000);

      const unsubscribe = subscribeTenantEvents(tenant, (event) => {
        controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(event)}\n\n`));
      });

      controller.enqueue(
        encoder.encode(
          `event: ready\ndata: ${JSON.stringify({ ok: true, tenant, connectedAt: new Date().toISOString() })}\n\n`
        )
      );

      cleanup = () => {
        clearInterval(ping);
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
