import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantName, slug, email, password } = body;

    if (!tenantName || !slug || !email || !password) {
      return NextResponse.json({ message: "Faltan datos requeridos." }, { status: 400 });
    }

    // 1. Check if slug or user already exists in parallel
    const [existingTenant, existingUser] = await Promise.all([
      prisma.tenant.findUnique({ where: { slug } }),
      prisma.user.findUnique({ where: { email } })
    ]);

    if (existingTenant) {
      return NextResponse.json({ message: "La URL de la clínica ya está en uso." }, { status: 400 });
    }

    if (existingUser) {
      return NextResponse.json({ message: "El email ya está registrado." }, { status: 400 });
    }

    // 3. Create everything in a transaction
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      // Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
          slug: slug,
          status: 'active',
          // Create default plan or link later
        }
      });

      // Create User
      const user = await tx.user.create({
        data: {
          email: email,
          name: email.split('@')[0], // Default name
          passwordHash: passwordHash,
          globalRole: 'USER'
        }
      });

      // Link User to Tenant as Owner
      await tx.tenantUser.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: 'OWNER'
        }
      });
    });

    return NextResponse.json({ message: "Cuenta creada exitosamente." }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
