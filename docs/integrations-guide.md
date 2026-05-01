# 评论系统 & 内容分析集成方案

## 评论系统方案

### 方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **Giscus** | ✅ GitHub Issues 驱动<br>✅ 无需后端<br>✅ 支持 Markdown<br>✅ 开源<br>✅ 支持深色模式 | ⚠️ 需要 GitHub 账号 | ⭐⭐⭐⭐⭐ |
| **Utterances** | ✅ GitHub Issues 驱动<br>✅ 简单<br>✅ 轻量 | ⚠️ 功能较少 | ⭐⭐⭐⭐ |
| **Waline** | ✅ 支持多种数据库<br>✅ 完全开源<br>✅ 支持评论表情<br>✅ 有后台管理 | ⚠️ 需要自建服务<br>⚠️ 需要维护 | ⭐⭐⭐ |
| **Disqus** | ✅ 功能强大<br>✅ 用户多 | ⚠️ 广告多<br>⚠️ 隐私问题<br>⚠️ 国外服务慢 | ⭐⭐ |
| **Valine** | ✅ LeanCloud 驱动<br>✅ 轻量<br>✅ 无需后端 | ⚠️ LeanCloud 收费<br>⚠️ 不再活跃 | ⭐⭐ |

---

### 🎯 推荐方案：Giscus

#### 1. Giscus 配置步骤

**步骤 1**: 创建 GitHub 仓库
- 在你的项目仓库中启用 Discussions 功能
- Settings -> Features -> Discussions -> ✅ Enable

**步骤 2**: 安装 Giscus App
- 访问 [giscus.app](https://giscus.app)
- 安装 Giscus App 到你的仓库
- 选择 "Public" 仓库权限

**步骤 3**: 获取配置参数
在 giscus.app 网站填写信息后，你会得到类似这样的配置：
```javascript
{
  repo: "your-username/your-repo",
  repoId: "your-repo-id",
  category: "Announcements",
  categoryId: "your-category-id",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  theme: "preferred_color_scheme",
  lang: "zh-CN",
  loading: "lazy"
}
```

---

#### 2. 集成 Giscus 组件

创建 `src/components/ui/GiscusComments.astro`:

```astro
---
interface Props {
  theme?: 'light' | 'dark' | 'preferred_color_scheme';
  lang?: 'zh-CN' | 'en';
}

const { theme = 'preferred_color_scheme', lang = 'zh-CN' } = Astro.props;
---

<div class="giscus-container" id="giscus-container">
  <div id="giscus_thread"></div>
</div>

<script>
  const GISCUS_CONFIG = {
    repo: 'your-username/your-repo',  // 修改为你的配置
    repoId: '',
    category: 'Announcements',
    categoryId: '',
    mapping: 'pathname',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme: '{theme}',
    lang: '{lang}',
    loading: 'lazy',
  };

  function loadGiscus() {
    const container = document.getElementById('giscus_thread');
    if (!container) return;

    // 动态主题切换支持
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    GISCUS_CONFIG.theme = currentTheme;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata);
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
    script.setAttribute('data-theme', GISCUS_CONFIG.theme);
    script.setAttribute('data-lang', GISCUS_CONFIG.lang);
    script.setAttribute('data-loading', GISCUS_CONFIG.loading);

    container.appendChild(script);
  }

  // 监听主题变化
  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const giscus = document.querySelector('.giscus-frame');
        if (giscus) {
          const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
          giscus.setAttribute('data-theme', currentTheme);
          giscus.contentWindow.postMessage({ giscus: { setConfig: { theme: currentTheme } } }, 'https://giscus.app');
        }
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    loadGiscus();
    themeObserver.observe(document.documentElement, { attributes: true });
  });
</script>

<style>
  .giscus-container {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--qi-divider);
  }
</style>
```

---

#### 3. 在博客详情页使用

修改 `src/pages/blog/[slug].astro`:

```astro
---
import GiscusComments from '../components/ui/GiscusComments.astro';
---

<!-- 在博客内容之后添加 -->
<GiscusComments lang="zh-CN" />
```

---

## 内容分析方案

### 方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **Plausible** | ✅ 开源<br>✅ 隐私友好<br>✅ 无需 cookies<br>✅ 可自托管 | ⚠️ 需要自托管或付费 | ⭐⭐⭐⭐⭐ |
| **Umami** | ✅ 开源<br>✅ 轻量<br>✅ 可自托管<br>✅ 免费 | ⚠️ 需要服务器 | ⭐⭐⭐⭐ |
| **Google Analytics** | ✅ 功能强大<br>✅ 免费<br>✅ 用户多 | ⚠️ 隐私问题<br>⚠️ 需要 GPC<br>⚠️ 国内可能无法访问 | ⭐⭐⭐ |
| **Fathom** | ✅ 隐私友好<br>✅ 简单 | ⚠️ 付费 | ⭐⭐⭐ |

---

### 🎯 推荐方案：Plausible 或 Umami

#### 1. Umami（自托管推荐）

**步骤 1**: 安装 Umami
```bash
# 使用 Docker
docker run -d -p 3000:3000 ghcr.io/umami-software/umami:latest
```

**步骤 2**: 获取跟踪脚本
在 Umami 管理后台添加网站，获取类似这样的脚本：
```html
<script defer src="https://your-umami-domain.com/script.js" data-website-id="your-website-id"></script>
```

---

#### 2. 集成分析组件

创建 `src/components/analytics/Analytics.astro`:

```astro
---
interface Props {
  provider?: 'umami' | 'plausible' | 'ga';
  websiteId?: string;
  domain?: string;
}

const { provider = 'umami', websiteId, domain } = Astro.props;
---

{provider === 'umami' && websiteId && domain && (
  <script defer src={`https://${domain}/script.js`} data-website-id={websiteId}></script>
)}

{provider === 'plausible' && domain && (
  <>
    <script defer src={`https://${domain}/js/script.js`} data-domain={Astro.site?.host}></script>
    <script>
      // 自定义事件跟踪
      window.plausible = window.plausible || function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
    </script>
  </>
)}

{provider === 'ga' && websiteId && (
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${websiteId}`}></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{websiteId}');
  </script>
)}
```

---

#### 3. 在 BaseLayout 中集成

修改 `src/layouts/BaseLayout.astro`:

```astro
---
import Analytics from '../components/analytics/Analytics.astro';

// 从环境变量读取配置
const analyticsConfig = {
  provider: import.meta.env.ANALYTICS_PROVIDER || 'umami',
  websiteId: import.meta.env.ANALYTICS_WEBSITE_ID,
  domain: import.meta.env.ANALYTICS_DOMAIN,
};
---

<!DOCTYPE html>
<html lang={lang}>
<head>
  <!-- 其他 head 内容 -->
  <Analytics {...analyticsConfig} />
</head>
```

---

## 环境变量配置

创建 `.env.example`:

```env
# 评论系统
GISCUS_REPO=your-username/your-repo
GISCUS_REPO_ID=
GISCUS_CATEGORY=Announcements
GISCUS_CATEGORY_ID=

# 分析系统
ANALYTICS_PROVIDER=umami
ANALYTICS_WEBSITE_ID=
ANALYTICS_DOMAIN=analytics.example.com
```

---

## 快速开始指南

### 添加评论
1. 访问 [giscus.app](https://giscus.app) 配置
2. 修改 `src/components/ui/GiscusComments.astro` 中的配置
3. 重新构建部署

### 添加分析
1. 选择 Umami 或 Plausible
2. 获取 tracking script
3. 配置环境变量
4. 重新构建部署

---

## 总结

✅ **评论系统**: 推荐 Giscus（免费、开源、GitHub 集成）
✅ **分析系统**: 推荐 Umami（免费、开源、可自托管）
✅ **隐私保护**: 都支持无 cookies 跟踪方案
