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

    /*
      const tenantId = sub.external_reference;
      const status = sub.status; // "authorized"

      const planStatus = status === "authorized" || status === "active" ? "ACTIVE" : ...;

      await prisma.tenant.update(...)
    */

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("MP Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
