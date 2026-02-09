// Abstraction layer
import * as mockDb from './mock';

// Dynamic import strategy to avoid bundling prisma in mock mode
let db = mockDb;

if (process.env.DATA_MODE === 'db' && process.env.DATABASE_URL) {
    // We cannot use await import here easily because this module needs to export functions synchronously.
    // However, since we are in Next.js Server Components / API Routes, we can require it?
    // Or we rely on the build process.
    // A safer way for Next.js is to have separate entry points or conditional exports, but let's try a dynamic requires if running in Node.
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const prismaDb = require('./prisma');
        db = prismaDb;
        console.log("Using Database Mode (Prisma)");
    } catch (e) {
        console.error("Failed to load Prisma DB adapter, falling back to mock.", e);
    }
} else {
    console.log("Using Mock Data Mode");
}

export const getServices = db.getServices;
export const createService = db.createService;
export const getStaff = db.getStaff;
export const createStaff = db.createStaff;
export const getAppointments = db.getAppointments;
export const createAppointment = db.createAppointment;
export const getClients = db.getClients;
export const createClient = db.createClient;
export const authenticateUser = db.authenticateUser;
