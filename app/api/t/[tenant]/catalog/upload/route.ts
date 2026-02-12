import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ tenant: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tenant: tenantSlug } = await params;

    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    // Check permissions
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    if (userRole !== 'SUPER_ADMIN') {
      const tenantUser = await prisma.tenantUser.findFirst({
        where: {
          tenantId: tenant.id,
          userId: userId
        }
      });

      if (!tenantUser) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = file.name.toLowerCase();

    let items: { name: string; price: number; category: string; description: string }[] = [];

    // Simple heuristic to mock AI Vision extraction
    if (filename.includes("dent") || filename.includes("odonto")) {
        items = [
          { name: "Consulta General", price: 15000, category: "Clínica", description: "Diagnóstico inicial" },
          { name: "Limpieza Profunda", price: 25000, category: "Higiene", description: "Ultrasonido + Pulido" },
          { name: "Blanqueamiento LED", price: 80000, category: "Estética", description: "Sesión completa" },
          { name: "Extracción Simple", price: 30000, category: "Cirugía", description: "Muela no retenida" }
        ];
    } else if (filename.includes("gym") || filename.includes("fit")) {
        items = [
          { name: "Pase Diario", price: 5000, category: "Acceso", description: "Acceso libre por 24hs" },
          { name: "Membresía Mensual", price: 25000, category: "Plan", description: "Acceso ilimitado mes" },
          { name: "Clase Personalizada", price: 10000, category: "Entrenamiento", description: "1 hora con coach" }
        ];
    } else {
        // Fallback generic items
        items = [
          { name: "Servicio Básico", price: 10000, category: "General", description: "Servicio estándar" },
          { name: "Servicio Premium", price: 25000, category: "Premium", description: "Servicio avanzado" }
        ];
    }

    // Save extracted items
    await prisma.catalogItem.createMany({
      data: items.map((item) => ({
        tenantId: tenant.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        currency: tenant.currency,
        tipo: "servicio",
        active: true,
      })),
    });

    // Also store a record of the file
    await prisma.catalogFile.create({
        data: {
            tenantId: tenant.id,
            filename: file.name,
            mime: file.type || "application/octet-stream",
            storageUrl: "https://mock.storage.url/" + file.name,
            status: "READY"
        }
    });

    return NextResponse.json({ success: true, count: items.length });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
