import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenantAccess } from '@/lib/tenant-access';

export const runtime = 'nodejs';

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const access = await resolveTenantAccess({ slug, allowDemoRead: true });
  if ('error' in access) return access.error;

  const now = new Date();
  const since = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const appointments = await prisma.appointment.findMany({
    where: { tenantId: access.tenant.id, startAt: { gte: since } },
    include: { staff: true, service: true },
    orderBy: { startAt: 'asc' },
  });

  const monthly = new Map<string, { month: string; revenue: number; done: number; noShow: number; cancelled: number }>();
  const byStaff = new Map<string, { name: string; revenue: number; appointments: number; noShow: number }>();
  const byService = new Map<string, { name: string; count: number; revenue: number }>();
  const bySource = new Map<string, number>();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthly.set(monthKey(d), { month: d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }), revenue: 0, done: 0, noShow: 0, cancelled: 0 });
  }

  for (const appt of appointments) {
    const m = monthly.get(monthKey(new Date(appt.startAt)));
    const amount = Math.max(appt.price ?? appt.service?.price ?? 0, 0);
    const source = (appt.source || 'unknown').toLowerCase();
    bySource.set(source, (bySource.get(source) || 0) + 1);

    if (m) {
      if (appt.status === 'DONE') {
        m.done += 1;
        m.revenue += amount;
      }
      if (appt.status === 'NO_SHOW') m.noShow += 1;
      if (appt.status === 'CANCELLED') m.cancelled += 1;
    }

    const staffKey = appt.staffId || 'sin-profesional';
    const staffName = appt.staff?.name || 'Sin profesional';
    const staffAgg = byStaff.get(staffKey) || { name: staffName, revenue: 0, appointments: 0, noShow: 0 };
    staffAgg.appointments += 1;
    if (appt.status === 'DONE') staffAgg.revenue += amount;
    if (appt.status === 'NO_SHOW') staffAgg.noShow += 1;
    byStaff.set(staffKey, staffAgg);

    const serviceKey = appt.serviceId || 'sin-servicio';
    const serviceName = appt.service?.name || 'Sin servicio';
    const serviceAgg = byService.get(serviceKey) || { name: serviceName, count: 0, revenue: 0 };
    serviceAgg.count += 1;
    if (appt.status === 'DONE') serviceAgg.revenue += amount;
    byService.set(serviceKey, serviceAgg);
  }

  const totalAppointments = appointments.length;
  const done = appointments.filter((a) => a.status === 'DONE').length;
  const noShow = appointments.filter((a) => a.status === 'NO_SHOW').length;
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;

  const totalRevenue = Array.from(monthly.values()).reduce((sum, item) => sum + item.revenue, 0);
  const completionRate = totalAppointments > 0 ? Number(((done / totalAppointments) * 100).toFixed(1)) : 0;
  const noShowRate = totalAppointments > 0 ? Number(((noShow / totalAppointments) * 100).toFixed(1)) : 0;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    totals: {
      totalAppointments,
      done,
      noShow,
      cancelled,
      completionRate,
      noShowRate,
      totalRevenue,
    },
    monthly: Array.from(monthly.values()),
    topProfessionals: Array.from(byStaff.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    topServices: Array.from(byService.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    sourceMix: Array.from(bySource.entries()).map(([source, count]) => ({ source, count })),
  });
}
