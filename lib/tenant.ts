import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function getTenantSlug() {
  const headersList = await headers();
  return headersList.get('x-tenant-slug');
}

export async function getTenant() {
  const slug = await getTenantSlug();

  if (!slug) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  });

  return tenant;
}
