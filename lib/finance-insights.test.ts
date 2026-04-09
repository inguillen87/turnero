import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFinanceInsights, buildWeeklyActionPlan } from './finance-insights.ts';

test('buildFinanceInsights returns high severity for low collection', () => {
  const result = buildFinanceInsights({
    paidThisMonth: 100000,
    pendingThisMonth: 60000,
    noShowLossThisMonth: 5000,
    avgTicketPaid: 30000,
    collectionRate: 52,
    upcomingBookedRevenue: 40000,
  });

  assert.equal(result[0]?.severity, 'high');
  assert.ok(result.some((item) => item.title.includes('Cobranza')));
});

test('buildFinanceInsights returns healthy info when metrics are balanced', () => {
  const result = buildFinanceInsights({
    paidThisMonth: 400000,
    pendingThisMonth: 70000,
    noShowLossThisMonth: 12000,
    avgTicketPaid: 28000,
    collectionRate: 85,
    upcomingBookedRevenue: 150000,
  });

  assert.equal(result.length, 1);
  assert.equal(result[0]?.severity, 'info');
});

test('buildWeeklyActionPlan prioritizes collections and no-show actions', () => {
  const plan = buildWeeklyActionPlan(
    {
      paidThisMonth: 180000,
      pendingThisMonth: 120000,
      noShowLossThisMonth: 40000,
      avgTicketPaid: 17000,
      collectionRate: 60,
      upcomingBookedRevenue: 90000,
    },
    { noShowRate: 11.2 }
  );

  assert.ok(plan.length >= 2);
  assert.equal(plan[0]?.impact, 'high');
});
