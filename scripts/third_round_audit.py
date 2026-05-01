#!/usr/bin/env python3
"""
祈研所网站第三轮全面扫描测试
基于之前发现的 baseline 和问题，避免重复劳动
"""

import re
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, Page, expect

OUTPUT_DIR = Path("/workspace/dogfood-output")
SCREENSHOTS_DIR = OUTPUT_DIR / "screenshots"
VIDEOS_DIR = OUTPUT_DIR / "videos"

BASE_URL = "http://localhost:4322"

REPORT = []
ISSUE_COUNTER = 0

def log(msg):
    print(f"  {msg}")

def capture_issue(page, title, description, severity="medium", page_url="", screenshot_path=""):
    global ISSUE_COUNTER
    ISSUE_COUNTER += 1
    issue_id = f"ISSUE-{ISSUE_COUNTER:03d}"
    log(f"[{severity.upper()}] {issue_id}: {title}")

    if screenshot_path:
        try:
            page.screenshot(path=str(screenshot_path), full_page=True)
        except Exception as e:
            log(f"    截图失败: {e}")

    REPORT.append({
        "id": issue_id,
        "severity": severity,
        "title": title,
        "description": description,
        "url": page.url,
        "screenshot": str(screenshot_path) if screenshot_path else ""
    })
    return issue_id

def test_homepage(page):
    """首页扫描"""
    log("\n📄 扫描首页...")
    page.goto(f"{BASE_URL}/")
    page.wait_for_load_state("networkidle")

    page.screenshot(path=str(SCREENSHOTS_DIR / "homepage.png"), full_page=True)
    log("  截图: homepage.png")

    log("  检查 Hero 区域...")
    hero_title = page.locator("h1").first
    if hero_title.is_visible():
        log(f"  ✓ Hero 标题: {hero_title.inner_text()[:50]}")

    log("  检查平台矩阵二维码弹窗...")
    wechat_btn = page.locator('button[aria-label*="微信"], button:has-text("微信")').first
    if wechat_btn.is_visible():
        try:
            wechat_btn.click()
            page.wait_for_timeout(500)
            page.screenshot(path=str(SCREENSHOTS_DIR / "homepage-wechat-modal.png"), full_page=True)
            log("  ✓ 微信弹窗打开成功")
            page.keyboard.press("Escape")
            page.wait_for_timeout(300)
        except Exception as e:
            capture_issue(page, "微信二维码弹窗无法打开", str(e), "medium",
                        screenshot_path=SCREENSHOTS_DIR / "homepage-wechat-error.png")
    else:
        log("  ! 未找到微信按钮")

    log("  检查统计数据动画...")
    stats = page.locator(".stat-number, [data-count]").all()
    log(f"  找到 {len(stats)} 个统计数字元素")

    log("  检查控制台错误...")
    console_errors = []
    def handle_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text)
    page.on("console", handle_console)
    page.reload()
    page.wait_for_load_state("networkidle")
    if console_errors:
        capture_issue(page, "首页控制台错误", "\n".join(console_errors), "medium",
                    screenshot_path=SCREENSHOTS_DIR / "homepage-console-error.png")

def test_blog_list(page):
    """博客列表页扫描"""
    log("\n📄 扫描博客列表页...")
    page.goto(f"{BASE_URL}/blog/")
    page.wait_for_load_state("networkidle")

    page.screenshot(path=str(SCREENSHOTS_DIR / "blog-list.png"), full_page=True)
    log("  截图: blog-list.png")

    log("  检查文章卡片...")
    cards = page.locator("article, .blog-card").all()
    log(f"  找到 {len(cards)} 个文章卡片")

    if cards:
        first_card = cards[0]
        try:
            link = first_card.locator("a").first
            href = link.get_attribute("href")
            log(f"  ✓ 第一张卡片链接: {href}")
        except Exception as e:
            capture_issue(page, "博客卡片链接无法获取", str(e), "low")

def test_blog_detail_client_nav(page):
    """博客详情页扫描 - 重点测试客户端导航后的组件状态"""
    log("\n📄 扫描博客详情页（客户端导航测试）...")

    page.goto(f"{BASE_URL}/")
    page.wait_for_load_state("networkidle")
    page.screenshot(path=str(SCREENSHOTS_DIR / "blog-nav-start.png"), full_page=True)

    log("  通过客户端导航进入博客详情页...")
    blog_link = page.locator('a[href*="/blog/"]').first
    if blog_link.is_visible():
        href = blog_link.get_attribute("href")
        log(f"  点击链接: {href}")
        blog_link.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1000)
        page.screenshot(path=str(SCREENSHOTS_DIR / "blog-detail-via-nav.png"), full_page=True)

        log("  检查面包屑导航...")
        breadcrumbs = page.locator("nav[aria-label='breadcrumb'], .breadcrumb")
        if breadcrumbs.is_visible():
            log("  ✓ 面包屑导航可见")
        else:
            capture_issue(page, "面包屑导航不可见（客户端导航后）",
                         "从首页通过客户端导航进入博客详情页后，面包屑导航未显示",
                         "high", screenshot_path=SCREENSHOTS_DIR / "blog-detail-breadcrumb-missing.png")

        log("  检查阅读进度条...")
        progress = page.locator("[role='progressbar'], .reading-progress")
        if progress.count() > 0:
            log(f"  ✓ 找到 {progress.count()} 个进度条元素")
            if progress.first.is_visible():
                log("  ✓ 阅读进度条可见")
            else:
                capture_issue(page, "阅读进度条不可见（客户端导航后）",
                             "从首页通过客户端导航进入博客详情页后，阅读进度条未显示",
                             "high", screenshot_path=SCREENSHOTS_DIR / "blog-detail-progress-hidden.png")
        else:
            capture_issue(page, "阅读进度条元素不存在",
                         "博客详情页未找到阅读进度条元素",
                         "medium", screenshot_path=SCREENSHOTS_DIR / "blog-detail-progress-missing.png")

        log("  检查目录导航...")
        toc = page.locator("#table-of-contents, .toc, [aria-label='目录']")
        if toc.count() > 0:
            log("  ✓ 目录导航元素存在")
            if toc.first.is_visible():
                log("  ✓ 目录导航可见")
            else:
                capture_issue(page, "目录导航不可见（客户端导航后）",
                             "从首页通过客户端导航进入博客详情页后，目录导航未显示",
                             "high", screenshot_path=SCREENSHOTS_DIR / "blog-detail-toc-hidden.png")
        else:
            log("  ! 页面可能没有长目录，目录导航被隐藏")

        log("  检查 Schema 结构化数据...")
        schema = page.locator('script[type="application/ld+json"]')
        if schema.count() > 0:
            try:
                schema_content = schema.first.inner_text()
                schema_data = json.loads(schema_content)
                log(f"  ✓ Schema 类型: {schema_data.get('@type', 'Unknown')}")
            except Exception as e:
                capture_issue(page, "Schema JSON 解析错误", str(e), "medium")
        else:
            log("  ! 未找到 JSON-LD Schema")

    else:
        log("  ! 未找到博客链接")

def test_about_page(page):
    """关于页扫描"""
    log("\n📄 扫描关于页...")
    page.goto(f"{BASE_URL}/about/")
    page.wait_for_load_state("networkidle")

    page.screenshot(path=str(SCREENSHOTS_DIR / "about-page.png"), full_page=True)
    log("  截图: about-page.png")

    log("  检查 OnPageNav 组件...")
    onpage_nav = page.locator("#on-page-nav, .on-page-nav, nav:has(a[href^='#'])")
    if onpage_nav.count() > 0:
        log(f"  ✓ 找到 OnPageNav 组件 ({onpage_nav.count()} 个)")

        log("  测试客户端导航后的 OnPageNav...")
        page.goto(f"{BASE_URL}/")
        page.wait_for_load_state("networkidle")

        about_link = page.locator('a[href="/about/"]').first
        if about_link.is_visible():
            about_link.click()
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(1000)
            page.screenshot(path=str(SCREENSHOTS_DIR / "about-via-nav.png"), full_page=True)

            onpage_nav_after_nav = page.locator("#on-page-nav, .on-page-nav")
            if onpage_nav_after_nav.count() > 0 and onpage_nav_after_nav.first.is_visible():
                log("  ✓ 客户端导航后 OnPageNav 可见")
            else:
                capture_issue(page, "OnPageNav 不可见（客户端导航后）",
                             "从首页通过客户端导航进入关于页后，OnPageNav 未显示",
                             "high", screenshot_path=SCREENSHOTS_DIR / "about-onpagenav-hidden.png")
    else:
        log("  ! 未找到 OnPageNav 组件")

def test_projects_page(page):
    """项目页扫描"""
    log("\n📄 扫描项目页...")
    page.goto(f"{BASE_URL}/projects/")
    page.wait_for_load_state("networkidle")

    page.screenshot(path=str(SCREENSHOTS_DIR / "projects-page.png"), full_page=True)
    log("  截图: projects-page.png")

    log("  检查筛选按钮...")
    filter_buttons = page.locator('[role="button"][aria-pressed], button[data-filter]').all()
    log(f"  找到 {len(filter_buttons)} 个筛选按钮")

    for i, btn in enumerate(filter_buttons[:3]):
        try:
            label = btn.inner_text()
            aria_pressed = btn.get_attribute("aria-pressed")
            log(f"    按钮 {i+1}: '{label}' aria-pressed={aria_pressed}")

            btn.click()
            page.wait_for_timeout(300)
            new_aria_pressed = btn.get_attribute("aria-pressed")
            log(f"    点击后 aria-pressed={new_aria_pressed}")
        except Exception as e:
            capture_issue(page, f"筛选按钮 {i+1} 点击失败", str(e), "low")

def test_search_modal(page):
    """搜索模态框扫描"""
    log("\n🔍 扫描搜索模态框...")

    page.goto(f"{BASE_URL}/")
    page.wait_for_load_state("networkidle")

    page.screenshot(path=str(SCREENSHOTS_DIR / "search-modal-closed.png"), full_page=True)

    log("  测试键盘快捷键 Cmd/Ctrl+K...")
    page.keyboard.press("Control+k")
    page.wait_for_timeout(500)

    modal = page.locator('[role="dialog"][aria-modal="true"], .search-modal, #search-modal')
    if modal.is_visible():
        log("  ✓ 搜索模态框通过 Ctrl+K 打开")
        page.screenshot(path=str(SCREENSHOTS_DIR / "search-modal-open.png"), full_page=True)

        search_input = page.locator('input[type="search"], input[placeholder*="搜索"]')
        if search_input.is_visible():
            log("  ✓ 搜索输入框可见且自动聚焦")
            search_input.fill("test")
            page.wait_for_timeout(500)
            page.screenshot(path=str(SCREENSHOTS_DIR / "search-modal-results.png"), full_page=True)

        page.keyboard.press("Escape")
        page.wait_for_timeout(300)
        if not modal.is_visible():
            log("  ✓ ESC 键正确关闭模态框")
        else:
            capture_issue(page, "ESC 键无法关闭搜索模态框", "", "medium",
                        screenshot_path=SCREENSHOTS_DIR / "search-modal-esc-fail.png")
    else:
        capture_issue(page, "搜索模态框无法通过 Ctrl+K 打开", "", "medium",
                    screenshot_path=SCREENSHOTS_DIR / "search-modal-open-fail.png")

def test_navigation_mobile(page):
    """移动端导航测试"""
    log("\n📱 扫描移动端导航...")

    page.set_viewport_size({"width": 375, "height": 667})
    page.goto(f"{BASE_URL}/")
    page.wait_for_load_state("networkidle")

    page.screenshot(path=str(SCREENSHOTS_DIR / "mobile-nav-closed.png"), full_page=True)

    hamburger = page.locator('button[aria-label*="菜单"], button[aria-label*="menu"], .hamburger')
    if hamburger.is_visible():
        log("  ✓ 汉堡菜单按钮可见")
        hamburger.click()
        page.wait_for_timeout(500)
        page.screenshot(path=str(SCREENSHOTS_DIR / "mobile-nav-open.png"), full_page=True)

        nav_menu = page.locator('nav > ul, .nav-menu')
        if nav_menu.is_visible():
            log("  ✓ 导航菜单展开")

            log("  检查键盘可访问性...")
            items = nav_menu.locator("a").all()
            for item in items[:3]:
                try:
                    log(f"    菜单项: {item.inner_text()[:30]}")
                except:
                    pass

            page.keyboard.press("Escape")
        else:
            capture_issue(page, "移动端菜单无法展开", "", "medium")
    else:
        log("  ! 未找到汉堡菜单按钮")

    page.set_viewport_size({"width": 1280, "height": 720})

def test_console_errors(page):
    """检查各页面的控制台错误"""
    log("\n🚨 检查控制台错误...")

    pages_to_check = [
        ("/", "homepage"),
        ("/blog/", "blog-list"),
        ("/about/", "about"),
        ("/projects/", "projects"),
    ]

    for path, name in pages_to_check:
        console_errors = []
        def handle_console(msg):
            if msg.type == "error":
                console_errors.append(msg.text)

        page.on("console", handle_console)
        page.goto(f"{BASE_URL}{path}")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(500)

        if console_errors:
            log(f"  ⚠ {name} 有 {len(console_errors)} 个控制台错误")
            for err in console_errors[:3]:
                log(f"    - {err[:100]}")
        else:
            log(f"  ✓ {name} 无控制台错误")

        page.remove_listener("console", handle_console)

def generate_report():
    """生成测试报告"""
    report_path = OUTPUT_DIR / "report.md"

    critical = [r for r in REPORT if r["severity"] == "critical"]
    high = [r for r in REPORT if r["severity"] == "high"]
    medium = [r for r in REPORT if r["severity"] == "medium"]
    low = [r for r in REPORT if r["severity"] == "low"]

    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# 祈研所网站第三轮扫描报告\n\n")
        f.write("## 测试概要\n\n")
        f.write(f"- 测试时间: 基于基线版本\n")
        f.write(f"- 测试范围: 首页、博客列表、博客详情、关于页、项目页、全局组件\n")
        f.write(f"- 重点: 客户端导航后组件状态恢复\n\n")

        f.write("## 问题统计\n\n")
        f.write(f"- Critical: {len(critical)}\n")
        f.write(f"- High: {len(high)}\n")
        f.write(f"- Medium: {len(medium)}\n")
        f.write(f"- Low: {len(low)}\n")
        f.write(f"- **总计: {len(REPORT)}**\n\n")

        if critical:
            f.write("## Critical 问题\n\n")
            for r in critical:
                f.write(f"### {r['id']}: {r['title']}\n\n")
                f.write(f"**描述**: {r['description']}\n\n")
                f.write(f"**URL**: {r['url']}\n\n")
                if r['screenshot']:
                    f.write(f"**截图**: {Path(r['screenshot']).name}\n\n")

        if high:
            f.write("## High 问题\n\n")
            for r in high:
                f.write(f"### {r['id']}: {r['title']}\n\n")
                f.write(f"**描述**: {r['description']}\n\n")
                f.write(f"**URL**: {r['url']}\n\n")
                if r['screenshot']:
                    f.write(f"**截图**: {Path(r['screenshot']).name}\n\n")

        if medium:
            f.write("## Medium 问题\n\n")
            for r in medium:
                f.write(f"### {r['id']}: {r['title']}\n\n")
                f.write(f"**描述**: {r['description']}\n\n")
                f.write(f"**URL**: {r['url']}\n\n")
                if r['screenshot']:
                    f.write(f"**截图**: {Path(r['screenshot']).name}\n\n")

        if low:
            f.write("## Low 问题\n\n")
            for r in low:
                f.write(f"### {r['id']}: {r['title']}\n\n")
                f.write(f"**描述**: {r['description']}\n\n")
                if r['screenshot']:
                    f.write(f"**截图**: {Path(r['screenshot']).name}\n\n")

        f.write("\n## 截图清单\n\n")
        for p in sorted(SCREENSHOTS_DIR.glob("*.png")):
            f.write(f"- {p.name}\n")

    log(f"\n📊 测试报告已生成: {report_path}")
    log(f"\n总计发现 {len(REPORT)} 个问题:")
    log(f"  - Critical: {len(critical)}")
    log(f"  - High: {len(high)}")
    log(f"  - Medium: {len(medium)}")
    log(f"  - Low: {len(low)}")

    return REPORT

def main():
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

    log("🚀 开始祈研所网站第三轮全面扫描")
    log(f"   目标: {BASE_URL}")
    log("")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        try:
            test_console_errors(page)
            test_homepage(page)
            test_blog_list(page)
            test_blog_detail_client_nav(page)
            test_about_page(page)
            test_projects_page(page)
            test_search_modal(page)
            test_navigation_mobile(page)

        except Exception as e:
            log(f"\n❌ 测试异常: {e}")
            import traceback
            traceback.print_exc()

        finally:
            browser.close()

    generate_report()

if __name__ == "__main__":
    main()
