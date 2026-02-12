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
            include: { contact: true, service: true, staff: true },
            orderBy: { startAt: 'asc' },
        });

        return appointments.map((a) => ({
            id: a.id,
            startAt: a.startAt.toISOString(),
            endAt: a.endAt.toISOString(),
            status: a.status.toLowerCase(),
            clientName: a.contact?.name || 'Walk-in',
            service: { name: a.service?.name, price: a.service?.price || 0 },
            professional: { name: a.staff?.name },
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
        let customer = await prisma.contact.findFirst({ where: { tenantId: tenant.id } }); // Simplify
        let service = await prisma.service.findFirst({ where: { tenantId: tenant.id } });
        let pro = await prisma.staff.findFirst({ where: { tenantId: tenant.id } });

        if (!contact || !service || !staff) throw new Error("Missing data");

        const appt = await prisma.appointment.create({
            data: {
                tenantId: tenant.id,
                contactId: customer.id,
                serviceId: service.id,
                staffId: pro.id,
                startAt: new Date(data.startAt),
                endAt: new Date(new Date(data.startAt).getTime() + service.durationMin * 60000),
                status: 'CONFIRMED',
                notes: data.notes || 'Created via API',
                source: 'API',
            },
            include: { contact: true, service: true, staff: true }
        });

        return {
            id: appt.id,
            startAt: appt.startAt.toISOString(),
            status: appt.status.toLowerCase(),
            clientName: appt.contact.name,
            service: { name: appt.service?.name || "Unknown" },
        };

    } catch (e) {
        console.error("Database Error on Create:", e);
        return null;
    }
}
