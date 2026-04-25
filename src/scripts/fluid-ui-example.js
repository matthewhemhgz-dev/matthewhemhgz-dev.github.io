import { FluidHarmonics } from './fluid-harmonics.js';
import { FluidUIInteraction } from './fluid-ui-interaction.js';

/**
 * Fluid UI 交互示例
 * 展示如何将流体效果与UI元素交互集成
 */
function initFluidUI() {
  // 创建流体实例
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;

  // 设置画布尺寸
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 初始化流体
  const fluid = new FluidHarmonics(window.innerWidth, window.innerHeight);
  fluid.setCanvas(canvas);

  // 初始化流体-UI交互
  const fluidUI = new FluidUIInteraction(fluid);

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    fluid.setSize(window.innerWidth, window.innerHeight);
    fluidUI.handleResize();
  });

  // 动画循环
  function animate() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 更新流体
    fluid.update();

    // 绘制流体
    fluid.draw();

    // 绘制UI交互涟漪
    fluidUI.drawRipples();

    requestAnimationFrame(animate);
  }

  // 开始动画
  animate();

  // 示例：切换流体类型
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case '1':
        fluid.setParams({ fluidType: 'default' });
        break;
      case '2':
        fluid.setParams({ fluidType: 'wave' });
        break;
      case '3':
        fluid.setParams({ fluidType: 'vortex' });
        break;
      case '4':
        fluid.setParams({ fluidType: 'fountain' });
        break;
    }
  });

  console.log('Fluid UI interaction initialized!');
  console.log('Press 1-4 to switch fluid types:');
  console.log('1: Default noise');
  console.log('2: Wave');
  console.log('3: Vortex');
  console.log('4: Fountain');
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initFluidUI);

export { initFluidUI };
