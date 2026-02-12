import { Redis } from "@upstash/redis";

// Initialize Redis if env vars are present (Mock if not)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Mock In-Memory Store for fallback
const memBookings = new Set<string>();

export interface Slot {
    id: string;
    label: string;
    dateIso: string;
}

export const DEFAULT_SLOT_HOURS = [10, 11, 14, 16];

// Generate base slots for the next 3 days
export function generateBaseSlots(now: Date = new Date(), hours: number[] = DEFAULT_SLOT_HOURS): Slot[] {
    const slots: Slot[] = [];

    // Start tomorrow
    for (let day = 1; day <= 3; day++) {
        const d = new Date(now);
        d.setDate(d.getDate() + day);

        // Iterate over the configured hours
        hours.forEach(hour => {
            d.setHours(hour, 0, 0, 0);
            const id = `slot_${d.getTime()}`;
            const dayName = d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' });
            slots.push({
                id,
                label: `${dayName} - ${hour}:00`,
                dateIso: d.toISOString()
            });
        });
    }
    return slots;
}

export async function getAvailableSlots(tenantId: string = 'demo'): Promise<Slot[]> {
    const allSlots = generateBaseSlots();

    if (redis) {
        // Fetch booked slot IDs from Redis Set
        const bookedIds = await redis.smembers(`bookings:${tenantId}`);
        return allSlots.filter(s => !bookedIds.includes(s.id));
    } else {
        // Use memory fallback
        return allSlots.filter(s => !memBookings.has(s.id));
    }
}

export async function reserveSlot(slotId: string, tenantId: string = 'demo'): Promise<boolean> {
    if (redis) {
        const added = await redis.sadd(`bookings:${tenantId}`, slotId);
        return added > 0; // Returns 1 if added (was free), 0 if already present (booked)
    } else {
        if (memBookings.has(slotId)) return false;
        memBookings.add(slotId);
        return true;
    }
}

export async function releaseSlot(slotId: string, tenantId: string = 'demo') {
    if (redis) {
        await redis.srem(`bookings:${tenantId}`, slotId);
    } else {
        memBookings.delete(slotId);
    }
}
