/**
 * CardTilt — 卡片 3D 倾斜 + 光泽效果
 * 参考 wegic.ai 的 TiltCard 组件
 * 仅桌面端启用，移动端自动禁用
 */
export class CardTilt {
  constructor(selector = '.tilt-card', options = {}) {
    this.maxRotation = options.maxRotation || 8;
    this.scale = options.scale || 1.02;
    this.elements = [];

    if (window.matchMedia('(pointer: fine)').matches) {
      this.elements = Array.from(document.querySelectorAll(selector));
      this._bind();
    }
  }

  _bind() {
    this.elements.forEach(el => {
      el.addEventListener('mousemove', (e) => this._onMove(e, el));
      el.addEventListener('mouseleave', (e) => this._onLeave(e, el));
    });
  }

  _onMove(e, el) {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * this.maxRotation;
    const rotateY = ((x - centerX) / centerX) * this.maxRotation;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.scale}, ${this.scale}, ${this.scale})`;

    // 更新光泽位置
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    el.style.setProperty('--tilt-x', `${percentX}%`);
    el.style.setProperty('--tilt-y', `${percentY}%`);
  }

  _onLeave(e, el) {
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }

  destroy() {
    this.elements.forEach(el => {
      el.removeEventListener('mousemove', this._onMove);
      el.removeEventListener('mouseleave', this._onLeave);
    });
    this.elements = [];
  }
}
