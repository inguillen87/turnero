import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resolveTenantAccess } from '@/lib/tenant-access';

function inferRisk(lastSeen: Date | null, upcomingCount: number) {
  if (upcomingCount > 0) return 'LOW';
  if (!lastSeen) return 'MEDIUM';
  const days = Math.floor((Date.now() - lastSeen.getTime()) / 86400000);
  if (days > 120) return 'HIGH';
  if (days > 45) return 'MEDIUM';
  return 'LOW';
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const access = await resolveTenantAccess({ slug, allowDemoRead: true });
  if ('error' in access) return access.error;

  const contacts = await prisma.contact.findMany({
    where: { tenantId: access.tenant.id },
    include: {
      appointments: {
        select: { id: true, startAt: true, status: true },
        orderBy: { startAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  const now = Date.now();
  const rows = contacts.map((contact) => {
    const upcoming = contact.appointments.filter((a) => new Date(a.startAt).getTime() >= now && a.status !== 'CANCELLED').length;
    const risk = inferRisk(contact.lastSeen, upcoming);

    return {
      id: contact.id,
      name: contact.name || 'Sin nombre',
      phone: contact.phoneE164,
      email: contact.email,
      locale: contact.locale,
      upcoming,
      totalAppointments: contact.appointments.length,
      risk,
      lastSeen: contact.lastSeen,
    };
  });

  return NextResponse.json(rows);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const access = await resolveTenantAccess({ slug, requireWrite: true, allowDemoRead: true, allowDemoWrite: true });
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => null) as {
    name?: string;
    phoneE164?: string;
    email?: string;
    locale?: string;
  } | null;

  const phoneE164 = body?.phoneE164?.trim();
  if (!phoneE164) {
    return NextResponse.json({ error: 'phoneE164 is required' }, { status: 400 });
  }

  const contact = await prisma.contact.upsert({
    where: {
      tenantId_phoneE164: {
        tenantId: access.tenant.id,
        phoneE164,
      },
    },
    create: {
      tenantId: access.tenant.id,
      phoneE164,
      name: body?.name?.trim() || null,
      email: body?.email?.trim()?.toLowerCase() || null,
      locale: body?.locale?.trim() || null,
      lastSeen: new Date(),
    },
    update: {
      name: body?.name?.trim() || undefined,
      email: body?.email?.trim()?.toLowerCase() || undefined,
      locale: body?.locale?.trim() || undefined,
      lastSeen: new Date(),
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
