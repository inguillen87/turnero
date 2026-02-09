// NOTE: This file should only be imported if prisma is installed and DB is active.
import "server-only";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

// Singleton Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

async function getTenantId(slug: string) {
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    return tenant?.id;
}

export async function getServices(tenantSlug: string) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return [];
    return prisma.service.findMany({ where: { tenantId } });
}

export async function createService(tenantSlug: string, data: any) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) throw new Error("Tenant not found");
    return prisma.service.create({ data: { ...data, tenantId } });
}

export async function getStaff(tenantSlug: string) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return [];
    return prisma.staff.findMany({ where: { tenantId } });
}

export async function createStaff(tenantSlug: string, data: any) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) throw new Error("Tenant not found");
    return prisma.staff.create({ data: { ...data, tenantId } });
}

export async function getAppointments(tenantSlug: string, filters: any) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return [];

    const where: any = { tenantId };
    if (filters.from && filters.to) {
        where.startAt = { gte: new Date(filters.from), lte: new Date(filters.to) };
    }

    return prisma.appointment.findMany({
        where,
        include: { service: true, staff: true }
    });
}

export async function createAppointment(tenantSlug: string, data: any) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) throw new Error("Tenant not found");

    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error("Service not found");

    const start = new Date(data.startAt);
    const end = new Date(start.getTime() + service.durationMin * 60000);

    return prisma.appointment.create({
        data: {
            tenantId,
            staffId: data.staffId,
            serviceId: data.serviceId,
            clientName: data.clientName,
            startAt: start,
            endAt: end,
            status: "confirmed"
        }
    });
}

export async function getClients(tenantSlug: string) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) return [];
    return prisma.client.findMany({ where: { tenantId } });
}

export async function createClient(tenantSlug: string, data: any) {
    const tenantId = await getTenantId(tenantSlug);
    if (!tenantId) throw new Error("Tenant not found");
    return prisma.client.create({ data: { ...data, tenantId } });
}

export async function authenticateUser(credentials: any) {
    if (!credentials?.email || !credentials?.password) return null;

    const user = await prisma.user.findUnique({ where: { email: credentials.email } });
    if (!user || !user.passwordHash) return null;

    const isValid = await compare(credentials.password, user.passwordHash);
    if (!isValid) return null;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
    };
}
