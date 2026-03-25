import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenantAccess } from '@/lib/tenant-access';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;

  const access = await resolveTenantAccess({ slug, allowDemoRead: true });
  if ('error' in access) return access.error;

  const services = await prisma.service.findMany({
    where: { tenantId: access.tenant.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(services);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoWrite: true, allowDemoRead: true });
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => null) as { name?: string; durationMin?: number; price?: number; active?: boolean } | null;
  const name = body?.name?.trim();
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      tenantId: access.tenant.id,
      name,
      durationMin: Math.max(5, Number(body?.durationMin) || 30),
      price: body?.price == null ? null : Math.max(0, Number(body.price) || 0),
      active: body?.active ?? true,
      currency: access.tenant.currency || 'ARS',
    },
  });

  return NextResponse.json(service, { status: 201 });
}
