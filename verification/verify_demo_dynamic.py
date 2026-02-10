from playwright.sync_api import sync_playwright, expect
import time

def run():
    print("Starting verification of Dynamic Features...")
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

        # 2. Verify Help Modal
        print("2. Verifying Help Modal...")
        page.wait_for_timeout(2000)
        header = page.locator("div.h-16.bg-white")
        header.locator("button").last.click()
        expect(page.get_by_text("Bienvenido a Turnero Pro")).to_be_visible()
        page.locator(".fixed.inset-0 button").first.click()
        print("   - Help modal verified.")

        # 3. Add a Custom Service
        print("3. Adding Custom Service...")
        page.get_by_text("Configuración").click()
        page.get_by_role("button", name="Servicios").click()
        page.get_by_role("button", name="Agregar").click()

        page.get_by_placeholder("Ej: Implante").fill("Implante Titanio")
        page.get_by_placeholder("5000").fill("150000")

        # Use exact match to avoid "Guardar Cambios"
        page.get_by_role("button", name="Guardar", exact=True).click()

        # Verify it appears in the list
        expect(page.get_by_text("Implante Titanio")).to_be_visible()
        print("   - Service added in Settings.")

        # 4. Verify Custom Service in Chat
        print("4. Verifying Custom Service in Chat...")
        input_box = page.get_by_placeholder("Escribe un mensaje...")
        input_box.fill("reservar")
        input_box.press("Enter")

        time.sleep(3)

        try:
            expect(page.locator("div").filter(has_text="Implante Titanio").last).to_be_visible(timeout=10000)
            print("   - Custom service found in Chat!")
        except:
            print("   - Custom service NOT found in Chat.")
            page.screenshot(path="verification/failed_chat_service.png")

        page.screenshot(path="verification/demo-dynamic-final.png")
        print("Screenshot saved: demo-dynamic-final.png")

        browser.close()
    print("Verification complete.")

if __name__ == "__main__":
    run()
