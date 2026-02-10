import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeMessage, AIResponse } from "@/lib/ai";
import { createPaymentPreference } from "@/lib/mercadopago";

interface CustomerMetadata {
  temp_service_id?: string;
  temp_slot?: string; // ISO String
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const From = formData.get("From") as string;
    const Body = formData.get("Body") as string;
    const ProfileName = formData.get("ProfileName") as string;

    if (!From || !Body) {
      return new NextResponse("Missing From or Body", { status: 400 });
    }

    const phone = From.replace("whatsapp:", "");
    const messageBody = Body.trim();

    // 1. Identify Tenant
    const tenant = await prisma.tenant.findFirst({
      where: { status: "active" },
      include: { services: true }
    });

    if (!tenant) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>System Error: No active tenant found.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // 2. Find or Create Customer
    let customer = await prisma.customer.findFirst({
      where: { phone: phone, tenantId: tenant.id }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          tenantId: tenant.id,
          phone: phone,
          name: ProfileName || "New Customer",
          metadata: JSON.stringify({})
        }
      });
    }

    // 3. Load Conversation History (Last 10)
    const history = await prisma.message.findMany({
      where: { customerId: customer.id, tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Convert to AI format (reverse to be chronological)
    const conversationHistory = history.reverse().map(m => ({
      role: m.direction === 'inbound' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: m.body
    }));

    // 4. AI Analysis
    const aiResponse = await analyzeMessage(messageBody, {
      services: tenant.services,
      conversationHistory,
      now: new Date()
    });

    let replyMessage = aiResponse.message;
    let metadata: CustomerMetadata = customer.metadata ? JSON.parse(customer.metadata) : {};

    // 5. Handle Intents Logic
    if (aiResponse.intent === 'booking' && aiResponse.entities) {
      // If we have a service, date, and time, we can propose a slot
      if (aiResponse.entities.serviceName) {
        // Find service by fuzzy name or just pick first if ambiguous (simple logic for now)
        const name = aiResponse.entities.serviceName;
        const service = tenant.services.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
        if (service) metadata.temp_service_id = service.id;
      }

      if (aiResponse.entities.date && aiResponse.entities.time) {
         // User provided specific slot
         const dateStr = aiResponse.entities.date; // YYYY-MM-DD
         const timeStr = aiResponse.entities.time; // HH:mm

         const startAt = new Date(`${dateStr}T${timeStr}:00`);

         // Mock Availability Check
         const hour = startAt.getHours();
         if (hour >= 9 && hour <= 18) {
             metadata.temp_slot = startAt.toISOString();
             replyMessage = `✅ Disponible: ${dateStr} a las ${timeStr} para ${aiResponse.entities.serviceName || 'el servicio'}. \n\nResponde "SI" para confirmar.`;
         } else {
             replyMessage = `❌ El horario ${timeStr} no está disponible. Estamos abiertos de 9 a 18.`;
         }
      }
    }

    if (aiResponse.intent === 'confirmation') {
        if (metadata.temp_slot && metadata.temp_service_id) {
             const startAt = new Date(metadata.temp_slot);
             const service = tenant.services.find(s => s.id === metadata.temp_service_id);

             // Create Professional (Mock)
             let professional = await prisma.professional.findFirst({ where: { tenantId: tenant.id }});
             if (!professional) {
                professional = await prisma.professional.create({
                    data: { tenantId: tenant.id, name: "Demo Staff", active: true }
                });
             }

             const endAt = new Date(startAt.getTime() + (service?.durationMin || 60) * 60000);

             // Create Appointment
             const appointment = await prisma.appointment.create({
                 data: {
                     tenantId: tenant.id,
                     customerId: customer.id,
                     professionalId: professional.id,
                     serviceId: metadata.temp_service_id!,
                     startAt,
                     endAt,
                     status: "CONFIRMED",
                     source: "WHATSAPP_AI",
                     priceCents: service?.priceCents,
                     paymentStatus: "PENDING"
                 }
             });

             // Generate Payment Link
             let paymentLinkMsg = "";
             if (service && service.priceCents > 0) {
                 const link = await createPaymentPreference(
                     [{ title: service.name, unit_price: service.priceCents / 100, quantity: 1 }],
                     { email: customer.email || "test@user.com" },
                     appointment.id
                 );
                 if (link) {
                     await prisma.appointment.update({
                         where: { id: appointment.id },
                         data: { paymentLink: link }
                     });
                     paymentLinkMsg = `\n\n💳 Paga tu seña aquí para asegurar el turno: ${link}`;
                 }
             }

             replyMessage = `¡Turno confirmado! 🗓️ ${startAt.toLocaleString()} - ${service?.name}.${paymentLinkMsg}`;

             // Clear temp metadata
             delete metadata.temp_slot;
             delete metadata.temp_service_id;
        } else {
            replyMessage = "No encontré ningún turno pendiente de confirmación. ¿Qué te gustaría reservar?";
        }
    }

    // 6. Log Incoming Message
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

    // 7. Log Outgoing Message
    await prisma.message.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        direction: "outbound",
        channel: "whatsapp",
        body: replyMessage,
        status: "sent"
      }
    });

    // 8. Update Customer Metadata
    await prisma.customer.update({
        where: { id: customer.id },
        data: { metadata: JSON.stringify(metadata) }
    });

    // 9. Return TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`;

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" }
    });

  } catch (error) {
    console.error("Twilio Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
