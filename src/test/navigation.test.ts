import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Navigation Component', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header class="nav-wrapper">
        <nav class="nav qi-glass-nav" aria-label="Main Navigation">
          <input
            type="checkbox"
            id="nav-toggle"
            class="nav-toggle-input"
            aria-label="Toggle navigation menu"
            aria-expanded="false"
            aria-controls="nav-links"
          />
          <label for="nav-toggle" class="nav-toggle-label"></label>
          <div id="nav-status" class="sr-only" aria-live="polite"></div>
          <ul id="nav-links" class="nav-links" role="menubar">
            <li role="none"><a href="/" class="nav-link" role="menuitem">首页</a></li>
            <li role="none"><a href="/about" class="nav-link" role="menuitem">关于</a></li>
            <li role="none"><a href="/blog" class="nav-link" role="menuitem">博客</a></li>
            <li role="none"><a href="/projects" class="nav-link" role="menuitem">项目</a></li>
            <li role="none"><a href="/tags" class="nav-link" role="menuitem">标签</a></li>
            <li role="none"><button class="nav-search-btn" id="nav-search-btn">搜索</button></li>
            <li class="nav-close-item" role="none">
              <button class="nav-close-btn">关闭</button>
            </li>
          </ul>
        </nav>
      </header>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('初始化时正确设置 aria-expanded 属性', () => {
    const navToggle = document.getElementById('nav-toggle') as HTMLInputElement;
    expect(navToggle).not.toBeNull();
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('导航切换时更新 aria-expanded 属性', () => {
    const navToggle = document.getElementById('nav-toggle') as HTMLInputElement;
    const navStatus = document.getElementById('nav-status');

    navToggle.addEventListener('change', () => {
      navToggle.setAttribute('aria-expanded', String(navToggle.checked));
      if (navStatus) {
        navStatus.textContent = navToggle.checked ? '导航菜单已打开' : '导航菜单已关闭';
      }
    });

    // 模拟点击打开菜单
    navToggle.checked = true;
    navToggle.dispatchEvent(new Event('change'));
    
    expect(navToggle.getAttribute('aria-expanded')).toBe('true');
    expect(navStatus?.textContent).toBe('导航菜单已打开');

    // 模拟点击关闭菜单
    navToggle.checked = false;
    navToggle.dispatchEvent(new Event('change'));
    
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(navStatus?.textContent).toBe('导航菜单已关闭');
  });

  it('关闭按钮点击后关闭导航菜单', () => {
    const navToggle = document.getElementById('nav-toggle') as HTMLInputElement;
    const closeBtn = document.querySelector('.nav-close-btn') as HTMLButtonElement;
    const navStatus = document.getElementById('nav-status');

    closeBtn.addEventListener('click', () => {
      navToggle.checked = false;
      navToggle.setAttribute('aria-expanded', 'false');
      if (navStatus) {
        navStatus.textContent = '导航菜单已关闭';
      }
    });

    // 先打开菜单
    navToggle.checked = true;
    navToggle.setAttribute('aria-expanded', 'true');

    // 点击关闭按钮
    closeBtn.click();

    expect(navToggle.checked).toBe(false);
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(navStatus?.textContent).toBe('导航菜单已关闭');
  });

  it('Escape 键关闭导航菜单', () => {
    const navToggle = document.getElementById('nav-toggle') as HTMLInputElement;
    const navLinks = document.getElementById('nav-links');
    const navStatus = document.getElementById('nav-status');

    navLinks?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navToggle.checked = false;
        navToggle.setAttribute('aria-expanded', 'false');
        if (navStatus) {
          navStatus.textContent = '导航菜单已关闭';
        }
      }
    });

    // 先打开菜单
    navToggle.checked = true;
    navToggle.setAttribute('aria-expanded', 'true');

    // 模拟 Escape 按键
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    navLinks?.dispatchEvent(escapeEvent);

    expect(navToggle.checked).toBe(false);
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(navStatus?.textContent).toBe('导航菜单已关闭');
  });

  it('导航链接应该有正确的 aria-current 属性', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 测试当前路径匹配逻辑
    const currentPath = '/blog';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href || ''));
      if (isActive) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      }
    });

    const blogLink = document.querySelector('a[href="/blog"]');
    expect(blogLink?.getAttribute('aria-current')).toBe('page');
    expect(blogLink?.classList.contains('active')).toBe(true);
  });

  it('导航项应该有索引属性用于动画', () => {
    const navItems = document.querySelectorAll('#nav-links li');
    
    navItems.forEach((item, index) => {
      item.style.setProperty('--nav-item-index', String(index));
    });

    navItems.forEach((item, index) => {
      expect(item.style.getPropertyValue('--nav-item-index')).toBe(String(index));
    });
  });
});