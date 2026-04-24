// 交互增强脚本
// 实现碰撞反馈、按钮点击效果和滚动拖拽惯性效果

class InteractionEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.initButtonEffects();
    this.initScrollInertia();
    this.initDragInertia();
  }

  // 初始化按钮点击效果
  initButtonEffects() {
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
      // 避免为已有特殊效果的元素添加重复效果
      if (!button.classList.contains('no-interaction-effect')) {
        button.addEventListener('click', this.handleButtonClick.bind(this));
        button.addEventListener('touchstart', this.handleButtonTouch.bind(this));
      }
    });
  }

  // 处理按钮点击
  handleButtonClick(e) {
    const button = e.currentTarget;
    this.createButtonRipple(e, button);
    this.createButtonPressEffect(button);
  }

  // 处理按钮触摸
  handleButtonTouch(e) {
    const button = e.currentTarget;
    this.createButtonRipple(e.touches[0], button);
  }

  // 创建按钮涟漪效果
  createButtonRipple(e, button) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('button-ripple');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    // 动画结束后移除涟漪
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // 创建按钮按压效果
  createButtonPressEffect(button) {
    button.style.transform = 'scale(0.97)';
    button.style.transition = 'transform 0.1s ease';

    setTimeout(() => {
      button.style.transform = '';
      button.style.transition = '';
    }, 100);
  }

  // 初始化滚动惯性
  initScrollInertia() {
    let lastScrollTime = 0;
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let isScrolling = false;

    const handleScroll = () => {
      const currentTime = performance.now();
      const currentScrollY = window.scrollY;
      const deltaTime = currentTime - lastScrollTime;
      const deltaY = currentScrollY - lastScrollY;

      // 计算滚动速度
      if (deltaTime > 0) {
        velocity = deltaY / deltaTime;
      }

      lastScrollTime = currentTime;
      lastScrollY = currentScrollY;

      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => this.applyScrollInertia(velocity));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // 应用滚动惯性
  applyScrollInertia(initialVelocity) {
    let velocity = initialVelocity * 0.8;
    let position = window.scrollY;
    let isActive = true;

    const inertiaLoop = () => {
      if (Math.abs(velocity) < 0.1) {
        isActive = false;
        return;
      }

      velocity *= 0.95; // 摩擦系数
      position += velocity * 16; // 假设 60fps，每帧 16ms

      // 限制滚动范围
      position = Math.max(0, Math.min(position, document.documentElement.scrollHeight - window.innerHeight));

      window.scrollTo(0, position);

      if (isActive) {
        requestAnimationFrame(inertiaLoop);
      }
    };

    if (Math.abs(initialVelocity) > 1) {
      inertiaLoop();
    }
  }

  // 初始化拖拽惯性
  initDragInertia() {
    let isDragging = false;
    let startX, startY, startScrollX, startScrollY;
    let lastMoveTime = 0;
    let lastX, lastY;
    let velocityX = 0, velocityY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startScrollX = window.scrollX;
      startScrollY = window.scrollY;
      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveTime = performance.now();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - lastMoveTime;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;

      // 计算拖拽速度
      if (deltaTime > 0) {
        velocityX = deltaX / deltaTime;
        velocityY = deltaY / deltaTime;
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveTime = currentTime;

      // 应用拖拽
      window.scrollTo(startScrollX - (e.clientX - startX), startScrollY - (e.clientY - startY));
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // 应用拖拽惯性
      if (Math.abs(velocityX) > 1 || Math.abs(velocityY) > 1) {
        this.applyDragInertia(velocityX, velocityY);
      }
    };

    // 为可拖拽元素添加事件监听
    const draggableElements = document.querySelectorAll('.draggable, .scrollable');
    draggableElements.forEach(element => {
      element.addEventListener('mousedown', handleMouseDown);
    });

    // 为整个文档添加拖拽支持
    document.addEventListener('mousedown', (e) => {
      // 避免在按钮和输入元素上触发拖拽
      if (!e.target.closest('button, input, textarea, select, a')) {
        handleMouseDown(e);
      }
    });
  }

  // 应用拖拽惯性
  applyDragInertia(initialVelocityX, initialVelocityY) {
    let velocityX = initialVelocityX * 0.8;
    let velocityY = initialVelocityY * 0.8;
    let positionX = window.scrollX;
    let positionY = window.scrollY;
    let isActive = true;

    const inertiaLoop = () => {
      if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
        isActive = false;
        return;
      }

      velocityX *= 0.95; // 摩擦系数
      velocityY *= 0.95;
      positionX += velocityX * 16;
      positionY += velocityY * 16;

      // 限制滚动范围
      positionX = Math.max(0, Math.min(positionX, document.documentElement.scrollWidth - window.innerWidth));
      positionY = Math.max(0, Math.min(positionY, document.documentElement.scrollHeight - window.innerHeight));

      window.scrollTo(positionX, positionY);

      if (isActive) {
        requestAnimationFrame(inertiaLoop);
      }
    };

    inertiaLoop();
  }
}

export { InteractionEnhancements };