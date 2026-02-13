import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:3000")
            page.goto("http://localhost:3000")
            # Wait for hydration
            page.wait_for_timeout(5000)

            print("Taking screenshot")
            page.screenshot(path="verification_screenshot.png")
            print("Screenshot saved to verification_screenshot.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
