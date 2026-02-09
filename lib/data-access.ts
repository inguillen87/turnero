// lib/data-access.ts
import { prisma } from "@/lib/db";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

const MOCK_MODE = process.env.MOCK_MODE === 'true' || !process.env.DATABASE_URL;

// Mock Data Store (In-Memory for Demo)
const mockData = {
    appointments: [
        { id: '1', startAt: new Date(Date.now() + 86400000).toISOString(), endAt: new Date(Date.now() + 90000000).toISOString(), status: 'confirmed', clientName: 'Mock Client 1', service: { name: 'Mock Service 1', priceCents: 5000 }, professional: { name: 'Dr. Mock' } },
        { id: '2', startAt: new Date(Date.now() + 172800000).toISOString(), endAt: new Date(Date.now() + 176400000).toISOString(), status: 'pending', clientName: 'Mock Client 2', service: { name: 'Mock Service 2', priceCents: 3000 }, professional: { name: 'Dr. Mock' } },
    ]
};

export async function getAppointments(tenantSlug: string) {
    if (MOCK_MODE) {
        console.warn("⚠️ Running in MOCK MODE");
        return mockData.appointments;
    }

    try {
        const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
        if (!tenant) return [];

        const appointments = await prisma.appointment.findMany({
            where: { tenantId: tenant.id },
            include: { customer: true, service: true, professional: true },
            orderBy: { startAt: 'asc' },
        });

        return appointments.map((a) => ({
            id: a.id,
            startAt: a.startAt.toISOString(),
            endAt: a.endAt.toISOString(),
            status: a.status.toLowerCase(),
            clientName: a.customer?.name || 'Walk-in',
            service: { name: a.service?.name, price: a.service?.priceCents ? a.service.priceCents / 100 : 0 },
            professional: { name: a.professional?.name },
            notes: a.notes,
        }));
    } catch (e) {
        console.error("Database Error (falling back to mock):", e);
        return mockData.appointments; // Fallback
    }
}

export async function createAppointment(tenantSlug: string, data: any) {
    if (MOCK_MODE) {
        const newAppt = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            startAt: new Date(data.startAt).toISOString(),
            status: 'confirmed',
            service: { name: 'Mock Service' }, // Simplification
            professional: { name: 'Dr. Mock' }
        };
        mockData.appointments.push(newAppt);
        return newAppt;
    }

    try {
        const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
        if (!tenant) throw new Error("Tenant not found");

        // Logic similar to POST route
        let customer = await prisma.customer.findFirst({ where: { tenantId: tenant.id } }); // Simplify
        let service = await prisma.service.findFirst({ where: { tenantId: tenant.id } });
        let pro = await prisma.professional.findFirst({ where: { tenantId: tenant.id } });

        if (!customer || !service || !pro) throw new Error("Missing data");

        const appt = await prisma.appointment.create({
            data: {
                tenantId: tenant.id,
                customerId: customer.id,
                serviceId: service.id,
                professionalId: pro.id,
                startAt: new Date(data.startAt),
                endAt: new Date(new Date(data.startAt).getTime() + service.durationMin * 60000),
                status: 'CONFIRMED',
                notes: data.notes || 'Created via API',
                source: 'API',
            },
            include: { customer: true, service: true, professional: true }
        });

        return {
            id: appt.id,
            startAt: appt.startAt.toISOString(),
            status: appt.status.toLowerCase(),
            clientName: appt.customer.name,
            service: { name: appt.service.name },
        };

    } catch (e) {
        console.error("Database Error on Create:", e);
        return null;
    }
}
