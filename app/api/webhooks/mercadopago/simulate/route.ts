import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// MOCK: This route simulates receiving a legitimate MercadoPago webhook
// and updating the tenant status. Useful for testing/demo without public URL.

export async function POST(req: NextRequest) {
  try {
    const { tenantId, type, status, id } = await req.json();

    if (!tenantId || !type || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify Tenant exists
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    if (type === "subscription_preapproval" && status === "authorized") {
        // Upgrade Logic
        await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                plan: "enterprise",
                planStatus: "active",
                mpSubscriptionId: id || "mock-sub-id",
                planActivatedAt: new Date(),
                planRenewsAt: new Date(new Date().setDate(new Date().getDate() + 30)) // +30 days
            }
        });

        console.log(`Tenant ${tenant.slug} upgraded to ENTERPRISE via mock webhook.`);
        return NextResponse.json({ success: true, message: "Tenant upgraded" });
    }

    return NextResponse.json({ message: "No action taken" });

  } catch (error) {
    console.error("Simulation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
