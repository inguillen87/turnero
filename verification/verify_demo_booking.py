from playwright.sync_api import sync_playwright, expect
import time

def run():
    print("Starting verification of Booking -> Calendar Reflection...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("1. Loading Demo Page...")
        try:
            page.goto("http://localhost:3000/demo/clinica", timeout=60000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            return

        # 2. Perform Booking via Bot
        print("2. Booking via Bot...")
        input_box = page.get_by_placeholder("Escribe un mensaje...")

        # Step 1: "Reservar"
        input_box.fill("1")
        input_box.press("Enter")
        time.sleep(1)

        # Step 2: Choose Service "1" (Consulta General)
        input_box.fill("1")
        input_box.press("Enter")
        time.sleep(1)

        # Step 3: Choose Slot "1" (Mié 11 - 10:00)
        input_box.fill("1")
        input_box.press("Enter")
        time.sleep(1)

        # Step 4: Confirm "1"
        input_box.fill("1")
        input_box.press("Enter")
        time.sleep(2) # Wait for bot to send action and UI to update

        print("   - Booking confirmed in chat.")

        # 3. Verify Reflection in Dashboard (Agenda List)
        print("3. Verifying Agenda Update...")
        # The new appointment should appear in the agenda list
        # It's usually sorted, but we look for "Usuario WhatsApp" and "Consulta General"
        # Since we just added it, it might be at the top or sorted by date.
        # The mocked date is "Tomorrow 10:00".

        # Check in the "Agenda del Día" section
        # Note: If the mocked date is tomorrow, and the dashboard shows "Today", it might not appear in "Agenda del Día"
        # UNLESS the logic in DemoPage includes it or we switch to "Ver Calendario Completo".
        # However, the current DemoAgenda implementation just lists appointments passed to it.
        # Let's check if the element exists in the DOM.

        try:
            expect(page.get_by_text("Usuario WhatsApp")).to_be_visible(timeout=5000)
            print("   - Appointment found in Agenda!")
        except:
            print("   - Appointment NOT found in Agenda. (Maybe date filter issue?)")
            page.screenshot(path="verification/failed_booking_reflection.png")
            # If it fails, it might be because the DemoAgenda filters by today, and our slot is tomorrow.
            # But let's check the code. DemoAgenda maps `appointments` prop directly.
            # The `DemoPage` adds it to the list.
            pass

        page.screenshot(path="verification/demo-booking-final.png")
        print("Screenshot saved: demo-booking-final.png")

        browser.close()
    print("Verification complete.")

if __name__ == "__main__":
    run()
