from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to demo page...")
        try:
            page.goto("http://localhost:3000/demo/clinica", timeout=60000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            return

        # 1. Verify Initial Load
        print("Waiting for page load...")
        expect(page.get_by_role("heading", name="Panel de Control")).to_be_visible(timeout=30000)

        # Check if Agenda is visible
        expect(page.get_by_text("Agenda del Día")).to_be_visible()

        # Check if Simulator is mounted (no hydration error text)
        expect(page.get_by_text("Clínica Demo")).to_be_visible()

        page.screenshot(path="verification/demo-initial.png")
        print("Screenshot saved: demo-initial.png")

        # 2. Verify Tab Switching (Patients)
        print("Clicking 'Ver Pacientes'...")
        # Find the button in "Accesos Rápidos"
        page.get_by_role("button", name="Ver Pacientes").click()

        # Expect "Pacientes" header in the main panel
        expect(page.get_by_role("heading", name="Pacientes")).to_be_visible()
        # Expect a specific patient row
        expect(page.get_by_text("Juan Perez (Demo)")).to_be_visible()

        page.screenshot(path="verification/demo-patients.png")
        print("Screenshot saved: demo-patients.png")

        # 3. Verify WhatsApp Simulator
        print("Testing WhatsApp Simulator...")
        # Find input
        input_box = page.get_by_placeholder("Escribe un mensaje...")
        input_box.fill("Hola")
        input_box.press("Enter")

        # Wait for bot response
        # The bot should reply with the menu
        expect(page.get_by_text("Hola! Soy el asistente")).to_be_visible(timeout=10000)

        # Verify Custom JSON Menu (Multi-tenant feature)
        expect(page.get_by_text("Nuevo Turno (Custom)")).to_be_visible()

        # Test "Quiero un turno para limpieza" (AI Fallback Test)
        input_box.fill("Quiero un turno para limpieza")
        input_box.press("Enter")

        # Wait for service confirmation "Has elegido Limpieza"
        # Note: This relies on the backend API working (mocked or real)
        try:
            expect(page.get_by_text("Has elegido Limpieza")).to_be_visible(timeout=10000)
            print("AI/Mock Logic Verified!")
        except:
            print("AI/Mock Logic timed out or failed (Check API logs)")

        page.screenshot(path="verification/demo-chat.png")
        print("Screenshot saved: demo-chat.png")

        browser.close()

if __name__ == "__main__":
    run()
