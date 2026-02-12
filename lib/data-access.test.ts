import { test } from 'node:test';
import assert from 'node:assert';

// Mock Prisma Client
const mockPrisma = {
    appointment: {
        findMany: () => Promise.resolve([
            {
                id: 'mocked-db-appt-1',
                startAt: new Date('2024-05-20T10:00:00Z'),
                endAt: new Date('2024-05-20T11:00:00Z'),
                status: 'CONFIRMED',
                contact: { name: 'DB Client 1' },
                service: { name: 'DB Service 1', price: 100 },
                staff: { name: 'DB Staff 1' },
                notes: 'DB Notes'
            }
        ])
    }
};

// Set global mock BEFORE import
(global as any).prisma = mockPrisma;

test('getAppointments - Mock Mode (Environment Variable)', async () => {
    // Setup Mock Mode
    process.env.MOCK_MODE = 'true';

    // Import module dynamically to ensure env var is read if it was cached (though isMockMode reads fresh)
    const { getAppointments } = await import('./data-access.ts');

    const result = await getAppointments('any-tenant');

    // Validate it returns the static mock data from lib/data-access.ts
    // The static mock data has clientName: 'Mock Client 1'
    assert.ok(result.length >= 2, 'Should return at least 2 mock appointments');
    const first = result.find(r => r.id === '1');
    assert.ok(first, 'Should find appointment with id 1');
    assert.strictEqual(first?.clientName, 'Mock Client 1');
});

test('getAppointments - Real Mode (Mocked DB)', async () => {
    // Setup Real Mode
    process.env.MOCK_MODE = 'false';
    // Ensure DATABASE_URL is set so it doesn't fallback to mock mode
    process.env.DATABASE_URL = 'postgres://mocked:5432/db';

    // Import again (node caches modules, so we get the same module instance)
    const { getAppointments } = await import('./data-access.ts');

    const result = await getAppointments('test-tenant');

    // Validate it calls our mocked DB and returns transformed data
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 'mocked-db-appt-1');
    assert.strictEqual(result[0].clientName, 'DB Client 1');
    assert.strictEqual(result[0].status, 'confirmed'); // Lowercase transformation
});
