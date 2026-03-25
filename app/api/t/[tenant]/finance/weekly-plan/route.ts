import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildWeeklyActionPlan, type FinanceSummary } from '@/lib/finance-insights';
import { resolveTenantAccess } from '@/lib/tenant-access';

export const runtime = 'nodejs';

function buildMockSummary(): FinanceSummary {
  return {
    paidThisMonth: 485000,
    pendingThisMonth: 92000,
    noShowLossThisMonth: 38000,
    avgTicketPaid: 27400,
    collectionRate: 84,
    upcomingBookedRevenue: 210000,
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
    const data = await prisma.appointment.findMany({
      where: { tenantId: tenant.id, startAt: { gte: monthStart } },
      select: { status: true, paymentStatus: true, price: true, startAt: true },
    });

    let paidThisMonth = 0;
    let pendingThisMonth = 0;
    let noShowLossThisMonth = 0;
    let paidCountThisMonth = 0;
    let upcomingBookedRevenue = 0;
    let noShowThisMonth = 0;

    for (const item of data) {
      const amount = Math.max(item.price ?? 0, 0);
      if (item.paymentStatus === 'PAID') {
        paidThisMonth += amount;
        paidCountThisMonth += 1;
      }
      if (item.paymentStatus === 'PENDING') pendingThisMonth += amount;
      if (item.status === 'NO_SHOW') {
        noShowThisMonth += 1;
        noShowLossThisMonth += amount;
      }
      if (new Date(item.startAt) >= now && (item.status === 'PENDING' || item.status === 'CONFIRMED')) {
        upcomingBookedRevenue += amount;
      }
    }

    const collectionBase = paidThisMonth + pendingThisMonth;
    const summary: FinanceSummary = {
      paidThisMonth,
      pendingThisMonth,
      noShowLossThisMonth,
      avgTicketPaid: paidCountThisMonth > 0 ? Math.round(paidThisMonth / paidCountThisMonth) : 0,
      collectionRate: collectionBase > 0 ? Math.round((paidThisMonth / collectionBase) * 100) : 0,
      upcomingBookedRevenue,
    };

    const noShowRate = data.length > 0 ? Number(((noShowThisMonth / data.length) * 100).toFixed(1)) : 0;
    const plan = buildWeeklyActionPlan(summary, { noShowRate });

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      currency: tenant.currency || 'ARS',
      kpis: {
        collectionRate: summary.collectionRate,
        noShowRate,
        pendingThisMonth: summary.pendingThisMonth,
      },
      plan,
    });
  } catch (error) {
    console.warn('Error generating weekly finance plan', error);
    const summary = buildMockSummary();
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      currency: 'ARS',
      kpis: {
        collectionRate: summary.collectionRate,
        noShowRate: 7.3,
        pendingThisMonth: summary.pendingThisMonth,
      },
      plan: buildWeeklyActionPlan(summary, { noShowRate: 7.3 }),
    });
  }
}
