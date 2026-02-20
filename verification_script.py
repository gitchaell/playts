import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Test 1: Desktop Layout
        # 1280x800
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto("http://localhost:4321")
        time.sleep(2) # wait for hydration

        # Verify sidebar is visible
        # Sidebar.tsx: <span ...>Files</span> with "uppercase" class.
        sidebar = page.locator("text=Files")
        if sidebar.count() > 0 and sidebar.first.is_visible():
            print("Desktop Sidebar Visible: PASS")
        else:
            print("Desktop Sidebar Visible: FAIL")

        # Verify theme toggle works
        # Default is dark.
        if "dark" in page.evaluate("document.documentElement.className"):
            print("Default Dark Mode: PASS")
        else:
            print("Default Dark Mode: FAIL")

        # Open Settings
        page.click('button[title="Settings"]')
        time.sleep(1)

        # Verify Editor Theme select exists
        editor_theme = page.locator("#editorTheme")
        if editor_theme.is_visible():
            print("Editor Theme Select Visible: PASS")
            # Select Light
            editor_theme.select_option("light")
            time.sleep(0.5)
            # Verify close
            page.click('text=Done')
        else:
            print("Editor Theme Select Visible: FAIL")

        page.screenshot(path="verification_desktop.png")

        # Test 2: Mobile Layout
        # 375x667
        context_mobile = browser.new_context(viewport={"width": 375, "height": 667})
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://localhost:4321")
        time.sleep(2)

        # Verify Sidebar is NOT visible initially
        sidebar_mobile = page_mobile.locator("text=Files")
        # Note: "Files" might match the toggle button if it had text, but it has icon.
        # But "Files" text is in the Sidebar header.

        if sidebar_mobile.count() == 0 or not sidebar_mobile.first.is_visible():
            print("Mobile Sidebar Hidden Initially: PASS")
        else:
            print(f"Mobile Sidebar Hidden Initially: FAIL")

        # Click Toggle Files
        toggle_btn = page_mobile.locator('button[title="Toggle Files"]')
        if toggle_btn.is_visible():
            print("Mobile Toggle Button Visible: PASS")
            toggle_btn.click()
            time.sleep(1)
            # Now Sidebar should be visible
            if sidebar_mobile.first.is_visible():
                 print("Mobile Sidebar Visible After Toggle: PASS")
            else:
                 print("Mobile Sidebar Visible After Toggle: FAIL")

            page_mobile.screenshot(path="verification_mobile_open.png")

            # Close Sidebar
            page_mobile.mouse.click(300, 100)
            time.sleep(0.5)
            if sidebar_mobile.count() == 0 or not sidebar_mobile.first.is_visible():
                 print("Mobile Sidebar Closed After Overlay Click: PASS")
            else:
                 print("Mobile Sidebar Closed After Overlay Click: FAIL")

        else:
            print("Mobile Toggle Button Visible: FAIL")

        browser.close()

if __name__ == "__main__":
    run()
