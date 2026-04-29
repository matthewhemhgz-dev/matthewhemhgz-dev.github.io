/**
 * FluidBackground — 流体背景效果
 * 基于 Canvas 的粒子流动效果，支持鼠标交互
 * 粒子间连线效果，增强视觉连贯性
 * 自适应容器尺寸，响应式设计
 */
export class FluidBackground {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0, radius: 150 };
    this.isInitialized = false;
    this.animationId = null;

    this.init();
  }

  /**
   * 初始化流体背景
   * 创建 Canvas 元素，设置样式，初始化粒子
   */
  init() {
    // 确保容器存在
    if (!this.container) return;

    // 设置canvas样式
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '0';
    this.canvas.style.pointerEvents = 'none';

    // 添加到容器
    this.container.appendChild(this.canvas);

    // 初始化粒子
    this.resize();
    this.createParticles();

    // 添加事件监听器
    window.addEventListener('resize', () => this.resize());
    this.container.addEventListener('mousemove', (e) => this.updateMouse(e));

    // 开始动画
    this.animate();
    this.isInitialized = true;
  }

  /**
   * 调整画布尺寸，适配容器大小
   */
  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * 创建粒子数据
   * 根据容器尺寸动态计算粒子数量
   */
  createParticles() {
    this.particles = [];
    // 根据容器面积计算粒子数量，最多150个
    const particleCount = Math.min(
      Math.floor((this.canvas.width * this.canvas.height) / 15000),
      150,
    );

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: this.getParticleColor(),
      });
    }
  }

  /**
   * 获取随机粒子颜色
   * 使用品牌色彩系统的半透明变体
   */
  getParticleColor() {
    const colors = [
      'rgba(74, 222, 128, 0.15)', // 翡翠绿
      'rgba(16, 185, 129, 0.15)', // 深翡翠绿
      'rgba(132, 204, 22, 0.15)', // 薄荷绿
      'rgba(245, 158, 11, 0.15)', // 琥珀色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 更新鼠标位置
   * 相对于容器的坐标
   */
  updateMouse(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  /**
   * 动画循环
   * 更新和渲染粒子
   */
  animate() {
    if (!this.isInitialized) return;

    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 遍历所有粒子
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // 绘制粒子
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // 更新粒子位置
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // 边界检测 - 反弹效果
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.speedX *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.speedY *= -1;
      }

      // 鼠标交互 - 粒子排斥效果
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        particle.x -= forceDirectionX * force * 2;
        particle.y -= forceDirectionY * force * 2;
      }

      // 连接附近的粒子 - 形成网络效果
      for (let j = i; j < this.particles.length; j++) {
        const otherParticle = this.particles[j];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(74, 222, 128, ${0.1 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
        }
      }
    }

    // 请求下一帧动画
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * 销毁流体背景实例
   * 清理 Canvas 元素和事件监听器
   */
  destroy() {
    // 取消动画循环
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // 移除 Canvas 元素
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // 重置状态
    this.isInitialized = false;
    this.particles = [];
  }
}

// 注意：此文件不再自动初始化，如需使用，请在 init.js 中显式调用

// 导出模块
export { FluidBackground };
