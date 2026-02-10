from playwright.sync_api import sync_playwright, expect
import time

def run():
    print("Starting verification of Incredible UI...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to demo page...")
        try:
            page.goto("http://localhost:3000/demo/clinica", timeout=60000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            return

        # 1. Verify Initial Dashboard
        print("1. Verifying Dashboard...")
        expect(page.get_by_text("Turnos Hoy")).to_be_visible(timeout=30000)
        expect(page.get_by_text("Rendimiento Semanal")).to_be_visible() # Chart title
        print("   - Dashboard verified.")

        # 2. Verify Navigation to Agenda
        print("2. Verifying Agenda...")
        page.get_by_role("button", name="Agenda").click()
        expect(page.get_by_text("Agenda del Día")).to_be_visible()
        # Toggle Grid/List
        page.get_by_role("button", name="Lista").click()
        # expect(page.get_by_text("No hay turnos agendados") | page.get_by_text("Juan Perez")).to_be_visible()
        print("   - Agenda navigation verified.")

        # 3. Verify Patients & Search
        print("3. Verifying Patients...")
        page.get_by_role("button", name="Pacientes").click()
        expect(page.get_by_placeholder("Buscar por nombre")).to_be_visible()
        # Click on a patient row (Juan Perez)
        page.get_by_text("Juan Perez (Demo)").click()
        expect(page.get_by_text("Notas Clínicas")).to_be_visible() # Sidebar details
        print("   - Patients verified.")

        # 4. Verify Marketing
        print("4. Verifying Marketing...")
        page.get_by_role("button", name="Marketing").click()
        expect(page.get_by_text("Campañas de Marketing")).to_be_visible()
        expect(page.get_by_text("Crear Nueva")).to_be_visible()
        print("   - Marketing verified.")

        # 5. Verify Reports (Recharts)
        print("5. Verifying Reports...")
        page.get_by_role("button", name="Reportes").click()
        expect(page.get_by_text("Reportes y Estadísticas")).to_be_visible()
        # Check if charts container exists
        expect(page.get_by_text("Turnos por Día")).to_be_visible()
        print("   - Reports verified.")

        # 6. Verify Settings Tabs
        print("6. Verifying Settings...")
        page.get_by_role("button", name="Configuración").click()
        expect(page.get_by_text("Información de la Clínica")).to_be_visible()

        # Switch to Schedule tab
        page.get_by_role("button", name="Horarios").click()
        expect(page.get_by_text("Horarios de Atención")).to_be_visible()
        print("   - Settings verified.")

        # 7. Verify Simulator Panel
        print("7. Verifying Simulator...")
        expect(page.get_by_text("Simulador en Vivo")).to_be_visible()
        # Test input
        frame = page.frame_locator("iframe").first # No iframe, it's a div simulating phone
        # It's inside WhatsAppSimulator component
        input_box = page.get_by_placeholder("Escribe un mensaje...")
        input_box.fill("Hola")
        input_box.press("Enter")
        expect(page.get_by_text("Hola! Soy el asistente")).to_be_visible(timeout=10000)
        print("   - Simulator verified.")

        page.screenshot(path="verification/demo-incredible.png")
        print("Screenshot saved: demo-incredible.png")

        browser.close()
    print("Verification complete.")

if __name__ == "__main__":
    run()
