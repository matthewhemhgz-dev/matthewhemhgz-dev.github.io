from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Test homepage in light mode
    page.goto('http://localhost:4321')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/homepage_light.png', full_page=True)
    
    # Test homepage in dark mode
    page.locator('button#theme-toggle').click()
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/homepage_dark.png', full_page=True)
    
    # Test blog page in light mode
    page.goto('http://localhost:4321/blog')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/blog_light.png', full_page=True)
    
    # Test blog page in dark mode
    page.locator('button#theme-toggle').click()
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/blog_dark.png', full_page=True)
    
    # Test blog post in light mode
    page.goto('http://localhost:4321/blog/design-system-from-scratch')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/blog_post_light.png', full_page=True)
    
    # Test blog post in dark mode
    page.locator('button#theme-toggle').click()
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/blog_post_dark.png', full_page=True)
    
    browser.close()
    print('Screenshots captured successfully')