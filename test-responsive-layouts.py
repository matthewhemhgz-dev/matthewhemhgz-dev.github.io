#!/usr/bin/env python3
"""
测试祈研所网站响应式布局
"""

from playwright.sync_api import sync_playwright
import os
import time

def take_screenshot(page, name, viewport):
    """截图并保存"""
    screenshot_dir = "/data/tool/browser_snapshots/responsive"
    os.makedirs(screenshot_dir, exist_ok=True)
    
    screenshot_path = os.path.join(screenshot_dir, f"{name}-{viewport}.png")
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"✓ 截图已保存: {screenshot_path}")

def test_homepage(page, width, height, viewport_name):
    """测试首页响应式布局"""
    print(f"\n=== 测试 {viewport_name} ({width}x{height}) ===")
    
    page.set_viewport_size({"width": width, "height": height})
    page.goto("http://localhost:4321", wait_until="networkidle")
    time.sleep(1)
    
    # 检查导航
    nav = page.locator(".nav-wrapper")
    if nav.count() > 0:
        print("✓ 导航栏可见")
    else:
        print("✗ 导航栏不可见")
    
    # 检查移动端菜单
    if width <= 768:
        hamburger = page.locator(".nav-toggle-label")
        if hamburger.count() > 0:
            print("✓ 移动端菜单按钮可见")
        else:
            print("✗ 移动端菜单按钮不可见")
    
    # 检查Hero区域
    hero = page.locator(".hero-section")
    if hero.count() > 0:
        print("✓ Hero区域可见")
    else:
        print("✗ Hero区域不可见")
    
    # 截图
    take_screenshot(page, "homepage", viewport_name)

def test_blog_page(page, width, height, viewport_name):
    """测试博客页面响应式布局"""
    print(f"\n=== 测试博客页面 {viewport_name} ({width}x{height}) ===")
    
    page.set_viewport_size({"width": width, "height": height})
    page.goto("http://localhost:4321/blog", wait_until="networkidle")
    time.sleep(1)
    
    # 检查博客卡片
    blog_cards = page.locator(".blog-card")
    card_count = blog_cards.count()
    print(f"✓ 博客卡片数量: {card_count}")
    
    # 截图
    take_screenshot(page, "blog", viewport_name)

def test_about_page(page, width, height, viewport_name):
    """测试关于页面响应式布局"""
    print(f"\n=== 测试关于页面 {viewport_name} ({width}x{height}) ===")
    
    page.set_viewport_size({"width": width, "height": height})
    page.goto("http://localhost:4321/about", wait_until="networkidle")
    time.sleep(1)
    
    # 截图
    take_screenshot(page, "about", viewport_name)

def main():
    """主函数"""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 测试不同屏幕尺寸
        screen_sizes = [
            # 超小屏手机
            (375, 667, "iphone-SE"),
            # 普通手机
            (414, 896, "iphone-XR"),
            # 小平板
            (768, 1024, "ipad"),
            # 大平板
            (1024, 1366, "ipad-pro"),
            # 笔记本电脑
            (1440, 900, "laptop-14"),
            # 桌面显示器
            (1920, 1080, "desktop-FHD"),
            # 4K显示器
            (2560, 1440, "desktop-QHD"),
        ]
        
        # 测试首页
        for width, height, name in screen_sizes:
            test_homepage(page, width, height, name)
        
        # 测试博客页面
        for width, height, name in screen_sizes:
            test_blog_page(page, width, height, name)
        
        # 测试关于页面
        for width, height, name in screen_sizes:
            test_about_page(page, width, height, name)
        
        browser.close()

if __name__ == "__main__":
    main()
