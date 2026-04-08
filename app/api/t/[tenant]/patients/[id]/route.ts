import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenantAccess } from '@/lib/tenant-access';
import { isDemoTenantStatus } from '@/lib/tenant-access-rules';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  const { tenant: slug, id } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoRead: true, allowDemoWrite: true });
  if ('error' in access) return access.error;
  const isDemoTenant = isDemoTenantStatus(access.tenant.status);

  const body = await req.json().catch(() => null) as {
    name?: string;
    email?: string;
    locale?: string;
    tags?: unknown;
    lastSeen?: string;
  } | null;

  try {
    const existing = await prisma.contact.findFirst({ where: { id, tenantId: access.tenant.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        name: body?.name?.trim() || undefined,
        email: body?.email?.trim()?.toLowerCase() || undefined,
        locale: body?.locale?.trim() || undefined,
        tags: body?.tags == null ? undefined : JSON.stringify(body.tags),
        lastSeen: body?.lastSeen ? new Date(body.lastSeen) : undefined,
      },
    });

    return NextResponse.json({ ok: true, patient: updated });
  } catch (error) {
    if (!isDemoTenant) {
      console.error('[patients.PATCH] failed', error);
      return NextResponse.json({ error: 'Patient could not be updated' }, { status: 500 });
    }
    console.warn('[patients.PATCH] fallback mock response', error);
    return NextResponse.json({
      ok: true,
      patient: {
        id,
        name: body?.name?.trim() || 'Paciente Demo',
        email: body?.email?.trim()?.toLowerCase() || null,
        locale: body?.locale?.trim() || 'es-AR',
        lastSeen: body?.lastSeen || new Date().toISOString(),
      },
    });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  const { tenant: slug, id } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoRead: true, allowDemoWrite: true });
  if ('error' in access) return access.error;
  const isDemoTenant = isDemoTenantStatus(access.tenant.status);

  try {
    const existing = await prisma.contact.findFirst({ where: { id, tenantId: access.tenant.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (!isDemoTenant) {
      console.error('[patients.DELETE] failed', error);
      return NextResponse.json({ error: 'Patient could not be deleted' }, { status: 500 });
    }
    console.warn('[patients.DELETE] fallback mock response', error);
    return NextResponse.json({ ok: true, deletedId: id });
  }
}
