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

  const tenant = access.tenant;
  return NextResponse.json({
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    timezone: tenant.timezone,
    currency: tenant.currency,
    status: tenant.status,
    plan: tenant.plan,
    planStatus: tenant.planStatus,
    localesEnabled: tenant.localesEnabled,
    defaultLocale: tenant.defaultLocale,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoRead: true, allowDemoWrite: true });
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => null) as {
    name?: string;
    timezone?: string;
    currency?: string;
    defaultLocale?: string;
    localesEnabled?: string[];
  } | null;

  const updated = await prisma.tenant.update({
    where: { id: access.tenant.id },
    data: {
      name: body?.name?.trim() || undefined,
      timezone: body?.timezone?.trim() || undefined,
      currency: body?.currency?.trim()?.toUpperCase() || undefined,
      defaultLocale: body?.defaultLocale?.trim() || undefined,
      localesEnabled: Array.isArray(body?.localesEnabled) ? JSON.stringify(body?.localesEnabled) : undefined,
    },
  });

  return NextResponse.json({ ok: true, tenant: updated });
}
