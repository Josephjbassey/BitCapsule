import asyncio
from playwright.async_api import async_playwright

async def verify_render():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        try:
            page = await browser.new_page()
            await page.goto("http://localhost:3002")
            # Wait for content to load deterministically
            await page.wait_for_load_state("networkidle")

            # Take screenshot
            await page.screenshot(path="screenshot.png", full_page=True)

            # Check for branding
            content = await page.content()
            if "BitCapsule" in content:
                print("Verification successful: BitCapsule branding found.")
                return True
            else:
                print("Verification failed: BitCapsule branding not found.")
                return False
        except Exception as e:
            print(f"Verification error: {e}")
            return False
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_render())
