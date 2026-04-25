class FluidUIInteraction {
  constructor(fluidInstance) {
    this.fluid = fluidInstance;
    this.interactiveElements = [];
    this.ripples = [];
    this.isActive = true;
    
    this.initialize();
  }

  initialize() {
    // 监听页面上的交互元素
    this.observeInteractiveElements();
    // 开始动画循环
    this.animate();
  }

  observeInteractiveElements() {
    // 观察所有可能的交互元素
    const selector = 'button, a, input, textarea, [data-fluid-interactive]';
    
    // 初始扫描
    this.scanForElements(selector);
    
    // 使用 MutationObserver 监控 DOM 变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // 元素节点
            // 检查新增节点是否是交互元素
            if ((node as HTMLElement).matches?.(selector)) {
              this.addInteractiveElement(node as HTMLElement);
            }
            // 检查新增节点的子元素
            const childElements = (node as HTMLElement).querySelectorAll?.(selector);
            if (childElements) {
              childElements.forEach((el) => this.addInteractiveElement(el as HTMLElement));
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  scanForElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => this.addInteractiveElement(el as HTMLElement));
  }

  addInteractiveElement(element) {
    // 避免重复添加
    if (this.interactiveElements.some(el => el.element === element)) {
      return;
    }
    
    const interactiveElement = {
      element,
      rect: element.getBoundingClientRect(),
      isHovered: false,
      lastInteraction: 0
    };
    
    this.interactiveElements.push(interactiveElement);
    this.addEventListeners(interactiveElement);
  }

  addEventListeners(interactiveElement) {
    const { element } = interactiveElement;
    
    // 鼠标悬停事件
    element.addEventListener('mouseenter', (e) => {
      interactiveElement.isHovered = true;
      this.createRipple(e, 'hover');
    });
    
    element.addEventListener('mouseleave', () => {
      interactiveElement.isHovered = false;
    });
    
    // 点击事件
    element.addEventListener('click', (e) => {
      this.createRipple(e, 'click');
    });
    
    // 触摸事件
    element.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.createRipple(touch, 'touch');
    });
  }

  createRipple(event, type) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // 计算点击位置相对于元素的坐标
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = {
      x: rect.left + x,
      y: rect.top + y,
      size: 0,
      maxSize: Math.max(rect.width, rect.height) * 2,
      opacity: 1,
      type,
      speed: type === 'click' ? 3 : 1,
      life: 1,
      color: this.getRippleColor(target)
    };
    
    this.ripples.push(ripple);
  }

  getRippleColor(element) {
    // 从元素获取颜色，或者使用默认颜色
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.getPropertyValue('--qi-brand-emerald') || '#4ade80';
    return color;
  }

  updateRipples() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const ripple = this.ripples[i];
      
      // 更新大小和透明度
      ripple.size += ripple.speed * 2;
      ripple.opacity = 1 - (ripple.size / ripple.maxSize);
      ripple.life -= 0.02;
      
      // 移除过期的涟漪
      if (ripple.opacity <= 0 || ripple.life <= 0) {
        this.ripples.splice(i, 1);
      }
    }
  }

  applyFluidInteraction() {
    if (!this.isActive) return;
    
    // 处理悬停效果
    this.interactiveElements.forEach((interactiveElement) => {
      const { element, isHovered, rect } = interactiveElement;
      
      if (isHovered) {
        // 为悬停的元素创建流体吸引效果
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 临时修改流体的鼠标位置，创造吸引效果
        this.fluid.setMousePosition(centerX, centerY);
      }
    });
  }

  drawRipples() {
    if (!this.ripples.length) return;
    
    // 使用流体实例的画布上下文绘制涟漪
    const canvas = this.fluid.canvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.save();
    
    this.ripples.forEach((ripple) => {
      ctx.globalAlpha = ripple.opacity;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.size, 0, Math.PI * 2);
      ctx.fillStyle = ripple.color;
      ctx.fill();
    });
    
    ctx.restore();
  }

  animate() {
    if (!this.isActive) return;
    
    this.updateRipples();
    this.applyFluidInteraction();
    
    requestAnimationFrame(() => this.animate());
  }

  setActive(active) {
    this.isActive = active;
  }

  // 响应式调整
  handleResize() {
    // 更新所有交互元素的位置
    this.interactiveElements.forEach((interactiveElement) => {
      interactiveElement.rect = interactiveElement.element.getBoundingClientRect();
    });
  }
}

export { FluidUIInteraction };