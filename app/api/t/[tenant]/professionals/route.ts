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

  // 2. Fetch Professionals
  const pros = await prisma.professional.findMany({
    where: { tenantId: t.id },
  });

  return NextResponse.json(pros);
}
