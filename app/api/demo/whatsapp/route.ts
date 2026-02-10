import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BotEngine } from '@/lib/bot/engine';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenantSlug, text } = body;

    // 1. Mock Tenant & Customer
    // Auto-detect locale from slug for demo purposes
    let locale = 'es';
    if (tenantSlug.endsWith('-en')) locale = 'en';
    if (tenantSlug.endsWith('-pt')) locale = 'pt';

    let tenant = {
        id: 'mock-tenant-id',
        slug: tenantSlug,
        name: 'Clínica Demo',
        locale: locale,
        metadata: JSON.stringify({
            // Example of Custom JSON Menu (only for ES demo to show off)
            bot_strings: locale === 'es' ? {
                menu: { booking: "📅 Nuevo Turno (Custom)" }
            } : {}
        }),
        services: [
            { id: 's1', name: 'Consulta General', priceCents: 5000, active: true, durationMin: 30 },
            { id: 's2', name: 'Limpieza Dental', priceCents: 3500, active: true, durationMin: 45 },
            { id: 's3', name: 'Ortodoncia', priceCents: 8000, active: true, durationMin: 60 },
            { id: 's4', name: 'Blanqueamiento', priceCents: 12000, active: true, durationMin: 60 }
        ]
    };

    // Try to fetch real if possible
    try {
        const realTenant = await prisma.tenant.findUnique({
            where: { slug: tenantSlug },
            include: { services: true }
        });
        if (realTenant) tenant = realTenant as any;
    } catch (e) { /* ignore */ }

    // Mock Customer
    let mockMetadata = { state: "IDLE" };
    if (body.metadata) mockMetadata = body.metadata;

    let customer = {
        id: 'mock-customer-id',
        name: 'Paciente Demo',
        metadata: JSON.stringify(mockMetadata),
        email: 'demo@paciente.com'
    };

    // 2. Instantiate Engine in DEMO MODE
    const engine = new BotEngine(tenant, customer, true);

    // Process Message
    const responseText = await engine.processMessage(text);

    // Get updated metadata from customer object (modified by engine reference)
    const nextMetadata = JSON.parse(customer.metadata);

    // Extract options from text to make UI nicer
    let options: any[] = [];
    if (responseText.includes("1.") && responseText.includes("2.")) {
        // Simple extraction of numbered lists
        const lines = responseText.split('\n');
        lines.forEach(line => {
            const match = line.match(/^(\d+)\.\s+(.*)/);
            if (match) {
                options.push({ label: match[0].substring(0, 15) + "...", value: match[1] });
            }
        });
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
              startAt: nextMetadata.temp?.slot || new Date().toISOString(),
              clientName: 'Paciente Demo',
              serviceName: nextMetadata.temp?.serviceName || 'Servicio Demo',
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
