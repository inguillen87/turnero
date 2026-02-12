import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Idempotency Key
    const resourceId = payload?.data?.id || payload?.id || payload?.resource || null;
    const type = payload?.type || payload?.topic;

    if (!resourceId) {
        return NextResponse.json({ ok: true });
    }

    // Check if processed
    const already = await prisma.webhookEvent.findUnique({
        where: { eventKey: String(resourceId) }
    });
    if (already) {
        return NextResponse.json({ ok: true });
    }

    await prisma.webhookEvent.create({
        data: { provider: "mercadopago", eventKey: String(resourceId) }
    });

    console.log(`Processing MP Subscription Webhook: ${type} - ${resourceId}`);

    // In production: Fetch details from MP
    // const r = await fetch(`https://api.mercadopago.com/preapproval/${resourceId}`, { ... });
    // const sub = await r.json();

    // MOCK SIMULATION FOR DEV ENV
    // We assume if we receive a valid simulation payload, we update.
    // For real MP, the logic is:
    /*
      const tenantId = sub.external_reference;
      const status = sub.status; // "authorized"

      const planStatus = status === "authorized" || status === "active" ? "ACTIVE" : ...;

      await prisma.tenant.update(...)
    */

    // Since we cannot receive real MP callbacks here, we rely on the simulation logic below or just log.
    // However, if we assume the simulation route calls THIS endpoint, we need to handle the mock payload structure.

    // If simulation sends { tenantId, status } in payload directly:
    if (payload.mock_simulation && payload.tenantId && payload.status) {
        const planStatus = payload.status === "authorized" ? "ACTIVE" : "PENDING";
        await prisma.tenant.update({
            where: { id: payload.tenantId },
            data: {
                planStatus,
                plan: "enterprise",
                mpPreapprovalId: resourceId,
                planActivatedAt: planStatus === "ACTIVE" ? new Date() : undefined
            }
        });
        console.log(`Tenant ${payload.tenantId} updated to ${planStatus}`);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("MP Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
