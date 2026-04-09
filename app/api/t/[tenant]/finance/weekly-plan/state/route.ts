import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenantAccess } from '@/lib/tenant-access';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;

  try {
    const access = await resolveTenantAccess({ slug });
    if ('error' in access) return access.error;
    const tenant = access.tenant;

    const states = await prisma.weeklyPlanActionState.findMany({
      where: { tenantId: tenant.id },
      select: { actionId: true, completed: true },
    });
    const recentEvents = await prisma.weeklyPlanActionEvent.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { actionId: true, completed: true, actor: true, source: true, createdAt: true },
    });

    return NextResponse.json({
      states: Object.fromEntries(states.map((s) => [s.actionId, s.completed])),
      recentEvents,
    });
  } catch (error) {
    console.warn('Error fetching weekly plan state', error);
    return NextResponse.json({ states: {} });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;

  try {
    const access = await resolveTenantAccess({ slug, requireWrite: true });
    if ('error' in access) return access.error;
    const tenant = access.tenant;
    const session = access.session;
    const body = await req.json().catch(() => null) as { actionId?: string; completed?: boolean; actor?: string; source?: string } | null;
    const actionId = body?.actionId?.trim();
    const sessionActor = session?.user?.name || session?.user?.email || (session?.user as any)?.id;
    const actor = (sessionActor || body?.actor || 'Operador').toString().trim().slice(0, 80);
    const source = (sessionActor ? 'dashboard_authenticated' : (body?.source || 'dashboard')).toString().trim().slice(0, 40);

    if (!actionId) {
      return NextResponse.json({ error: 'actionId is required' }, { status: 400 });
    }

    const record = await prisma.weeklyPlanActionState.upsert({
      where: {
        tenantId_actionId: {
          tenantId: tenant.id,
          actionId,
        },
      },
      update: { completed: Boolean(body?.completed) },
      create: {
        tenantId: tenant.id,
        actionId,
        completed: Boolean(body?.completed),
      },
      select: { actionId: true, completed: true },
    });
    await prisma.weeklyPlanActionEvent.create({
      data: {
        tenantId: tenant.id,
        actionId,
        completed: Boolean(body?.completed),
        actor,
        source,
      },
    });

    return NextResponse.json({ state: record });
  } catch (error) {
    console.warn('Error saving weekly plan state', error);
    return NextResponse.json({ error: 'failed_to_save_state' }, { status: 500 });
  }
}
