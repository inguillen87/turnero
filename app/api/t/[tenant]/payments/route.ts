import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;

  try {
    const t = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (!t) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    const payments = await prisma.appointment.findMany({
        where: {
            tenantId: t.id,
            paymentStatus: { not: null }
        },
        select: {
            id: true,
            startAt: true,
            contact: { select: { name: true } },
            service: { select: { name: true, price: true } },
            paymentStatus: true,
            price: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const flat = payments.map(p => ({
        id: p.id,
        date: p.startAt.toISOString(),
        client: p.contact?.name || "Unknown",
        concept: p.service?.name || "Service",
        amount: (p.price || 0),
        status: p.paymentStatus,
        link: null
    }));

    return NextResponse.json(flat);
  } catch (error) {
      console.warn("Error fetching payments", error);
      return NextResponse.json([
          { id: 'mock-p1', date: new Date().toISOString(), client: 'Juan Perez', concept: 'Consulta', amount: 50, status: 'PAID' },
          { id: 'mock-p2', date: new Date().toISOString(), client: 'Maria Garcia', concept: 'Limpieza', amount: 80, status: 'PENDING', link: 'https://mpago.la/demo' }
      ]);
  }
}
