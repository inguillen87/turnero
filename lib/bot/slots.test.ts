import { test } from 'node:test';
import assert from 'node:assert';
import { generateBaseSlots } from './slots.ts';

test('generateBaseSlots - basic generation', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);

    // Check total number of slots: 3 days * 4 slots per day = 12 slots
    assert.strictEqual(slots.length, 12, 'Should generate exactly 12 slots');
});

test('generateBaseSlots - date sequence', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const afterTomorrow = new Date(now);
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);

    const inThreeDays = new Date(now);
    inThreeDays.setDate(inThreeDays.getDate() + 3);

    // First 4 slots should be tomorrow
    for (let i = 0; i < 4; i++) {
        const d = new Date(slots[i].dateIso);
        assert.strictEqual(d.getDate(), tomorrow.getDate(), `Slot ${i} should be tomorrow`);
    }

    // Next 4 slots should be day after tomorrow
    for (let i = 4; i < 8; i++) {
        const d = new Date(slots[i].dateIso);
        assert.strictEqual(d.getDate(), afterTomorrow.getDate(), `Slot ${i} should be day after tomorrow`);
    }

    // Last 4 slots should be in 3 days
    for (let i = 8; i < 12; i++) {
        const d = new Date(slots[i].dateIso);
        assert.strictEqual(d.getDate(), inThreeDays.getDate(), `Slot ${i} should be in 3 days`);
    }
});

test('generateBaseSlots - hours', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);

    const expectedHours = [10, 11, 14, 16];

    // Check hours for each day
    for (let day = 0; day < 3; day++) {
        for (let h = 0; h < 4; h++) {
            const slotIndex = day * 4 + h;
            const d = new Date(slots[slotIndex].dateIso);
            assert.strictEqual(d.getHours(), expectedHours[h], `Slot ${slotIndex} should be at ${expectedHours[h]}:00`);
            assert.strictEqual(d.getMinutes(), 0);
            assert.strictEqual(d.getSeconds(), 0);
        }
    }
});

test('generateBaseSlots - unique IDs', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);

    const ids = slots.map(s => s.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(uniqueIds.size, 12, 'All slot IDs should be unique');
});

test('generateBaseSlots - labels contain time', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);

    const expectedTimes = ['10:00', '11:00', '14:00', '16:00'];

    for (let i = 0; i < 12; i++) {
        const expectedTime = expectedTimes[i % 4];
        assert.ok(slots[i].label.includes(expectedTime), `Label "${slots[i].label}" should contain "${expectedTime}"`);
    }
});
