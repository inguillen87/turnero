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

  const pros = await prisma.staff.findMany({
    where: { tenantId: access.tenant.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(pros);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoWrite: true, allowDemoRead: true });
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => null) as { name?: string; role?: string; phone?: string; active?: boolean } | null;
  const name = body?.name?.trim();

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const pro = await prisma.staff.create({
    data: {
      tenantId: access.tenant.id,
      name,
      role: body?.role?.trim() || null,
      phone: body?.phone?.trim() || null,
      active: body?.active ?? true,
    },
  });

  return NextResponse.json(pro, { status: 201 });
}
