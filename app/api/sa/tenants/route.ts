import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  if (userRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const tenants = await prisma.tenant.findMany();
  return NextResponse.json(tenants);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  if (userRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, slug, plan } = body;

  const tenant = await prisma.tenant.create({
    data: { name, slug, plan },
  });

  return NextResponse.json(tenant, { status: 201 });
}
