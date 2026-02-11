import { getAvailableSlots, reserveSlot, releaseSlot } from "../lib/bot/slots";

// Simple script to test concurrency logic
async function run() {
    console.log("1. Fetching slots...");
    const slots = await getAvailableSlots();
    console.log("   Available:", slots.length);

    if (slots.length === 0) {
        console.error("No slots available to test!");
        return;
    }

    const targetSlot = slots[0];
    console.log(`2. Trying to reserve ${targetSlot.label} (${targetSlot.id})...`);

    const success1 = await reserveSlot(targetSlot.id);
    console.log("   User A reservation:", success1 ? "SUCCESS" : "FAILED");

    console.log("3. User B tries to reserve same slot...");
    const success2 = await reserveSlot(targetSlot.id);
    console.log("   User B reservation:", success2 ? "FAILED (Correct)" : "SUCCESS (Error: Double Booking)");

    console.log("4. Fetching slots again...");
    const slotsAfter = await getAvailableSlots();
    const isHidden = !slotsAfter.find(s => s.id === targetSlot.id);
    console.log("   Slot hidden from list:", isHidden ? "YES" : "NO");

    // Cleanup
    await releaseSlot(targetSlot.id);
    console.log("5. Cleanup done.");
}

run().catch(console.error);
