import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BotEngine } from '@/lib/bot/engine';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenantSlug, text } = body;

    // 1. Mock Tenant & Customer (since DB might be offline in this sandbox)
    // In production, we would fetch these from DB.
    let tenant = {
        id: 'mock-tenant-id',
        slug: tenantSlug,
        name: 'Clínica Demo',
        services: [
            { id: 's1', name: 'Consulta General', priceCents: 5000, active: true, durationMin: 30 },
            { id: 's2', name: 'Limpieza Dental', priceCents: 3500, active: true, durationMin: 45 },
            { id: 's3', name: 'Ortodoncia', priceCents: 8000, active: true, durationMin: 60 },
            { id: 's4', name: 'Blanqueamiento', priceCents: 12000, active: true, durationMin: 60 }
        ]
    };

    // Try to fetch real if possible (will fail in sandbox without env)
    try {
        const realTenant = await prisma.tenant.findUnique({
            where: { slug: tenantSlug },
            include: { services: true }
        });
        if (realTenant) tenant = realTenant as any;
    } catch (e) { /* ignore */ }

    // Mock Customer State storage (Memory or Client-side passed?)
    // For demo simplicity, we can't easily persist state across calls without DB.
    // However, the `BotEngine` relies on `customer.metadata`.
    // We'll have to "Mock" the persistence by just assuming IDLE or passing state back?
    // No, the BotEngine reads from DB.

    // WORKAROUND: For the Demo Simulator *specifically*, we will create a
    // "Ephemeral Bot Engine" that mocks the DB updates.

    let mockMetadata = { state: "IDLE" };
    // We could pass metadata from the client to persist state!
    if (body.metadata) mockMetadata = body.metadata;

    let customer = {
        id: 'mock-customer-id',
        name: 'Paciente Demo',
        metadata: JSON.stringify(mockMetadata),
        email: 'demo@paciente.com'
    };

    // We need to override the engine's `setContext` to simply return the metadata
    // so we can send it back to the client.

    const engine = new BotEngine(tenant, customer);

    // Monkey-patch setContext to capture state changes
    let nextMetadata = mockMetadata;
    (engine as any).setContext = async (ctx: any) => {
        nextMetadata = ctx;
        customer.metadata = JSON.stringify(ctx); // Update local for immediate reads
    };

    // Monkey-patch prisma calls inside engine?
    // The engine calls `prisma.appointment.create`.
    // We need to intercept that too if we want "Action" triggers.

    // ACTUALLY: The engine is tightly coupled to Prisma.
    // Ideally I should refactor Engine to take an Interface for DB operations.
    // But for this task, I will just let it fail or wrap it?
    // If I cannot write to DB, `prisma.appointment.create` will throw.

    // PLAN B: Minimal Logic Duplication for Demo if DB is unreachable.
    // If DB is reachable, use Engine.
    // If not, use a simple switch case *similar* to Engine.

    // Let's try to use Engine but catch DB errors.
    let responseText = "";
    try {
        responseText = await engine.processMessage(text);
    } catch (e) {
        // Fallback Logic if Engine fails (e.g. DB error)
        console.warn("Engine failed (likely DB), using fallback logic");
        if (text.includes("1") || text.includes("reservar")) {
            responseText = "¿Qué servicio buscas?\n1. Consulta General ($50)\n2. Limpieza ($35)\n\nEscribe el número.";
            nextMetadata = { state: "BOOKING_SELECT_SERVICE" } as any;
        } else if (text.includes("2") || text.includes("precio")) {
            responseText = "Nuestros precios:\n- Consulta: $50\n- Limpieza: $35";
        } else if (['si', 'yes'].includes(text.toLowerCase())) {
             responseText = "✅ Turno Confirmado (Demo).\n\n💳 Link de pago: https://mpago.la/demo";
             nextMetadata = { state: "IDLE" } as any;
        } else {
             responseText = "No entendí. Escribe 'menu' para ver opciones.";
        }
    }

    // Extract options from text to make UI nicer
    let options: any[] = [];
    if (responseText.includes("1.") && responseText.includes("2.")) {
        options = [
            { label: "1. Consulta", value: "1" },
            { label: "2. Limpieza", value: "2" }
        ];
    } else if (responseText.includes("SI") || responseText.includes("confirmar")) {
        options = [
            { label: "✅ Confirmar", value: "si" },
            { label: "❌ Cancelar", value: "no" }
        ];
    } else if (responseText.includes("menu")) {
        options = [{ label: "🏠 Menú", value: "menu" }];
    }

    return NextResponse.json({
      messages: [{ body: responseText, options }],
      metadata: nextMetadata, // Return state to client
      action: responseText.includes("Confirmado") ? {
          type: 'APPOINTMENT_CREATED',
          payload: {
              id: 'demo-'+Date.now(),
              startAt: new Date().toISOString(),
              clientName: 'Paciente Demo',
              serviceName: 'Servicio Demo',
              status: 'confirmed'
          }
      } : null
    });

  } catch (error) {
    console.error('Demo API Error:', error);
    return NextResponse.json({
        messages: [{ from: 'bot', body: 'Error en el sistema demo. Intenta "menu".' }]
    });
  }
}
