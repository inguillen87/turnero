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

export async function resolveTenantAccess({
  slug,
  requireWrite = false,
  allowDemoRead = false,
  allowDemoWrite = false,
}: ResolveOptions) {
  const session = await getServerSession(authOptions);

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    return { error: NextResponse.json({ error: 'Tenant not found' }, { status: 404 }) };
  }

  const isDemoTenant = isDemoTenantStatus(tenant.status);
  const demoGuestReadAllowed = allowDemoRead && isDemoTenant;
  const demoGuestWriteAllowed = allowDemoWrite && isDemoTenant;

  const userId = (session?.user as any)?.id as string | undefined;
  const globalRole = (session?.user as any)?.role as string | undefined;

  const membership = userId
    ? await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } })
    : null;

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
