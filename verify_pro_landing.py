from playwright.sync_api import sync_playwright

def verify_pro_landing():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Larger viewport to see the grandeur
        page = browser.new_page(viewport={"width": 1440, "height": 1200})

        try:
            # Wait for server to be up
            page.goto("http://localhost:3002", timeout=60000)

            # Take screenshot of the Hero
            page.screenshot(path="landing_pro_hero.png")
            print("Hero screenshot saved.")

            # Scroll to Features
            page.locator("#features").scroll_into_view_if_needed()
            page.screenshot(path="landing_pro_features.png")
            print("Features screenshot saved.")

            # Scroll to Pricing
            page.locator("text=$300").scroll_into_view_if_needed()
            page.screenshot(path="landing_pro_pricing.png")
            print("Pricing screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_pro_landing()
