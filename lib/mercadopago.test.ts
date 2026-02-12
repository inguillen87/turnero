import { test, mock, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { Preference } from 'mercadopago';

// Mock the prototype method 'create' of Preference class
const createMock = mock.method(Preference.prototype, 'create', async () => {
    return { init_point: 'http://mock-payment-url.com' };
});

describe('createPaymentPreference', async () => {
  let createPaymentPreference: any;
  let consoleWarnMock: any;

  beforeEach(async () => {
    // Reset env vars
    delete process.env.MP_ACCESS_TOKEN;
    createMock.mock.resetCalls();

    // Mock console.warn to suppress output during tests
    consoleWarnMock = mock.method(console, 'warn', () => {});

    // Import the module under test
    const mod = await import('./mercadopago.ts');
    createPaymentPreference = mod.createPaymentPreference;
  });

  afterEach(() => {
    delete process.env.MP_ACCESS_TOKEN;
    // Restore console.warn
    consoleWarnMock.mock.restore();
  });

  test('should return null and log warning when MP_ACCESS_TOKEN is missing', async () => {
    // Ensure token is missing
    delete process.env.MP_ACCESS_TOKEN;

    const result = await createPaymentPreference(
      [{ title: 'Test Item', unit_price: 100, quantity: 1 }],
      { email: 'test@example.com' },
      'ref-123'
    );

    assert.strictEqual(result, null);
    // Should NOT call create
    assert.strictEqual(createMock.mock.callCount(), 0);
    // Should have logged a warning
    assert.strictEqual(consoleWarnMock.mock.callCount(), 1);
    assert.match(consoleWarnMock.mock.calls[0].arguments[0], /MP_ACCESS_TOKEN not set/);
  });

  test('should return init_point when MP_ACCESS_TOKEN is present', async () => {
    // Set token
    process.env.MP_ACCESS_TOKEN = 'test-token';

    const result = await createPaymentPreference(
      [{ title: 'Test Item', unit_price: 100, quantity: 1 }],
      { email: 'test@example.com' },
      'ref-123'
    );

    assert.strictEqual(result, 'http://mock-payment-url.com');
    assert.strictEqual(createMock.mock.callCount(), 1);
  });
});
