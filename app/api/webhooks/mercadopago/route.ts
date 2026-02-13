import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publishTenantEvent } from "@/lib/realtime";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");
    const payload = await req.json().catch(() => ({}));

    if (!topic || !id) {
      return NextResponse.json({ status: "ok" });
    }

    console.log(`Received MP Webhook: ${topic} - ${id}`);

    const tenantRef =
      payload?.external_reference ||
      payload?.data?.external_reference ||
      payload?.preapproval?.external_reference ||
      null;

    if (tenantRef) {
      const tenant = await prisma.tenant.findFirst({
        where: {
          OR: [{ id: String(tenantRef) }, { slug: String(tenantRef) }],
        },
      });

      if (tenant) {
        if (topic.includes("payment") || topic.includes("merchant_order")) {
          publishTenantEvent(tenant.slug, {
            type: "payment.received",
            title: "Nuevo pago",
            body: `Se recibió una notificación de pago (${id}).`,
          });
        }

        if (topic.includes("subscription") || topic.includes("preapproval")) {
          publishTenantEvent(tenant.slug, {
            type: "payment.received",
            title: "Suscripción actualizada",
            body: `Estado de suscripción actualizado (${id}).`,
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("MP Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
