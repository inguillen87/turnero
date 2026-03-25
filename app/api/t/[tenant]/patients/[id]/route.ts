import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenantAccess } from '@/lib/tenant-access';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  const { tenant: slug, id } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoRead: true, allowDemoWrite: true });
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => null) as {
    name?: string;
    email?: string;
    locale?: string;
    tags?: unknown;
    lastSeen?: string;
  } | null;

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
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ tenant: string; id: string }> }
) {
  const { tenant: slug, id } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoRead: true, allowDemoWrite: true });
  if ('error' in access) return access.error;

  const existing = await prisma.contact.findFirst({ where: { id, tenantId: access.tenant.id } });
  if (!existing) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
