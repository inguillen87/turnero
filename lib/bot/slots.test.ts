import { test } from 'node:test';
import assert from 'node:assert';
import { generateBaseSlots, DEFAULT_SLOT_HOURS } from './slots.ts';

test('generateBaseSlots - basic generation', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);

    const expectedSlots = 3 * DEFAULT_SLOT_HOURS.length;
    // Check total number of slots: 3 days * N slots per day
    assert.strictEqual(slots.length, expectedSlots, `Should generate exactly ${expectedSlots} slots`);
});

test('generateBaseSlots - date sequence', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);
    const slotsPerDay = DEFAULT_SLOT_HOURS.length;

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const afterTomorrow = new Date(now);
    afterTomorrow.setDate(afterTomorrow.getDate() + 2);

    const inThreeDays = new Date(now);
    inThreeDays.setDate(inThreeDays.getDate() + 3);

    // First N slots should be tomorrow
    for (let i = 0; i < slotsPerDay; i++) {
        const d = new Date(slots[i].dateIso);
        assert.strictEqual(d.getDate(), tomorrow.getDate(), `Slot ${i} should be tomorrow`);
    }

    // Next N slots should be day after tomorrow
    for (let i = slotsPerDay; i < slotsPerDay * 2; i++) {
        const d = new Date(slots[i].dateIso);
        assert.strictEqual(d.getDate(), afterTomorrow.getDate(), `Slot ${i} should be day after tomorrow`);
    }

    // Last N slots should be in 3 days
    for (let i = slotsPerDay * 2; i < slotsPerDay * 3; i++) {
        const d = new Date(slots[i].dateIso);
        assert.strictEqual(d.getDate(), inThreeDays.getDate(), `Slot ${i} should be in 3 days`);
    }
});

test('generateBaseSlots - hours', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);
    const slotsPerDay = DEFAULT_SLOT_HOURS.length;

    // Check hours for each day
    for (let day = 0; day < 3; day++) {
        for (let h = 0; h < slotsPerDay; h++) {
            const slotIndex = day * slotsPerDay + h;
            const d = new Date(slots[slotIndex].dateIso);
            assert.strictEqual(d.getHours(), DEFAULT_SLOT_HOURS[h], `Slot ${slotIndex} should be at ${DEFAULT_SLOT_HOURS[h]}:00`);
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
    assert.strictEqual(uniqueIds.size, 3 * DEFAULT_SLOT_HOURS.length, 'All slot IDs should be unique');
});

test('generateBaseSlots - labels contain time', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const slots = generateBaseSlots(now);
    const slotsPerDay = DEFAULT_SLOT_HOURS.length;

    const expectedTimes = DEFAULT_SLOT_HOURS.map(h => `${h}:00`);

    for (let i = 0; i < slots.length; i++) {
        const expectedTime = expectedTimes[i % slotsPerDay];
        assert.ok(slots[i].label.includes(expectedTime), `Label "${slots[i].label}" should contain "${expectedTime}"`);
    }
});

test('generateBaseSlots - custom hours', () => {
    const now = new Date('2024-05-20T12:00:00Z');
    const customHours = [8, 12, 18];
    const slots = generateBaseSlots(now, customHours);

    // Check total slots: 3 days * 3 slots = 9
    assert.strictEqual(slots.length, 9, 'Should generate 9 slots with custom hours');

    // Check hours
    const slotsPerDay = customHours.length;
    for (let day = 0; day < 3; day++) {
        for (let h = 0; h < slotsPerDay; h++) {
            const slotIndex = day * slotsPerDay + h;
            const d = new Date(slots[slotIndex].dateIso);
            assert.strictEqual(d.getHours(), customHours[h], `Custom slot should be at ${customHours[h]}:00`);
        }
    }
});
