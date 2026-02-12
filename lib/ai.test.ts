import { test } from 'node:test';
import assert from 'node:assert';

// Ensure apiKey is undefined to trigger fallback logic
delete process.env.OPENAI_API_KEY;

// Mock Context
const mockContext: any = {
    services: [
        { id: '1', name: 'General Checkup', priceCents: 5000 },
        { id: '2', name: 'Dental Cleaning', priceCents: 8000 },
        { id: '3', name: 'Root Canal', priceCents: 15000 },
        { id: '4', name: 'Big Toe', priceCents: 1000 }
    ],
    conversationHistory: [],
    now: new Date('2024-05-20T10:00:00Z'),
    tenantName: 'Test Clinic',
    locale: 'en',
    tenantType: 'medical',
    botPersonality: 'professional'
};

test('analyzeMessage - Fallback Logic (No OpenAI Key)', async (t) => {
    // Import the module under test
    const { analyzeMessage } = await import('./ai.ts');

    await t.test('Service Matching - Full Name', async () => {
        const result = await analyzeMessage("I want a General Checkup", mockContext);
        assert.strictEqual(result.intent, 'booking');
        assert.strictEqual(result.entities?.serviceName, 'General Checkup');
    });

    await t.test('Service Matching - Partial Word > 3 chars', async () => {
        const result = await analyzeMessage("I need a Cleaning please", mockContext);
        assert.strictEqual(result.intent, 'booking');
        assert.strictEqual(result.entities?.serviceName, 'Dental Cleaning');
    });

    await t.test('Service Matching - Short Word Ignore', async () => {
        // "Big" is 3 chars, should not match "Big Toe" via partial match logic
        const result = await analyzeMessage("I have a Big problem", mockContext);
        assert.notStrictEqual(result.entities?.serviceName, 'Big Toe');
        assert.strictEqual(result.intent, 'other');
    });

    await t.test('Price Inquiry', async () => {
        const result = await analyzeMessage("What is the price?", mockContext);
        assert.strictEqual(result.intent, 'query_prices');
        assert.ok(result.message.includes("prices"));
    });

    await t.test('Cancellation Intent', async () => {
        const result = await analyzeMessage("I want to cancel my appointment", mockContext);
        assert.strictEqual(result.intent, 'cancellation');
    });

    await t.test('Date Extraction - Tomorrow', async () => {
        const result = await analyzeMessage("Can I book for tomorrow?", mockContext);
        // Tomorrow relative to 2024-05-20 is 2024-05-21
        assert.strictEqual(result.intent, 'booking');
        assert.strictEqual(result.entities?.date, '2024-05-21');
    });

    await t.test('Date Extraction - Today', async () => {
        const result = await analyzeMessage("I need something for today", mockContext);
        // Today is 2024-05-20
        assert.strictEqual(result.intent, 'booking');
        assert.strictEqual(result.entities?.date, '2024-05-20');
    });

    await t.test('Time Extraction - 12h format (PM)', async () => {
        const result = await analyzeMessage("Is 2pm available?", mockContext);
        // 2pm -> 14:00
        assert.strictEqual(result.entities?.time, '14:00');
    });

    await t.test('Time Extraction - 12h format (AM)', async () => {
        const result = await analyzeMessage("Is 10am available?", mockContext);
        // 10am -> 10:00
        assert.strictEqual(result.entities?.time, '10:00');
    });

    await t.test('Time Extraction - 24h format', async () => {
        const result = await analyzeMessage("I can come at 15:30", mockContext);
        // 15:30 -> 15:30
        assert.strictEqual(result.entities?.time, '15:30');
    });

    await t.test('Booking Keywords', async () => {
        const result = await analyzeMessage("I want to book an appointment", mockContext);
        assert.strictEqual(result.intent, 'booking');
    });

    await t.test('Confirmation Keywords', async () => {
        const result = await analyzeMessage("Yes, that works", mockContext);
        assert.strictEqual(result.intent, 'confirmation');
    });

    await t.test('Other / Unclear', async () => {
        const result = await analyzeMessage("Hello there", mockContext);
        assert.strictEqual(result.intent, 'other');
    });
});
