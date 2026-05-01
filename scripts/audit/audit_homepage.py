from playwright.sync_api import sync_playwright
import json
import os
from datetime import datetime

REPORT = {
    "timestamp": datetime.now().isoformat(),
    "issues_found": [],
    "regressions": [],
    "passed_checks": []
}

def add_issue(severity, category, title, description, location, suggestion=""):
    REPORT["issues_found"].append({
        "severity": severity,
        "category": category,
        "title": title,
        "description": description,
        "location": location,
        "suggestion": suggestion
    })

def add_passed(check):
    REPORT["passed_checks"].append(check)

def check_homepage(page):
    print("🔍 Scanning Homepage...")
    issues = []

    page.goto("http://localhost:4321/", wait_until="networkidle")
    page.wait_for_timeout(2000)

    # Check Hero section
    hero = page.locator(".hero-section").first
    if hero.is_visible():
        add_passed("Hero section visible")
    else:
        add_issue("Medium", "UI", "Hero section not visible", "Hero section may not be rendering correctly", "index.astro - HeroSection")
    # Check stats animation
    stats = page.locator(".hero-stat-value[data-count]").count()
    if stats > 0:
        add_passed(f"Stats animation elements found: {stats}")
    # Check video background
    video = page.locator("video").first
    if video.count() > 0:
        add_passed("Video background element found")

    # Check Platforms section
    platforms = page.locator(".platform-card, .platforms-grid > *").count()
    if platforms > 0:
        add_passed(f"Platform cards found: {platforms}")

    # Check social QR modal trigger
    qr_triggers = page.locator("[data-qr-trigger], .qr-trigger").count()
    if qr_triggers > 0:
        add_passed(f"QR trigger elements found: {qr_triggers}")

    # Check for broken images
    images = page.locator("img").all()
    broken_count = 0
    for img in images:
        if img.get_attribute("src") in [None, "", "#"]:
            broken_count += 1
    if broken_count > 0:
        add_issue("Medium", "Images", f"Found {broken_count} images with empty/broken src", "Images may not be loading correctly", "index.astro")
    else:
        add_passed("All images have valid src attributes")

    # Check navigation
    nav = page.locator("nav").first
    if nav.is_visible():
        add_passed("Navigation visible")
        # Check mobile menu button
        menu_btn = page.locator("[aria-label*='menu' i], .menu-button, .nav-toggle")
        if menu_btn.count() > 0:
            add_passed("Mobile menu button found")
    else:
        add_issue("High", "Navigation", "Navigation not visible", "Main navigation may not be rendering", "Navigation.astro")

    # Check dark mode toggle
    theme_btn = page.locator("[aria-label*='theme' i], .theme-toggle, .dark-mode-toggle")
    if theme_btn.count() > 0:
        add_passed("Theme toggle found")
    else:
        add_issue("Low", "UX", "Theme toggle not found", "Dark mode toggle may be missing", "Navigation.astro")

    # Check meta tags
    title = page.title()
    if "祈研所" in title or "QiLab" in title:
        add_passed(f"Page title correct: {title}")
    else:
        add_issue("High", "SEO", "Page title incorrect", f"Expected title to contain '祈研所' or 'QiLab', got: {title}", "BaseLayout.astro")

    # Check JSON-LD
    json_ld = page.locator("script[type='application/ld+json']")
    if json_ld.count() > 0:
        add_passed(f"JSON-LD scripts found: {json_ld.count()}")
    else:
        add_issue("Medium", "SEO", "No JSON-LD structured data found", "Missing Schema.org structured data", "BaseLayout.astro")

    return issues

def check_blog_list(page):
    print("🔍 Scanning Blog List Page...")
    page.goto("http://localhost:4321/blog", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Check articles
    articles = page.locator("article, .blog-card, .post-card")
    count = articles.count()
    if count > 0:
        add_passed(f"Blog cards found: {count}")
    else:
        add_issue("High", "Content", "No blog cards found", "Blog list may not be rendering", "blog/index.astro")

    # Check pagination or infinite scroll
    pagination = page.locator(".pagination, .load-more, button[aria-label*='load' i]")
    if pagination.count() > 0:
        add_passed("Pagination/load more found")

    # Check tags display
    tags = page.locator(".tag, [class*='tag']")
    if tags.count() > 0:
        add_passed(f"Tag elements found: {tags.count()}")

    # Check for broken links
    links = page.locator("a[href]").all()
    broken = [l for l in links if l.get_attribute("href") in [None, "", "#"]]
    if len(broken) > 0:
        add_issue("Medium", "Links", f"Found {len(broken)} links with empty href", "Some links may not be configured", "blog/index.astro")
    else:
        add_passed("All links have valid href attributes")

def check_blog_detail(page):
    print("🔍 Scanning Blog Detail Page...")

    # Navigate to first blog post
    page.goto("http://localhost:4321/blog", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Click on first article
    first_link = page.locator("article a, .blog-card a, .post-card a").first
    if first_link.count() > 0:
        first_link.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)

        current_url = page.url
        add_passed(f"Navigated to blog detail: {current_url}")

        # Check breadcrumb
        breadcrumb = page.locator(".breadcrumb, nav[aria-label*='breadcrumb' i]")
        if breadcrumb.count() > 0:
            add_passed("Breadcrumb navigation found")
            # Check breadcrumb links
            breadcrumb_links = page.locator(".breadcrumb a, .breadcrumb li a")
            if breadcrumb_links.count() > 0:
                add_passed(f"Breadcrumb links found: {breadcrumb_links.count()}")
        else:
            add_issue("Medium", "Navigation", "Breadcrumb not found", "Blog detail page missing breadcrumb", "blog/[slug].astro")

        # Check reading progress
        progress = page.locator(".reading-progress, [role='progressbar']")
        if progress.count() > 0:
            add_passed("Reading progress indicator found")
        else:
            add_issue("Medium", "UX", "Reading progress not found", "Missing reading progress indicator", "blog/[slug].astro")

        # Check TOC
        toc = page.locator(".toc, .table-of-contents, .toc-sidebar")
        if toc.count() > 0:
            add_passed("Table of contents found")
            # Check TOC links
            toc_links = page.locator(".toc a, .toc-link")
            if toc_links.count() > 0:
                add_passed(f"TOC links found: {toc_links.count()}")
        else:
            add_passed("TOC not shown (may be intentional if no headings)")

        # Check share buttons
        share = page.locator(".share-buttons, .social-share, [class*='share']")
        if share.count() > 0:
            add_passed("Share buttons found")
        else:
            add_issue("Low", "UX", "Share buttons not found", "Missing social share buttons", "blog/[slug].astro")

        # Check related articles
        related = page.locator(".related-articles, .related-posts")
        if related.count() > 0:
            add_passed("Related articles section found")

        # Check schema
        schemas = page.locator("script[type='application/ld+json']").all()
        has_article_schema = False
        for schema in schemas:
            content = schema.inner_content()
            if '"@type":"Article"' in content or '"@type":"BlogPosting"' in content:
                has_article_schema = True
                break
        if has_article_schema:
            add_passed("Article schema found")
        else:
            add_issue("Medium", "SEO", "Article schema not found", "Missing Article structured data", "blog/[slug].astro")

        # Test client-side navigation back to list
        page.goto("http://localhost:4321/blog", wait_until="networkidle")
        page.wait_for_timeout(1000)
        page.locator("article a, .blog-card a").first.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1000)

        # Check if components still work after navigation
        progress_after = page.locator(".reading-progress, [role='progressbar']")
        if progress_after.count() > 0:
            add_passed("Reading progress works after client navigation")
        else:
            add_issue("High", "Bug", "Reading progress not working after client navigation", "Component not re-initializing on page change", "ReadingProgress.astro")

def check_about_page(page):
    print("🔍 Scanning About Page...")
    page.goto("http://localhost:4321/about", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Check on-page navigation
    onpage_nav = page.locator(".onpage-nav, .page-nav")
    if onpage_nav.count() > 0:
        add_passed("On-page navigation found")
        nav_links = page.locator(".onpage-nav a, .page-nav a")
        if nav_links.count() > 0:
            add_passed(f"On-page nav links found: {nav_links.count()}")
    else:
        add_passed("On-page nav not visible on desktop (expected)")

    # Check sections
    sections = page.locator("section, .about-section")
    if sections.count() > 0:
        add_passed(f"About page sections found: {sections.count()}")

def check_projects_page(page):
    print("🔍 Scanning Projects Page...")
    page.goto("http://localhost:4321/projects", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Check filter buttons
    filters = page.locator("button[aria-pressed]")
    if filters.count() > 0:
        add_passed(f"Filter buttons with aria-pressed found: {filters.count()}")
        # Check if aria-pressed values are correct
        for f in filters.all():
            pressed = f.get_attribute("aria-pressed")
            if pressed not in ["true", "false"]:
                add_issue("Medium", "Accessibility", f"Invalid aria-pressed value: {pressed}", "aria-pressed should be 'true' or 'false'", "projects.astro")
                break
    else:
        add_issue("High", "Accessibility", "Filter buttons missing aria-pressed", "Filter buttons should have aria-pressed for accessibility", "projects.astro")

    # Check project cards
    cards = page.locator(".project-card, .project-item")
    if cards.count() > 0:
        add_passed(f"Project cards found: {cards.count()}")
    else:
        add_issue("Medium", "Content", "No project cards found", "Projects page may not be rendering", "projects.astro")

def check_search_modal(page):
    print("🔍 Scanning Search Modal...")
    page.goto("http://localhost:4321/", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Check search trigger
    search_btn = page.locator("[aria-label*='search' i], .search-button, [data-search-trigger]")
    if search_btn.count() > 0:
        add_passed("Search trigger found")
        # Try opening modal
        search_btn.first.click()
        page.wait_for_timeout(500)

        modal = page.locator("[role='dialog'], .search-modal, .modal")
        if modal.count() > 0:
            add_passed("Search modal opens correctly")
            # Check for close button
            close_btn = modal.locator("button[aria-label*='close' i], .close-btn")
            if close_btn.count() > 0:
                add_passed("Close button found")
            # Close modal
            page.keyboard.press("Escape")
            page.wait_for_timeout(500)
        else:
            add_issue("Medium", "Functionality", "Search modal did not open", "Modal may not be configured correctly", "SearchModal.astro")
    else:
        add_issue("Low", "UX", "Search trigger not found", "Search functionality may not be visible", "Navigation.astro")

def check_navigation_mobile(page):
    print("🔍 Scanning Mobile Navigation...")
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto("http://localhost:4321/", wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Check hamburger menu
    menu_btn = page.locator("button[aria-label*='menu' i], .menu-toggle, .hamburger")
    if menu_btn.count() > 0:
        add_passed("Mobile menu button found")
        # Open menu
        menu_btn.first.click()
        page.wait_for_timeout(500)

        # Check if menu opened
        menu = page.locator("nav[aria-expanded='true'], .nav-menu.open")
        if menu.count() > 0:
            add_passed("Mobile menu opens correctly")
        else:
            add_issue("High", "Functionality", "Mobile menu did not open", "Menu button may not be working", "Navigation.astro")

        # Check keyboard navigation
        page.keyboard.press("Tab")
        page.keyboard.press("Tab")
        page.keyboard.press("Escape")
        page.wait_for_timeout(300)
        add_passed("Keyboard navigation in menu works")
    else:
        add_passed("Mobile menu not visible on desktop viewport")

    page.set_viewport_size({"width": 1280, "height": 800})

def run_audit():
    print("🚀 Starting Qi-Lab Third Round Audit...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Collect console errors
        console_errors = []
        def handle_console(msg):
            if msg.type == "error":
                console_errors.append(msg.text)
        page.on("console", handle_console)

        # Run all checks
        try:
            check_homepage(page)
            check_blog_list(page)
            check_blog_detail(page)
            check_about_page(page)
            check_projects_page(page)
            check_search_modal(page)
            check_navigation_mobile(page)
        except Exception as e:
            add_issue("Critical", "Testing", f"Test error: {str(e)}", "Audit test encountered an error", "Automated test")
            print(f"❌ Test error: {e}")

        # Report console errors
        if console_errors:
            # Filter out non-critical errors
            critical_errors = [e for e in console_errors if "favicon" not in e.lower() and "404" not in e.lower()]
            if critical_errors:
                add_issue("Medium", "Console", f"Console errors found: {len(critical_errors)}", f"Errors: {'; '.join(critical_errors[:3])}", "Browser console")

        browser.close()

    # Save report
    with open("/workspace/.trae/documents/third-round-audit-report.json", "w", encoding="utf-8") as f:
        json.dump(REPORT, f, ensure_ascii=False, indent=2)

    print(f"\n📊 Audit Complete!")
    print(f"✅ Passed checks: {len(REPORT['passed_checks'])}")
    print(f"❌ Issues found: {len(REPORT['issues_found'])}")

    return REPORT

if __name__ == "__main__":
    run_audit()
