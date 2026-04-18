/**
 * 代码块复制按钮
 *
 * 在文章页 .prose 内的所有 <pre> 元素右上角添加复制按钮
 * 使用 astro:page-load 事件兼容 View Transitions
 */
function initCopyButtons() {
  const proseBlocks = document.querySelectorAll('.prose pre');

  proseBlocks.forEach((pre) => {
    // 避免重复添加
    if (pre.querySelector('.copy-btn')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    // 将 pre 移入 wrapper
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // 创建复制按钮
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', '复制代码');
    btn.innerHTML = `
      <svg class="copy-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3" />
        <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
      </svg>
      <svg class="check-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" style="display:none">
        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code?.textContent || pre.textContent || '';

      try {
        await navigator.clipboard.writeText(text);
        showSuccess(btn);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showSuccess(btn);
      }
    });

    wrapper.appendChild(btn);
  });
}

function showSuccess(btn: HTMLElement) {
  const copyIcon = btn.querySelector('.copy-icon') as HTMLElement;
  const checkIcon = btn.querySelector('.check-icon') as HTMLElement;
  copyIcon.style.display = 'none';
  checkIcon.style.display = 'block';
  btn.setAttribute('aria-label', '已复制');

  setTimeout(() => {
    copyIcon.style.display = 'block';
    checkIcon.style.display = 'none';
    btn.setAttribute('aria-label', '复制代码');
  }, 2000);
}

document.addEventListener('astro:page-load', initCopyButtons);
