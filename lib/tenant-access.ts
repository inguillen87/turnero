import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const WRITE_ROLES = new Set(['OWNER', 'ADMIN', 'TENANT_ADMIN']);

type ResolveOptions = {
  slug: string;
  requireWrite?: boolean;
};

export async function resolveTenantAccess({ slug, requireWrite = false }: ResolveOptions) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    return { error: NextResponse.json({ error: 'Tenant not found' }, { status: 404 }) };
  }

  const userId = (session.user as any).id as string | undefined;
  const globalRole = (session.user as any).role as string | undefined;
  const membership = userId
    ? await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } })
    : null;

  const isSuperAdmin = globalRole === 'SUPER_ADMIN';
  const isTenantMember = Boolean(membership);
  if (!isSuperAdmin && !isTenantMember) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  if (requireWrite) {
    const canWrite = isSuperAdmin || (membership ? WRITE_ROLES.has(membership.role) : false);
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
