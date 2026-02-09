import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;

  // 1. Find Tenant
  const t = await prisma.tenant.findUnique({
    where: { slug: tenant },
  });

  if (!t) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  // 2. Fetch Services
  const services = await prisma.service.findMany({
    where: { tenantId: t.id },
  });

  return NextResponse.json(services);
}
