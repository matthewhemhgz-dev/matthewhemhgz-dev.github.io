/**
 * 流体谐波系统
 * 基于粒子的流体模拟效果
 * @class FluidHarmonics
 */
class FluidHarmonics {
  /**
   * 构造函数
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   * @param {number} [seed=12345] - 随机种子
   */
  constructor(width, height, seed = 12345) {
    this.width = width;
    this.height = height;
    this.seed = seed;
    this.particles = [];
    this.numParticles = 500; // 减少粒子数量以提高性能
    this.noiseScale = 0.01;
    this.noiseStrength = 0.8; // 调整噪声强度
    this.particleSpeed = 1;
    this.trailLength = 0.05; // 减少拖尾长度以提高性能
    this.collisionRadius = 8; // 碰撞检测半径
    this.collisionStrength = 0.5; // 碰撞强度
    this.fluidType = 'default'; // default, wave, vortex, fountain
    this.waveAmplitude = 50; // 波浪振幅
    this.waveFrequency = 0.02; // 波浪频率
    this.waveSpeed = 0.02; // 波浪速度
    this.vortexStrength = 0.5; // 漩涡强度
    this.vortexCenter = { x: width / 2, y: height / 2 }; // 漩涡中心
    this.fountainHeight = 200; // 喷泉高度
    this.fountainWidth = 100; // 喷泉宽度
    this.colors = {
      emerald: '#4ade80',
      amber: '#fbbf24',
      mint: '#a7f3d0',
    };
    this.frameCount = 0;
    this.isMobile = window.innerWidth < 768;
    this.mouseX = width / 2;
    this.mouseY = height / 2;
    this.mouseRadius = 100;
    this.mouseStrength = 0.1;
    this.canvas = null; // 画布引用

    // 根据设备性能调整参数
    if (this.isMobile) {
      this.numParticles = 300;
      this.trailLength = 0.03;
      this.mouseRadius = 80;
      this.mouseStrength = 0.08;
      this.collisionRadius = 6;
      this.collisionStrength = 0.4;
      this.waveAmplitude = 30;
      this.vortexStrength = 0.3;
      this.fountainHeight = 150;
      this.fountainWidth = 80;
    }

    this.initializeParticles();
  }

  /**
   * 初始化粒子系统
   */
  initializeParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: random(this.width),
        y: random(this.height),
        vx: 0,
        vy: 0,
        history: [],
      });
    }
  }

  /**
   * 更新粒子状态
   */
  update() {
    noiseSeed(this.seed);
    this.frameCount++;

    // 每帧只更新部分粒子，提高性能
    const updateCount = Math.min(100, this.numParticles);
    for (let i = 0; i < updateCount; i++) {
      const index = (this.frameCount * 3 + i) % this.numParticles;
      const particle = this.particles[index];

      // 根据流体类型计算力
      let forceX = 0;
      let forceY = 0;
      let angle;

      switch (this.fluidType) {
        case 'wave':
          // 波浪效果
          let waveOffset =
            sin(particle.x * this.waveFrequency + this.frameCount * this.waveSpeed) *
            this.waveAmplitude;
          let targetY = this.height / 2 + waveOffset;
          forceY = (targetY - particle.y) * 0.01;
          forceX = 0.1;
          break;

        case 'vortex':
          // 漩涡效果
          let dx = particle.x - this.vortexCenter.x;
          let dy = particle.y - this.vortexCenter.y;
          let distance = sqrt(dx * dx + dy * dy);
          angle = atan2(dy, dx);
          forceX = (-sin(angle) * this.vortexStrength) / (distance * 0.1 + 1);
          forceY = (cos(angle) * this.vortexStrength) / (distance * 0.1 + 1);
          // 向中心的吸引力
          forceX -= dx * 0.001;
          forceY -= dy * 0.001;
          break;

        case 'fountain':
          // 喷泉效果
          let fountainCenterX = this.width / 2;
          let fountainBottomY = this.height - 50;

          // 粒子从底部向上喷射
          if (particle.y > fountainBottomY - this.fountainHeight) {
            // 上升阶段
            forceY = -0.3;
            // 水平扩散
            forceX = (particle.x - fountainCenterX) * 0.005;
          } else {
            // 下落阶段
            forceY = 0.2;
          }

          // 限制在喷泉宽度内
          if (abs(particle.x - fountainCenterX) > this.fountainWidth) {
            forceX = (fountainCenterX - particle.x) * 0.01;
          }
          break;

        default:
          // 默认噪声效果
          let noiseValue = noise(
            particle.x * this.noiseScale,
            particle.y * this.noiseScale,
            this.frameCount * 0.001,
          );

          angle = noiseValue * TWO_PI * 4;
          forceX = cos(angle) * this.noiseStrength;
          forceY = sin(angle) * this.noiseStrength;
          break;
      }

      // 添加鼠标交互力
      let dx = this.mouseX - particle.x;
      let dy = this.mouseY - particle.y;
      let distance = sqrt(dx * dx + dy * dy);

      if (distance < this.mouseRadius) {
        let force = (this.mouseRadius - distance) / this.mouseRadius;
        force *= this.mouseStrength;
        forceX += (dx / distance) * force;
        forceY += (dy / distance) * force;
      }

      // 添加碰撞检测
      for (let j = 0; j < this.particles.length; j++) {
        if (i === j) continue;

        let otherParticle = this.particles[j];
        let dx = otherParticle.x - particle.x;
        let dy = otherParticle.y - particle.y;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance < this.collisionRadius) {
          // 计算碰撞力
          let force = (this.collisionRadius - distance) / this.collisionRadius;
          force *= this.collisionStrength;

          // 应用碰撞力
          let forceXCollision = (dx / distance) * force;
          let forceYCollision = (dy / distance) * force;

          // 双向力
          particle.vx -= forceXCollision * 0.5;
          particle.vy -= forceYCollision * 0.5;
          otherParticle.vx += forceXCollision * 0.5;
          otherParticle.vy += forceYCollision * 0.5;
        }
      }

      // Update velocity
      particle.vx += forceX * 0.5; // 减少力的影响，使运动更平滑
      particle.vy += forceY * 0.5;

      // 添加阻尼，使运动更自然
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Limit speed
      let speed = sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > this.particleSpeed) {
        particle.vx = (particle.vx / speed) * this.particleSpeed;
        particle.vy = (particle.vy / speed) * this.particleSpeed;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around boundaries
      if (particle.x < 0) particle.x = this.width;
      if (particle.x > this.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.height;
      if (particle.y > this.height) particle.y = 0;

      // Update history
      particle.history.push({ x: particle.x, y: particle.y });
      // 限制历史记录长度
      const maxHistory = this.isMobile ? 20 : 30;
      if (particle.history.length > maxHistory) {
        particle.history.shift();
      }
    }
  }

  /**
   * 绘制粒子系统
   */
  draw() {
    // Semi-transparent background for trail effect
    fill(255, 255, 255, this.trailLength * 255);
    noStroke();
    rect(0, 0, this.width, this.height);

    // 批量绘制粒子
    for (let particle of this.particles) {
      // Calculate color based on speed
      let speed = sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      let colorIndex = map(speed, 0, this.particleSpeed, 0, 2);

      let color;
      if (colorIndex < 1) {
        color = lerpColor(color(this.colors.mint), color(this.colors.emerald), colorIndex);
      } else {
        color = lerpColor(color(this.colors.emerald), color(this.colors.amber), colorIndex - 1);
      }

      // Draw particle trail
      stroke(color);
      strokeWeight(this.isMobile ? 0.5 : 1);
      noFill();
      beginShape();
      for (let point of particle.history) {
        vertex(point.x, point.y);
      }
      endShape();

      // Draw particle head
      if (!this.isMobile) {
        // 移动端不绘制粒子头部以提高性能
        fill(color);
        noStroke();
        ellipse(particle.x, particle.y, 2, 2);
      }
    }
  }

  /**
   * 设置随机种子
   * @param {number} seed - 随机种子
   */
  setSeed(seed) {
    this.seed = seed;
    this.initializeParticles();
  }

  /**
   * 设置系统参数
   * @param {Object} params - 参数字典
   */
  setParams(params) {
    if (params.numParticles) this.numParticles = params.numParticles;
    if (params.noiseScale) this.noiseScale = params.noiseScale;
    if (params.noiseStrength) this.noiseStrength = params.noiseStrength;
    if (params.particleSpeed) this.particleSpeed = params.particleSpeed;
    if (params.trailLength) this.trailLength = params.trailLength;
    if (params.collisionRadius) this.collisionRadius = params.collisionRadius;
    if (params.collisionStrength) this.collisionStrength = params.collisionStrength;
    if (params.fluidType) this.fluidType = params.fluidType;
    if (params.waveAmplitude) this.waveAmplitude = params.waveAmplitude;
    if (params.waveFrequency) this.waveFrequency = params.waveFrequency;
    if (params.waveSpeed) this.waveSpeed = params.waveSpeed;
    if (params.vortexStrength) this.vortexStrength = params.vortexStrength;
    if (params.vortexCenter) this.vortexCenter = params.vortexCenter;
    if (params.fountainHeight) this.fountainHeight = params.fountainHeight;
    if (params.fountainWidth) this.fountainWidth = params.fountainWidth;
    this.initializeParticles();
  }

  /**
   * 响应式调整尺寸
   * @param {number} width - 新的宽度
   * @param {number} height - 新的高度
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.isMobile = width < 768;

    // 更新漩涡中心位置
    this.vortexCenter = { x: width / 2, y: height / 2 };

    // 根据屏幕尺寸调整参数
    if (this.isMobile) {
      this.numParticles = 300;
      this.trailLength = 0.03;
      this.mouseRadius = 80;
      this.mouseStrength = 0.08;
      this.collisionRadius = 6;
      this.collisionStrength = 0.4;
      this.waveAmplitude = 30;
      this.vortexStrength = 0.3;
      this.fountainHeight = 150;
      this.fountainWidth = 80;
    } else {
      this.numParticles = 500;
      this.trailLength = 0.05;
      this.mouseRadius = 100;
      this.mouseStrength = 0.1;
      this.collisionRadius = 8;
      this.collisionStrength = 0.5;
      this.waveAmplitude = 50;
      this.vortexStrength = 0.5;
      this.fountainHeight = 200;
      this.fountainWidth = 100;
    }

    this.initializeParticles();
  }

  /**
   * 设置鼠标位置
   * @param {number} x - 鼠标X坐标
   * @param {number} y - 鼠标Y坐标
   */
  setMousePosition(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }

  /**
   * 设置画布引用
   * @param {HTMLCanvasElement} canvas - 画布元素
   */
  setCanvas(canvas) {
    this.canvas = canvas;
  }
}

export { FluidHarmonics };

// Usage example:
// let fluid = new FluidHarmonics(windowWidth, windowHeight);
//
// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noFill();
// }
//
// function draw() {
//   fluid.update();
//   fluid.draw();
// }
//
// function mousePressed() {
//   fluid.setSeed(random(100000));
// }
