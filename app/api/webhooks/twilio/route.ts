import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Simple state machine states
type ConversationState = "IDLE" | "SELECT_SERVICE" | "SELECT_SLOT" | "CONFIRM_BOOKING";

interface CustomerMetadata {
  state: ConversationState;
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

    // 1. Identify Tenant (For demo, pick first active tenant)
    // In a real app, we'd look up by the 'To' number or a mapping table
    const tenant = await prisma.tenant.findFirst({
      where: { status: "active" },
      include: { services: true }
    });

    // Fallback if no tenant exists (should not happen in real app)
    if (!tenant) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>System Error: No active tenant found.</Message></Response>`,
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

    // 3. Parse current state
    let metadata: CustomerMetadata = customer.metadata
      ? JSON.parse(customer.metadata)
      : { state: "IDLE" };

    let currentState = metadata.state || "IDLE";
    let nextState = currentState;
    let replyMessage = "";

    // 4. Log Incoming Message
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

    // 5. Bot Logic
    const lowerBody = messageBody.toLowerCase();

    // Reset command
    if (["reset", "cancelar", "inicio", "hola"].includes(lowerBody) && currentState !== "IDLE") {
        // If user says "hola" mid-flow, we reset? Or maybe "cancelar".
        // Let's reset on "cancelar" or "inicio". "hola" might be a greeting.
        if (lowerBody === "hola") {
             // Treat as reset/greeting
             nextState = "IDLE";
             metadata = { state: "IDLE" };
        } else {
             nextState = "IDLE";
             metadata = { state: "IDLE" };
             replyMessage = `Conversación reiniciada.`;
        }
    }

    // Main Switch
    if (!replyMessage) {
        switch (currentState) {
            case "IDLE":
                if (lowerBody.includes("hola") || lowerBody.includes("hi") || lowerBody.includes("start")) {
                    replyMessage = `Hola ${customer.name || ""}! Bienvenido a ${tenant.name}. ¿Qué deseas hacer hoy?\n1. Ver servicios\n2. Mis turnos`;
                } else if (lowerBody.includes("1") || lowerBody.includes("servicio")) {
                    const services = tenant.services;
                    if (services.length === 0) {
                        replyMessage = "Lo siento, no tenemos servicios configurados aún.";
                    } else {
                        replyMessage = "Nuestros servicios:\n" + services.map((s, i) => `${i + 1}. ${s.name} ($${s.priceCents/100})`).join("\n") + "\n\nResponde con el número del servicio.";
                        nextState = "SELECT_SERVICE";
                    }
                } else if (lowerBody.includes("2") || lowerBody.includes("turnos")) {
                    const appointments = await prisma.appointment.findMany({
                        where: { customerId: customer.id, status: { in: ['CONFIRMED', 'PENDING'] } },
                        include: { service: true },
                        orderBy: { startAt: 'asc' },
                        take: 3
                    });
                    if (appointments.length === 0) {
                        replyMessage = "No tienes turnos pendientes.";
                    } else {
                        replyMessage = "Tus próximos turnos:\n" + appointments.map(a => `- ${a.service.name} el ${a.startAt.toLocaleDateString()} a las ${a.startAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`).join("\n");
                    }
                    // Stay in IDLE
                } else {
                    replyMessage = `Escribe "hola" para comenzar.`;
                }
                break;

            case "SELECT_SERVICE":
                const serviceIndex = parseInt(lowerBody) - 1;
                const services = tenant.services;
                if (!isNaN(serviceIndex) && services[serviceIndex]) {
                    const selectedService = services[serviceIndex];
                    metadata.temp_service_id = selectedService.id;

                    // Mock Availability
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    // Generate 3 mock slots
                    const slots = [10, 11, 14];
                    replyMessage = `Servicio: ${selectedService.name}. Horarios disponibles para mañana:\n`;
                    slots.forEach((h, i) => {
                        replyMessage += `${i + 1}. ${tomorrow.toLocaleDateString()} ${h}:00\n`;
                    });
                    replyMessage += `\nResponde con el número de la opción.`;

                    nextState = "SELECT_SLOT";
                } else {
                    replyMessage = "Opción inválida. Por favor elige el número del servicio.";
                }
                break;

            case "SELECT_SLOT":
                const slotIndex = parseInt(lowerBody);
                if ([1, 2, 3].includes(slotIndex)) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    let hour = 10;
                    if (slotIndex === 2) hour = 11;
                    if (slotIndex === 3) hour = 14;

                    tomorrow.setHours(hour, 0, 0, 0);
                    metadata.temp_slot = tomorrow.toISOString();

                    const service = tenant.services.find(s => s.id === metadata.temp_service_id);
                    replyMessage = `Vas a agendar: ${service?.name} para el ${tomorrow.toLocaleDateString()} a las ${hour}:00.\nResponde "SI" para confirmar.`;
                    nextState = "CONFIRM_BOOKING";
                } else {
                    replyMessage = "Opción inválida. Elige 1, 2 o 3.";
                }
                break;

            case "CONFIRM_BOOKING":
                if (lowerBody === "si" || lowerBody === "confirmar" || lowerBody === "yes") {
                    if (metadata.temp_service_id && metadata.temp_slot) {
                        // Check professional
                        let professional = await prisma.professional.findFirst({ where: { tenantId: tenant.id }});

                        // If no professional, create one for demo!
                        if (!professional) {
                            professional = await prisma.professional.create({
                                data: {
                                    tenantId: tenant.id,
                                    name: "Demo Professional",
                                    active: true
                                }
                            });
                        }

                        // Create Appointment
                        const startTime = new Date(metadata.temp_slot);
                        const endTime = new Date(startTime.getTime() + 60*60*1000); // 1 hour fixed

                        await prisma.appointment.create({
                            data: {
                                tenantId: tenant.id,
                                customerId: customer.id,
                                serviceId: metadata.temp_service_id,
                                professionalId: professional.id,
                                startAt: startTime,
                                endAt: endTime,
                                status: "CONFIRMED",
                                source: "WHATSAPP"
                            }
                        });

                        replyMessage = "¡Turno confirmado! Gracias por elegirnos.";
                    } else {
                        replyMessage = "Error en los datos del turno. Escribe 'hola' para reiniciar.";
                    }
                } else {
                    replyMessage = "Reserva cancelada.";
                }
                nextState = "IDLE";
                metadata = { state: "IDLE" };
                break;
        }
    }

    // 6. Update Customer State
    await prisma.customer.update({
      where: { id: customer.id },
      data: { metadata: JSON.stringify({ ...metadata, state: nextState }) }
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

    // 8. Return TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`;

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" }
    });

  } catch (error) {
    console.error("Twilio Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
