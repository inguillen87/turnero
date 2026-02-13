import { prisma } from '@/lib/db';
import TenantLayoutClient from './layout-client';

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;

  // Explicitly type tenant as any or a loose shape to allow the mock fallback
  let tenant: any;
  try {
     tenant = await prisma.tenant.findUnique({
       where: { slug },
     });
  } catch (e) {
      console.warn("DB Connection failed, using mock tenant for layout");
      // Mock Fallback for Layout if DB is down/missing
      if (slug === 'demo' || slug === 'demo-clinica' || slug === 'mock-tenant') {
          tenant = { name: 'Clínica Demo', slug: slug };
      }
  }

  if (!tenant) {
    tenant = { name: 'Clínica Demo', slug };
  }

  return (
    <TenantLayoutClient tenant={tenant} slug={slug}>
      {children}
    </TenantLayoutClient>
  );
}
