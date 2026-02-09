import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTenantBySlug } from '@/lib/tenant';

// This is the "Brain" of the Demo Chat
export async function POST(req: Request) {
  const { tenantSlug, text, lang } = await req.json();

  let response = {
    messages: [] as any[],
    action: null as any
  };

  const normalizedText = text.toLowerCase();

  // 1. Get Tenant Context
  const tenant = await getTenantBySlug(tenantSlug || 'demo-clinica');
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  // 2. Logic / State Machine
  // "hola" -> menu
  if (normalizedText.includes('hola') || normalizedText.includes('hi')) {
    response.messages.push({
      from: 'bot',
      body: '¡Hola! 👋 Soy el asistente virtual de Turnero Pro. ¿En qué puedo ayudarte hoy?',
      options: [
        { label: '📅 Reservar Turno', value: 'book' },
        { label: '❓ Consultar Precios', value: 'prices' }
      ]
    });
  }
  // "prices" -> list services
  else if (normalizedText === 'prices' || normalizedText.includes('precio')) {
     const services = await prisma.service.findMany({ where: { tenantId: tenant.id }, take: 3 });
     const list = services.map(s => `• ${s.name}: $${s.priceCents/100}`).join('\n');
     response.messages.push({
       from: 'bot',
       body: `Aquí tienes nuestros precios:\n${list}\n\n¿Te gustaría agendar?`,
       options: [{ label: '📅 Reservar Turno', value: 'book' }]
     });
  }
  // "book" -> ask service
  else if (normalizedText === 'book' || normalizedText.includes('turno') || normalizedText.includes('reserva')) {
    const services = await prisma.service.findMany({ where: { tenantId: tenant.id }, take: 3 });
    const options = services.map(s => ({ label: s.name, value: s.id })); // value is ID here, but let's keep it simple for demo

    response.messages.push({
      from: 'bot',
      body: 'Perfecto. ¿Qué servicio estás buscando?',
      options: options.map(o => ({ label: o.label, value: 'service_' + o.label })) // Prefix to detect state
    });
  }
  // "service_X" -> ask time
  else if (normalizedText.startsWith('service_') || normalizedText.includes('corte') || normalizedText.includes('manicura')) {
    const serviceName = normalizedText.replace('service_', '');
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
    response.messages.push({
      from: 'bot',
      body: '¡Listo! Tu turno ha sido confirmado. Te enviamos un recordatorio por WhatsApp un día antes. Gracias por elegirnos.'
    });

    // Determine start time based on mock selection
    const startAt = new Date();
    startAt.setDate(startAt.getDate() + 1); // Tomorrow default
    startAt.setHours(10, 0, 0, 0);

    // Create real record in DB via direct Prisma call (since we are server-side)
    // Find customer (demo)
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
    }
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
}
