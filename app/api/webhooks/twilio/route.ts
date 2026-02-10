import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BotEngine } from "@/lib/bot/engine";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const To = formData.get("To") as string;
    const From = formData.get("From") as string;
    const Body = formData.get("Body") as string;
    const ProfileName = formData.get("ProfileName") as string;

    if (!From || !Body) {
      return new NextResponse("Missing From or Body", { status: 400 });
    }

    const phone = From.replace("whatsapp:", "");
    const messageBody = Body.trim();

    // 1. Identify Tenant
    let tenant: any;

    // Strategy A: Sandbox (Development)
    // If receiving on the Sandbox Number, we might map by "From" or just pick a default "Demo Tenant".
    const SANDBOX_NUMBER = "whatsapp:+14155238886";

    if (To === SANDBOX_NUMBER) {
       // Check if this user (From) has an active session with a specific tenant?
       // For simplicity in this demo, we always route to the "Demo Clinic".
       tenant = await prisma.tenant.findUnique({
           where: { slug: "demo-clinica" },
           include: { services: true }
       });

       // Fallback if demo tenant doesn't exist yet (first run)
       if (!tenant) {
           tenant = await prisma.tenant.findFirst({
               where: { status: "active" },
               include: { services: true }
           });
       }
    } else {
       // Strategy B: Production (By To Number)
       const channel = await prisma.channel.findFirst({
           where: { toAddress: To, isActive: true, provider: "twilio_whatsapp" },
           include: { tenant: { include: { services: true } } }
       });
       if (channel) {
           tenant = channel.tenant;
       }
    }

    if (!tenant) {
       console.error(`No tenant found for To: ${To}`);
       return new NextResponse(
         `<?xml version="1.0" encoding="UTF-8"?><Response><Message>System Error: This number is not configured for any clinic.</Message></Response>`,
         { headers: { "Content-Type": "text/xml" } }
       );
    }

    // 2. Find or Create Customer
    let customer = await prisma.customer.findFirst({
      where: {
        phone: phone,
        tenantId: tenant.id
      }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          tenantId: tenant.id,
          phone: phone,
          name: ProfileName || "New Customer",
          metadata: JSON.stringify({ state: "IDLE" })
        }
      });
    }

    // 3. Log Incoming Message
    await prisma.message.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        direction: "inbound",
        channel: "whatsapp",
        body: messageBody,
        status: "received"
      }
    });

    // 4. Run Bot Engine
    const engine = new BotEngine(tenant, customer);
    const replyText = await engine.processMessage(messageBody);

    // 5. Log Outgoing Message
    await prisma.message.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        direction: "outbound",
        channel: "whatsapp",
        body: replyText,
        status: "sent"
      }
    });

    // 6. Return TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyText}</Message></Response>`;

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" }
    });

  } catch (error) {
    console.error("Twilio Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
