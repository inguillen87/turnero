from playwright.sync_api import sync_playwright

def verify_landing_page():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to root
        print("Navigating to root...")
        page.goto("http://localhost:3000")

        # Check for heading
        print("Checking for heading...")
        heading = page.get_by_role("heading", name="Turnero Pro")
        if heading.is_visible():
            print("Heading 'Turnero Pro' is visible.")
        else:
            print("Heading not found.")

        # Check for link
        print("Checking for link...")
        link = page.get_by_role("link", name="Ir a la Demo")
        if link.is_visible():
            print("Link 'Ir a la Demo' is visible.")
        else:
            print("Link not found.")

        # Take screenshot of landing page
        page.screenshot(path="landing_page.png")
        print("Screenshot saved to landing_page.png")

        # Click link and verify navigation
        print("Clicking link...")
        link.click()
        page.wait_for_url("**/t/demo/dashboard")
        print("Navigated to dashboard.")

        # Take screenshot of dashboard
        page.screenshot(path="dashboard.png")
        print("Screenshot saved to dashboard.png")

        browser.close()

if __name__ == "__main__":
    verify_landing_page()
