import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTenantBySlug } from '@/lib/tenant';

export const runtime = "nodejs";

// This is the "Brain" of the Demo Chat
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenantSlug, text } = body;

    let response = {
      messages: [] as any[],
      action: null as any
    };

    const normalizedText = (text || '').toLowerCase();

    // 1. Get Tenant Context
    let tenant;
    try {
        tenant = await getTenantBySlug(tenantSlug || 'demo-clinica');
    } catch (e) {
        console.warn("Using fallback tenant for demo");
        tenant = { id: 'mock-tenant', name: 'Demo Clinic' };
    }

    if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // 2. Logic / State Machine
    // "hola" -> menu
    if (normalizedText.includes('hola') || normalizedText.includes('hi') || normalizedText === '') {
      response.messages.push({
        from: 'bot',
        body: '¡Hola! 👋 Soy el asistente virtual de Turnero Pro. ¿En qué puedo ayudarte hoy?',
        options: [
          { label: '📅 Reservar Turno', value: 'book' },
          { label: '❓ Consultar Precios', value: 'prices' },
          { label: '👤 Mi Dueño', value: 'owner' }
        ]
      });
    }
    // "owner"
    else if (normalizedText === 'owner' || normalizedText.includes('dueño')) {
        response.messages.push({
            from: 'bot',
            body: 'El dueño de la clínica es el Dr. Juan Pérez.\nPuedes contactarlo en owner@clinica.com o al +54 9 11 1234 5678.',
            options: [{ label: '🏠 Menú Principal', value: 'hola' }]
        });
    }
    // "prices" -> list services
    else if (normalizedText === 'prices' || normalizedText.includes('precio')) {
       let services = [];
       try {
           services = await prisma.service.findMany({ where: { tenantId: tenant.id }, take: 3 });
       } catch {
           services = [{ name: 'Consulta General', priceCents: 5000 }, { name: 'Limpieza', priceCents: 3000 }];
       }

       const list = services.map(s => `• ${s.name}: $${s.priceCents/100}`).join('\n');
       response.messages.push({
         from: 'bot',
         body: `Aquí tienes nuestros precios:\n${list}\n\n¿Te gustaría agendar?`,
         options: [{ label: '📅 Reservar Turno', value: 'book' }]
       });
    }
    // "book" -> ask service
    else if (normalizedText === 'book' || normalizedText.includes('turno') || normalizedText.includes('reserva')) {
      let services = [];
      try {
           services = await prisma.service.findMany({ where: { tenantId: tenant.id }, take: 3 });
      } catch {
           services = [{ id: 's1', name: 'Consulta General' }, { id: 's2', name: 'Limpieza' }];
      }

      if (services.length === 0) {
          response.messages.push({
            from: 'bot',
            body: 'Lo siento, no hay servicios configurados en este momento. Intenta más tarde.',
            options: [{ label: '🏠 Menú Principal', value: 'hola' }]
          });
      } else {
          const options = services.map(s => ({ label: s.name, value: s.id }));
          response.messages.push({
            from: 'bot',
            body: 'Perfecto. ¿Qué servicio estás buscando?',
            options: options.map(o => ({ label: o.label, value: 'service_' + o.label }))
          });
      }
    }
    // "service_X" -> ask time
    else if (normalizedText.startsWith('service_') || normalizedText.includes('corte') || normalizedText.includes('manicura')) {
      // const serviceName = normalizedText.replace('service_', '');
      response.messages.push({
        from: 'bot',
        body: `Excelente elección. ¿Para cuándo te gustaría agendar?`,
        options: [
          { label: 'Mañana 10:00', value: 'time_tomorrow_10' },
          { label: 'Mañana 16:30', value: 'time_tomorrow_16' },
          { label: 'Viernes 11:00', value: 'time_friday_11' }
        ]
      });
    }
    // "time_X" -> confirm
    else if (normalizedText.startsWith('time_')) {
      const timeLabel = normalizedText.replace('time_', '').replace('_', ' ');
      response.messages.push({
        from: 'bot',
        body: `Entendido. Confirmo turno para ${timeLabel}. ¿Es correcto?`,
        options: [
          { label: '✅ Sí, confirmar', value: 'confirm_yes' },
          { label: '❌ No, cambiar', value: 'confirm_no' }
        ]
      });
    }
    // "confirm_yes" -> create appointment
    else if (normalizedText === 'confirm_yes' || normalizedText === 'si') {

      const startAt = new Date();
      startAt.setDate(startAt.getDate() + 1); // Tomorrow default
      startAt.setHours(10, 0, 0, 0);

      try {
          // Create real record in DB via direct Prisma call (since we are server-side)
          let customer = await prisma.customer.findFirst({ where: { tenantId: tenant.id } });
          let service = await prisma.service.findFirst({ where: { tenantId: tenant.id } });
          let pro = await prisma.professional.findFirst({ where: { tenantId: tenant.id } });

          if (customer && service && pro) {
              const appt = await prisma.appointment.create({
                  data: {
                      tenantId: tenant.id,
                      customerId: customer.id,
                      serviceId: service.id,
                      professionalId: pro.id,
                      startAt,
                      endAt: new Date(startAt.getTime() + 30*60000),
                      status: 'CONFIRMED',
                      notes: 'Via WhatsApp Demo',
                  },
                  include: { customer: true, service: true }
              });

              response.action = {
                  type: 'APPOINTMENT_CREATED',
                  payload: {
                      id: appt.id,
                      clientName: appt.customer.name,
                      serviceName: appt.service.name,
                      startAt: appt.startAt.toISOString(),
                      status: 'confirmed'
                  }
              };
          } else {
             throw new Error("Missing demo data");
          }
      } catch (e) {
          console.warn("DB create failed, using mock action", e);
          response.action = {
              type: 'APPOINTMENT_CREATED',
              payload: {
                  id: 'mock-appt-new',
                  clientName: 'Demo User',
                  serviceName: 'Consulta General',
                  startAt: startAt.toISOString(),
                  status: 'confirmed'
              }
          };
      }

      response.messages.push({
        from: 'bot',
        body: '¡Listo! Tu turno ha sido confirmado. 🗓️\n\n💳 Para finalizar, por favor abona la seña en este link: https://mpago.la/demo-payment-link\n\nTe enviamos un recordatorio por WhatsApp un día antes.',
         options: [
            { label: '🏠 Menú Principal', value: 'hola' }
          ]
      });

    }
    else {
      // Default fallback
       response.messages.push({
        from: 'bot',
        body: 'No entendí eso. ¿Quieres volver al menú?',
        options: [
          { label: '🏠 Menú Principal', value: 'hola' }
        ]
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('WhatsApp Demo API Error:', error);
    // Mock response on error
    return NextResponse.json({
        messages: [{ from: 'bot', body: 'Lo siento, estoy teniendo problemas de conexión. Intenta más tarde.' }]
    });
  }
}
