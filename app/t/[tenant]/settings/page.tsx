import { prisma } from '@/lib/db';
import SettingsClient from './SettingsClient';

export default async function SettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;

  let tenantData: any = { name: "Cargando...", slug: slug };
  let services: any[] = [];
  let professionals: any[] = [];
  let integrations: any[] = [];

  // Mock Fallbacks
  const mockTenant = { id: 'mock', name: 'Clínica Demo', slug: slug, phone: '+54 9 11 1234-5678', address: 'Av. Libertador 1000' };
  const mockServices = [
      { id: 's1', name: 'Consulta General', durationMin: 30, priceCents: 5000 },
      { id: 's2', name: 'Limpieza Dental', durationMin: 45, priceCents: 8000 }
  ];
  const mockProfessionals = [
      { id: 'p1', name: 'Dr. Juan Pérez', specialty: 'General', active: true },
      { id: 'p2', name: 'Dra. María González', specialty: 'Ortodoncia', active: true }
  ];

  try {
     const tenant = await prisma.tenant.findUnique({
         where: { slug },
         include: {
             services: true,
             staff: true,
             integrations: true
         }
     });

     if (tenant) {
         tenantData = tenant;
         services = tenant.services;
         professionals = tenant.staff;
         integrations = tenant.integrations;
     } else {
         // Should not happen if middleware is working, but just in case
         tenantData = mockTenant;
         services = mockServices;
         professionals = mockProfessionals;
     }
  } catch (e) {
     console.warn("DB Connection failed in SettingsPage, using mock data");
     tenantData = mockTenant;
     services = mockServices;
     professionals = mockProfessionals;
  }

  // Fallback for empty data even if DB connected (e.g. fresh tenant)
  if (services.length === 0) services = mockServices;
  if (professionals.length === 0) professionals = mockProfessionals;

  return (
    <SettingsClient
       tenant={tenantData}
       services={services}
       professionals={professionals}
       integrations={integrations}
    />
  );
}
