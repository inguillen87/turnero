import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db'; // We need to re-enable prisma when backend is live

// For now, we mock it to avoid build errors if DB isn't connected
// In a real scenario, this would import the prisma client
// and fetch data based on `params.slug`

const MOCK_APPOINTMENTS = [
    {
      id: '1',
      startAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      endAt: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      clientName: 'Juan Pérez',
      status: 'confirmed',
      service: { name: 'Consulta General', price: 5000 },
      professional: { name: 'Dr. López' }
    },
    {
      id: '2',
      startAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      endAt: new Date(Date.now() + 25 * 3600 * 1000).toISOString(),
      clientName: 'Ana García',
      status: 'pending',
      service: { name: 'Limpieza Facial', price: 8000 },
      professional: { name: 'Dra. Méndez' }
    }
];

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Real Implementation:
  // const tenant = await prisma.tenant.findUnique({ where: { slug } });
  // if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  // const appointments = await prisma.appointment.findMany({ where: { tenantId: tenant.id } ... });

  // Mock Implementation for Demo:
  return NextResponse.json(MOCK_APPOINTMENTS);
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  const { slug } = params;

  // Real Implementation:
  // const tenant = await prisma.tenant.findUnique({ where: { slug } });
  // const appointment = await prisma.appointment.create({ ... });

  // Mock Implementation:
  const newAppointment = {
    id: Date.now().toString(),
    ...body,
    status: 'confirmed', // Auto-confirm for demo joy
    service: { name: body.service || 'Servicio Demo', price: 0 },
    professional: { name: 'Dr. Demo' }
  };

  return NextResponse.json(newAppointment, { status: 201 });
}
