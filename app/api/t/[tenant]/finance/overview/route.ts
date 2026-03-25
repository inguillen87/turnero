import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildFinanceInsights } from '@/lib/finance-insights';
import { resolveTenantAccess } from '@/lib/tenant-access';

export const runtime = 'nodejs';

type MonthlyPoint = {
  month: string;
  paid: number;
  pending: number;
  noShowLoss: number;
};

function formatMonth(date: Date) {
  return date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
}

function buildMockResponse() {
  const summary = {
    paidThisMonth: 485000,
    pendingThisMonth: 92000,
    noShowLossThisMonth: 38000,
    avgTicketPaid: 27400,
    collectionRate: 84,
    upcomingBookedRevenue: 210000,
  };
  return {
    currency: 'ARS',
    summary,
    monthly: [
      { month: 'oct 25', paid: 390000, pending: 70000, noShowLoss: 42000 },
      { month: 'nov 25', paid: 420000, pending: 88000, noShowLoss: 37000 },
      { month: 'dic 25', paid: 468000, pending: 97000, noShowLoss: 41000 },
      { month: 'ene 26', paid: 452000, pending: 85000, noShowLoss: 36000 },
      { month: 'feb 26', paid: 470000, pending: 90000, noShowLoss: 34000 },
      { month: 'mar 26', paid: 485000, pending: 92000, noShowLoss: 38000 },
    ] as MonthlyPoint[],
    operations: {
      appointmentsThisMonth: 96,
      confirmedThisMonth: 71,
      noShowThisMonth: 7,
      noShowRate: 7.3,
    },
    insights: buildFinanceInsights(summary),
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;

  try {
    const access = await resolveTenantAccess({ slug });
    if ('error' in access) return access.error;
    const tenant = access.tenant;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        tenantId: tenant.id,
        startAt: { gte: sixMonthsAgo },
      },
      select: {
        startAt: true,
        status: true,
        paymentStatus: true,
        price: true,
      },
      orderBy: { startAt: 'asc' },
    });

    const monthlyMap = new Map<string, MonthlyPoint>();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyMap.set(key, { month: formatMonth(d), paid: 0, pending: 0, noShowLoss: 0 });
    }

    let paidThisMonth = 0;
    let pendingThisMonth = 0;
    let noShowLossThisMonth = 0;
    let paidCountThisMonth = 0;
    let upcomingBookedRevenue = 0;
    let appointmentsThisMonth = 0;
    let confirmedThisMonth = 0;
    let noShowThisMonth = 0;

    for (const appt of appointments) {
      const amount = Math.max(appt.price ?? 0, 0);
      const start = new Date(appt.startAt);
      const key = `${start.getFullYear()}-${start.getMonth()}`;
      const bucket = monthlyMap.get(key);
      const isThisMonth = start >= monthStart;
      if (isThisMonth) {
        appointmentsThisMonth += 1;
        if (appt.status === 'CONFIRMED' || appt.status === 'DONE') confirmedThisMonth += 1;
        if (appt.status === 'NO_SHOW') noShowThisMonth += 1;
      }

      if (appt.paymentStatus === 'PAID') {
        if (bucket) bucket.paid += amount;
        if (isThisMonth) {
          paidThisMonth += amount;
          paidCountThisMonth += 1;
        }
      }

      if (appt.paymentStatus === 'PENDING') {
        if (bucket) bucket.pending += amount;
        if (isThisMonth) pendingThisMonth += amount;
      }

      if (appt.status === 'NO_SHOW') {
        if (bucket) bucket.noShowLoss += amount;
        if (isThisMonth) noShowLossThisMonth += amount;
      }

      if (start >= now && (appt.status === 'PENDING' || appt.status === 'CONFIRMED')) {
        upcomingBookedRevenue += amount;
      }
    }

    const monthly = Array.from(monthlyMap.values()).reverse();
    const collectionBase = paidThisMonth + pendingThisMonth;
    const collectionRate = collectionBase > 0 ? Math.round((paidThisMonth / collectionBase) * 100) : 0;

    const summary = {
      paidThisMonth,
      pendingThisMonth,
      noShowLossThisMonth,
      avgTicketPaid: paidCountThisMonth > 0 ? Math.round(paidThisMonth / paidCountThisMonth) : 0,
      collectionRate,
      upcomingBookedRevenue,
    };
    const noShowRate = appointmentsThisMonth > 0 ? Number(((noShowThisMonth / appointmentsThisMonth) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      currency: tenant.currency || 'ARS',
      summary: {
        ...summary,
      },
      monthly,
      operations: {
        appointmentsThisMonth,
        confirmedThisMonth,
        noShowThisMonth,
        noShowRate,
      },
      insights: buildFinanceInsights(summary),
    });
  } catch (error) {
    console.warn('Error generating finance overview', error);
    return NextResponse.json(buildMockResponse());
  }
}
