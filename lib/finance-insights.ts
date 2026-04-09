export type FinanceSummary = {
  paidThisMonth: number;
  pendingThisMonth: number;
  noShowLossThisMonth: number;
  avgTicketPaid: number;
  collectionRate: number;
  upcomingBookedRevenue: number;
};

export type FinanceInsight = {
  severity: 'high' | 'medium' | 'info';
  title: string;
  why: string;
  action: string;
};

export type WeeklyActionPlanItem = {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  owner: 'recepcion' | 'operaciones' | 'marketing';
  nextStep: string;
};

export function buildFinanceInsights(summary: FinanceSummary): FinanceInsight[] {
  const insights: FinanceInsight[] = [];

  if (summary.collectionRate < 70) {
    insights.push({
      severity: 'high',
      title: 'Cobranza baja',
      why: `La tasa de cobranza del mes está en ${summary.collectionRate}%.`,
      action: 'Activar secuencia automática de recordatorio + link de pago en D-1 y D+1.',
    });
  }

  if (summary.pendingThisMonth > summary.paidThisMonth * 0.35) {
    insights.push({
      severity: 'high',
      title: 'Pendiente de cobro elevado',
      why: 'Hay un volumen de pagos pendientes que puede tensionar la caja semanal.',
      action: 'Priorizar cobro de pendientes por antigüedad y habilitar seña obligatoria en servicios críticos.',
    });
  }

  if (summary.noShowLossThisMonth > summary.paidThisMonth * 0.12) {
    insights.push({
      severity: 'medium',
      title: 'Impacto por no-show relevante',
      why: 'La pérdida por ausencias supera el umbral operativo recomendado.',
      action: 'Reforzar confirmación en 2 pasos y abrir lista de espera para relleno automático de huecos.',
    });
  }

  if (summary.avgTicketPaid > 0 && summary.avgTicketPaid < 20000) {
    insights.push({
      severity: 'info',
      title: 'Ticket promedio mejorable',
      why: 'El ticket cobrado está por debajo del objetivo sugerido para escalar margen.',
      action: 'Probar paquetes/combinaciones de servicios y campañas de reactivación segmentadas.',
    });
  }

  if (!insights.length) {
    insights.push({
      severity: 'info',
      title: 'Operación financiera saludable',
      why: 'Los indicadores clave están dentro de rangos esperados.',
      action: 'Mantener la cadencia semanal de revisión y ajustar por profesional/sede.',
    });
  }

  return insights;
}

export function buildWeeklyActionPlan(
  summary: FinanceSummary,
  ops: { noShowRate: number }
): WeeklyActionPlanItem[] {
  const plan: WeeklyActionPlanItem[] = [];

  if (summary.collectionRate < 80) {
    plan.push({
      id: 'cobranza-72h',
      title: 'Campaña de cobranza en 72h para pendientes críticos',
      impact: 'high',
      effort: 'medium',
      owner: 'recepcion',
      nextStep: 'Contactar primero deudas >7 días con link de pago y recordatorio automático.',
    });
  }

  if (ops.noShowRate >= 8) {
    plan.push({
      id: 'doble-confirmacion',
      title: 'Doble confirmación + lista de espera activa',
      impact: 'high',
      effort: 'low',
      owner: 'operaciones',
      nextStep: 'Activar confirmación D-1 y H-3; habilitar reemplazo automático de cancelaciones.',
    });
  }

  if (summary.avgTicketPaid < 22000 && summary.avgTicketPaid > 0) {
    plan.push({
      id: 'upsell-paquetes',
      title: 'Oferta de paquetes para subir ticket promedio',
      impact: 'medium',
      effort: 'medium',
      owner: 'marketing',
      nextStep: 'Diseñar 2 bundles y probarlos en pacientes recurrentes con mensaje segmentado.',
    });
  }

  if (!plan.length) {
    plan.push({
      id: 'optimizar-rutina',
      title: 'Mantener rutina semanal de optimización',
      impact: 'medium',
      effort: 'low',
      owner: 'operaciones',
      nextStep: 'Revisar desvíos por profesional y ajustar agenda/campañas en base a datos.',
    });
  }

  return plan.slice(0, 3);
}
