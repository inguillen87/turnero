import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const tenants = await prisma.tenant.findMany();
  return NextResponse.json(tenants);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, slug, plan } = body;

  const tenant = await prisma.tenant.create({
    data: { name, slug, plan },
  });

  return NextResponse.json(tenant, { status: 201 });
}
