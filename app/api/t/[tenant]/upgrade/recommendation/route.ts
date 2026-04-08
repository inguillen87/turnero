import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenantAccess } from '@/lib/tenant-access';
import { getTenantCapabilitiesBySlug } from '@/lib/capabilities';

export const runtime = 'nodejs';

const PLAN_FEATURES = {
  demo: ['Agenda básica', 'Pacientes', 'Simulador'],
  starter: ['Agenda + Pacientes', 'Recordatorios', 'Reportes básicos'],
  pro: ['Finanzas', 'Reportes avanzados', 'Integraciones'],
  enterprise: ['Multi-sede', 'Equipo avanzado', 'SLA prioritario'],
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const access = await resolveTenantAccess({ slug, allowDemoRead: true });
  if ('error' in access) return access.error;

  const [capabilities, totals] = await Promise.all([
    getTenantCapabilitiesBySlug(slug),
    prisma.appointment.aggregate({
      where: { tenantId: access.tenant.id },
      _count: { _all: true },
      _sum: { price: true },
    }),
  ]);

  if (!capabilities) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  const currentPlan = (access.tenant.plan || 'demo').toLowerCase();
  const monthlyAppointments = totals._count._all || 0;
  const monthlyRevenue = totals._sum.price || 0;

  const blockers: string[] = [];
  if (!capabilities.canUseFinance) blockers.push('Módulo de finanzas bloqueado');
  if (!capabilities.canUseReports) blockers.push('Reportes avanzados bloqueados');
  if (!capabilities.canUseAdvancedIntegrations) blockers.push('Integraciones avanzadas bloqueadas');

  const recommendedPlan =
    monthlyAppointments > 300 || monthlyRevenue > 8_000_000
      ? 'enterprise'
      : monthlyAppointments > 120 || monthlyRevenue > 3_000_000
        ? 'pro'
        : 'starter';

  return NextResponse.json({
    current: {
      plan: currentPlan,
      planStatus: access.tenant.planStatus,
      features: PLAN_FEATURES[currentPlan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.demo,
    },
    recommendation: {
      plan: recommendedPlan,
      reason: blockers.length > 0 ? 'Desbloquear funciones críticas para operación diaria' : 'Escalar capacidad según uso actual',
      blockers,
      usage: {
        monthlyAppointments,
        monthlyRevenue,
      },
      features: PLAN_FEATURES[recommendedPlan as keyof typeof PLAN_FEATURES],
    },
  });
}
