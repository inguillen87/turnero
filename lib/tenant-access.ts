import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

import { isDemoTenantStatus, isSuperAdminRole, isWriteMembershipRole } from '@/lib/tenant-access-rules';

export type ResolveOptions = {
  slug: string;
  requireWrite?: boolean;
  allowDemoRead?: boolean;
  allowDemoWrite?: boolean;
};

type TenantLike = {
  id: string;
  slug: string;
  status: string;
  name?: string;
  timezone?: string;
  currency?: string;
  plan?: string;
  planStatus?: string;
  localesEnabled?: string | null;
  defaultLocale?: string | null;
};

function buildDemoFallbackTenant(slug: string): TenantLike {
  return {
    id: `demo-fallback:${slug}`,
    slug,
    status: 'DEMO',
    name: 'Demo Tenant',
    timezone: 'America/Argentina/Buenos_Aires',
    currency: 'ARS',
    plan: 'demo',
    planStatus: 'DEMO',
    localesEnabled: JSON.stringify(['es-AR']),
    defaultLocale: 'es-AR',
  };
}

export async function resolveTenantAccess({
  slug,
  requireWrite = false,
  allowDemoRead = false,
  allowDemoWrite = false,
}: ResolveOptions) {
  const session = await getServerSession(authOptions);

  const userId = (session?.user as any)?.id as string | undefined;
  const globalRole = (session?.user as any)?.role as string | undefined;

  let tenant: TenantLike | null = null;
  let membership: { role?: string | null } | null = null;

  try {
    tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) {
      return { error: NextResponse.json({ error: 'Tenant not found' }, { status: 404 }) };
    }

    membership = userId
      ? await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId }, select: { role: true } })
      : null;
  } catch (error) {
    const demoFallbackAllowed = slug.startsWith('demo-') && (allowDemoRead || allowDemoWrite);
    if (!demoFallbackAllowed) {
      console.error('[tenant-access] failed to resolve tenant', error);
      return { error: NextResponse.json({ error: 'Tenant access unavailable' }, { status: 503 }) };
    }
    tenant = buildDemoFallbackTenant(slug);
    membership = null;
  }

  const isDemoTenant = isDemoTenantStatus(tenant.status);
  const demoGuestReadAllowed = allowDemoRead && isDemoTenant;
  const demoGuestWriteAllowed = allowDemoWrite && isDemoTenant;

  const isSuperAdmin = isSuperAdminRole(globalRole);
  const isTenantMember = Boolean(membership);

  const canRead = isSuperAdmin || isTenantMember || demoGuestReadAllowed;
  if (!canRead) {
    return {
      error: NextResponse.json(
        { error: session?.user ? 'Forbidden' : 'Unauthorized' },
        { status: session?.user ? 403 : 401 }
      ),
    };
  }

  if (requireWrite) {
    const canWrite = isSuperAdmin || isWriteMembershipRole(membership?.role) || demoGuestWriteAllowed;
    if (!canWrite) {
      return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }
  }

  return {
    tenant,
    session,
    userId,
    globalRole,
    membership,
  };
}
