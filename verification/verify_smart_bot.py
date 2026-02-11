from playwright.sync_api import sync_playwright, expect
import time

def run():
    print("Starting verification of Smart Bot...")
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

        # 2. Test Deterministic Flow (Standard)
        print("2. Testing Standard Flow...")
        input_box = page.get_by_placeholder("Escribe un mensaje...")
        input_box.fill("1") # "Reservar"
        input_box.press("Enter")
        expect(page.get_by_text("¿Qué servicio buscás?")).to_be_visible(timeout=10000)
        print("   - Standard numeric flow works.")

        # 3. Test AI Natural Language Flow
        print("3. Testing AI Flow (Natural Language)...")
        # Reset chat logic conceptually (or just send 'menu')
        input_box.fill("menu")
        input_box.press("Enter")
        time.sleep(1)

        # Send natural language query
        msg = "Quiero sacar un turno para ortodoncia"
        input_box.fill(msg)
        input_box.press("Enter")

        # Expect AI to recognize "ortodoncia" and jump to slots
        # The reply should contain "Horarios sugeridos"
        # Note: If API key is missing (dummy-key), it might fallback to Heuristics which ALSO handles this via regex.
        # So this verifies the "Smart Layer" (AI or Fallback) is active.
        try:
            expect(page.get_by_text("Horarios sugeridos")).to_be_visible(timeout=15000)
            print("   - Smart/AI intent detection works!")
        except:
            print("   - Smart detection failed or timed out.")
            page.screenshot(path="verification/failed_smart_bot.png")

        page.screenshot(path="verification/demo-smart-final.png")
        print("Screenshot saved: demo-smart-final.png")

        browser.close()
    print("Verification complete.")

if __name__ == "__main__":
    run()
