from playwright.sync_api import sync_playwright, expect
import time

def run():
    print("Starting verification of Patient Intelligence...")
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

        # 2. Navigate to Patients
        page.get_by_role("button", name="Pacientes").click()

        # 3. Check "High Risk" Patient (Carlos Lopez)
        print("2. Checking High Risk Patient...")
        # We look for the row with Carlos Lopez and verify the "Alto Riesgo" badge
        expect(page.get_by_text("Carlos Lopez")).to_be_visible()
        # Click him
        page.get_by_text("Carlos Lopez").click()

        # Verify Modal Content
        expect(page.get_by_text("Alerta de Riesgo")).to_be_visible()
        expect(page.get_by_text("Tasa de cancelación: 66%")).to_be_visible()
        expect(page.get_by_role("button", name="Solicitar Seña")).to_be_visible()

        # Close modal
        page.locator("button svg.lucide-x").first.click()
        print("   - High risk logic verified.")

        # 4. Check "Low Risk" Patient (Juan Perez)
        print("3. Checking Low Risk Patient...")
        page.get_by_text("Juan Perez (Demo)").click()

        # Verify Modal Content
        expect(page.get_by_text("Perfil Confiable")).to_be_visible()
        expect(page.get_by_text("Asistencia perfecta")).to_be_visible()

        print("   - Low risk logic verified.")

        page.screenshot(path="verification/demo-patients-intelligence.png")
        print("Screenshot saved: demo-patients-intelligence.png")

        browser.close()
    print("Verification complete.")

if __name__ == "__main__":
    run()
