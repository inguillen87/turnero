import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { tenant: string } }
) {
  const { tenant } = params;

  // 1. Find Tenant
  const t = await prisma.tenant.findUnique({
    where: { slug: tenant },
  });

  if (!t) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  // 2. Fetch Appointments
  const appointments = await prisma.appointment.findMany({
    where: { tenantId: t.id },
    include: {
      customer: true,
      service: true,
      professional: true,
    },
    orderBy: { startAt: 'asc' },
  });

  // Flatten for UI
  const flat = appointments.map((a) => ({
    id: a.id,
    startAt: a.startAt.toISOString(),
    endAt: a.endAt.toISOString(),
    status: a.status.toLowerCase(),
    clientName: a.customer?.name || 'Walk-in',
    service: { name: a.service?.name, price: a.service?.priceCents ? a.service.priceCents / 100 : 0 },
    professional: { name: a.professional?.name },
    notes: a.notes,
  }));

  return NextResponse.json(flat);
}

export async function POST(
  req: Request,
  { params }: { params: { tenant: string } }
) {
  const body = await req.json();
  const { tenant: slug } = params;

  // 1. Find Tenant
  const t = await prisma.tenant.findUnique({ where: { slug } });
  if (!t) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  // 2. Find or Create Customer (Simplified)
  // In real life, we check by phone/email.
  let customer;
  if (body.clientName) {
     // Check if exists by name (very naive, use phone ideally)
     const existing = await prisma.customer.findFirst({ where: { tenantId: t.id, name: body.clientName } });
     if (existing) customer = existing;
     else {
       customer = await prisma.customer.create({
         data: {
           tenantId: t.id,
           name: body.clientName,
           phone: body.clientPhone,
         }
       });
     }
  }

  // 3. Find Service/Pro (Use defaults or find from name for demo)
  let service = await prisma.service.findFirst({ where: { tenantId: t.id, name: { contains: body.serviceName || 'Consulta' } } });
  if (!service) service = await prisma.service.findFirst({ where: { tenantId: t.id } }); // Fallback

  let pro = await prisma.professional.findFirst({ where: { tenantId: t.id } }); // Fallback

  if (!customer || !service || !pro) {
      return NextResponse.json({ error: 'Missing demo data references (customer/service/pro)' }, { status: 400 });
  }

  // 4. Create Appointment
  const appt = await prisma.appointment.create({
    data: {
      tenantId: t.id,
      customerId: customer.id,
      serviceId: service.id,
      professionalId: pro.id,
      startAt: new Date(body.startAt || Date.now()),
      endAt: new Date(new Date(body.startAt || Date.now()).getTime() + service.durationMin * 60000),
      status: 'CONFIRMED',
      notes: 'Creado desde WhatsApp Demo',
    },
    include: {
        service: true,
        professional: true,
        customer: true,
    }
  });

  return NextResponse.json({
      id: appt.id,
      startAt: appt.startAt,
      clientName: appt.customer.name,
      status: appt.status.toLowerCase(),
      service: { name: appt.service.name },
  }, { status: 201 });
}
