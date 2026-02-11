import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Use environment variables
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || "mock_token";
const MP_PREAPPROVAL_PLAN_ID = process.env.MERCADOPAGO_PREAPPROVAL_PLAN_ID || "03d3ce9b7aff4c53913c4dd13dde907d";
const APP_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function POST(req: NextRequest, { params }: { params: { tenant: string } }) {
  try {
    const tenantSlug = params.tenant;

    // Auth check should be here (session)

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: { users: { include: { user: true } } }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get Admin Email
    const adminUser = tenant.users.find(u => u.role === "OWNER" || u.role === "ADMIN")?.user;
    const payerEmail = adminUser?.email || "billing@turnero.com";

    // Mark as PENDING before redirecting
    await prisma.tenant.update({
        where: { id: tenant.id },
        data: { planStatus: "PENDING" }
    });

    // MOCK MP CALL (Simulated for Dev/Test)
    // In production, uncomment the fetch below and remove the simulated response

    /*
    const r = await fetch("https://api.mercadopago.com/preapproval", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            preapproval_plan_id: MP_PREAPPROVAL_PLAN_ID,
            payer_email: payerEmail,
            external_reference: tenant.id,
            reason: "Turnero Enterprise Subscription",
            back_url: `${APP_BASE_URL}/t/${tenantSlug}/settings?status=success`
        })
    });

    if (!r.ok) {
        const err = await r.text();
        await prisma.tenant.update({ where: { id: tenant.id }, data: { planStatus: "DEMO" } });
        return NextResponse.json({ error: err }, { status: 400 });
    }
    const data = await r.json();
    const initPoint = data.init_point;
    const preapprovalId = data.id;
    */

    // SIMULATED RESPONSE
    const mockInitPoint = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${MP_PREAPPROVAL_PLAN_ID}&external_reference=${tenant.id}`;
    const mockPreapprovalId = "pending_mock_" + Date.now();

    // Store preapproval ID
    await prisma.tenant.update({
        where: { id: tenant.id },
        data: { mpPreapprovalId: mockPreapprovalId }
    });

    return NextResponse.json({ init_point: mockInitPoint });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
