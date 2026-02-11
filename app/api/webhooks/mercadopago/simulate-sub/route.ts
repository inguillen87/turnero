import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Just forward to the main webhook but wrap it as a simulation
  const { tenantId, status } = await req.json();

  if (!tenantId) return NextResponse.json({ error: "Missing tenantId" });

  // Call the webhook handler logic directly (or fetch it locally)
  // We'll fetch localhost
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
      await fetch(`${baseUrl}/api/webhooks/mercadopago/subscription`, {
          method: 'POST',
          body: JSON.stringify({
              mock_simulation: true,
              tenantId,
              status: status || "authorized",
              id: "sim_" + Date.now(),
              type: "subscription_preapproval"
          })
      });
      return NextResponse.json({ success: true });
  } catch (e) {
      return NextResponse.json({ error: "Failed to call webhook" });
  }
}
