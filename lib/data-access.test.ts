import { test, describe, it, mock } from 'node:test';
import assert from 'node:assert';

// 1. Mock `prisma` globally BEFORE importing anything
const mockFindUnique = mock.fn(async () => ({ id: 'tenant-123' }));
const mockFindMany = mock.fn(async () => []);

const mockPrismaClient = {
  tenant: { findUnique: mockFindUnique },
  appointment: { findMany: mockFindMany },
};

// Typescript might complain about `global`, so we cast it
(global as any).prisma = mockPrismaClient;

// 2. Set environment variables to bypass MOCK_MODE
process.env.MOCK_MODE = 'false';
process.env.DATABASE_URL = 'postgres://mock:5432/mock';
process.env.NODE_ENV = 'test';

describe('getAppointments Performance', () => {
  it('should optimize to a single DB call', async () => {

    // Re-import to ensure fresh execution context if needed (though modules are cached)
    // Since we only run this test once per process, it's fine.
    const { getAppointments } = await import('./data-access');

    await getAppointments('demo-tenant');

    // Verify OPTIMIZED behavior:
    // 1. findUnique for tenant should NOT be called
    assert.strictEqual(mockFindUnique.mock.callCount(), 0, 'Should NOT call findUnique for tenant');

    // 2. findMany for appointments SHOULD be called ONCE
    assert.strictEqual(mockFindMany.mock.callCount(), 1, 'Should call findMany for appointments');

    // Check arguments for the call (findMany)
    const findManyArgs = mockFindMany.mock.calls[0].arguments;

    // The where clause should use nested filtering
    assert.deepStrictEqual(findManyArgs[0].where, {
      tenant: { slug: 'demo-tenant' }
    });
  });
});
