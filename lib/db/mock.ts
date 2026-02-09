export const MOCK_SERVICES = [
    { id: "1", name: "Consulta", durationMin: 30, price: 15000, active: true },
    { id: "2", name: "Limpieza", durationMin: 45, price: 25000, active: true },
    { id: "3", name: "Blanqueamiento", durationMin: 60, price: 50000, active: true },
];

export const MOCK_STAFF = [
    { id: "1", name: "Dr. Roberto", active: true },
    { id: "2", name: "Dra. Ana", active: true },
];

export const MOCK_APPOINTMENTS = [
    {
        id: "1",
        startAt: new Date().toISOString(),
        clientName: "Juan Perez",
        status: "confirmed",
        service: { name: "Consulta", price: 15000 },
        staff: { name: "Dr. Roberto" }
    },
    {
        id: "2",
        startAt: new Date(Date.now() + 3600000).toISOString(),
        clientName: "Maria Garcia",
        status: "pending",
        service: { name: "Limpieza", price: 25000 },
        staff: { name: "Dra. Ana" }
    }
];

export const MOCK_CLIENTS = [
    { id: "1", name: "Juan Perez", email: "juan@example.com", phone: "123456789" },
    { id: "2", name: "Maria Garcia", email: "maria@example.com", phone: "987654321" },
];

export async function getServices(tenantSlug: string) {
    return MOCK_SERVICES;
}

export async function createService(tenantSlug: string, data: any) {
    return { ...data, id: "mock-id-" + Date.now() };
}

export async function getStaff(tenantSlug: string) {
    return MOCK_STAFF;
}

export async function createStaff(tenantSlug: string, data: any) {
    return { ...data, id: "mock-id-" + Date.now() };
}

export async function getAppointments(tenantSlug: string, filters: any) {
    return MOCK_APPOINTMENTS;
}

export async function createAppointment(tenantSlug: string, data: any) {
    return { ...data, id: "mock-id-" + Date.now(), status: "confirmed" };
}

export async function getClients(tenantSlug: string) {
    return MOCK_CLIENTS;
}

export async function createClient(tenantSlug: string, data: any) {
    return { ...data, id: "mock-id-" + Date.now() };
}

export async function authenticateUser(credentials: any) {
    if (credentials.email === "admin@turnero.com" && credentials.password === "password") {
        return {
            id: "mock-user-id",
            name: "Admin User",
            email: "admin@turnero.com",
            role: "admin",
            tenantId: "demo-tenant-id"
        };
    }
    return null;
}
