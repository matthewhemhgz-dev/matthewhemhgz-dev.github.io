import p5 from 'https://cdn.skypack.dev/p5@1.9.0';
import { FluidHarmonics } from './fluid-harmonics.js';
import { ParticleResonance } from './particle-resonance.js';
import { GenerativeHarmony } from './generative-harmony.js';

class BackgroundArt {
  constructor(canvasId, options = {}) {
    this.canvasId = canvasId;
    this.options = {
      type: 'fluid', // fluid, particles, generative
      particleCount: 80,
      speed: 0.5,
      colors: {
        emerald: '#4ade80',
        amber: '#fbbf24',
        mint: '#a7f3d0',
      },
      ...options,
    };

    this.p5Instance = null;
    this.artInstance = null;
    this.isRunning = false;
  }

  init() {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent(this.canvasId);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        canvas.style('opacity', '0.3');

        p.noFill();

        // 初始化艺术实例
        this._initArtInstance(p);
        this.isRunning = true;

        // 添加鼠标移动事件监听器
        canvas.mouseMoved(() => {
          if (this.artInstance && this.artInstance.setMousePosition) {
            this.artInstance.setMousePosition(p.mouseX, p.mouseY);
          }
        });
      };

      p.draw = () => {
        if (!this.isRunning || !this.artInstance) return;

        p.background(255);
        this.artInstance.update();
        this.artInstance.draw();
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        if (this.artInstance) {
          // 调用setSize方法进行响应式调整
          if (this.artInstance.setSize) {
            this.artInstance.setSize(p.width, p.height);
          } else {
            this.artInstance.width = p.width;
            this.artInstance.height = p.height;
          }
        }
      };
    };

    this.p5Instance = new p5(sketch);
  }

  _initArtInstance(p) {
    const seed = Math.floor(Math.random() * 100000);

    switch (this.options.type) {
      case 'particles':
        this.artInstance = new ParticleResonance(p.width, p.height, seed);
        this.artInstance.numParticles = this.options.particleCount;
        this.artInstance.particleSpeed = this.options.speed;
        break;
      case 'generative':
        this.artInstance = new GenerativeHarmony(p.width, p.height, seed);
        break;
      case 'fluid':
      default:
        this.artInstance = new FluidHarmonics(p.width, p.height, seed);
        this.artInstance.numParticles = this.options.particleCount;
        this.artInstance.particleSpeed = this.options.speed;
        break;
    }
  }

  setType(type) {
    this.options.type = type;
    if (this.p5Instance) {
      this._initArtInstance(this.p5Instance);
    }
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
    if (this.artInstance) {
      if (options.particleCount) this.artInstance.numParticles = options.particleCount;
      if (options.speed) this.artInstance.particleSpeed = options.speed;
      if (options.colors) this.artInstance.colors = options.colors;
    }
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    this.isRunning = true;
  }

  destroy() {
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }
    this.artInstance = null;
    this.isRunning = false;
  }
}

export { BackgroundArt };
