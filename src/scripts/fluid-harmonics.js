class FluidHarmonics {
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
    this.colors = {
      emerald: '#4ade80',
      amber: '#fbbf24',
      mint: '#a7f3d0'
    };
    this.frameCount = 0;
    this.isMobile = window.innerWidth < 768;
    this.mouseX = width / 2;
    this.mouseY = height / 2;
    this.mouseRadius = 100;
    this.mouseStrength = 0.1;
    
    // 根据设备性能调整参数
    if (this.isMobile) {
      this.numParticles = 300;
      this.trailLength = 0.03;
      this.mouseRadius = 80;
      this.mouseStrength = 0.08;
      this.collisionRadius = 6;
      this.collisionStrength = 0.4;
    }
    
    this.initializeParticles();
  }

  initializeParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: random(this.width),
        y: random(this.height),
        vx: 0,
        vy: 0,
        history: []
      });
    }
  }

  update() {
    noiseSeed(this.seed);
    this.frameCount++;
    
    // 每帧只更新部分粒子，提高性能
    const updateCount = Math.min(100, this.numParticles);
    for (let i = 0; i < updateCount; i++) {
      const index = (this.frameCount * 3 + i) % this.numParticles;
      const particle = this.particles[index];
      
      // Calculate noise-based force
      let noiseValue = noise(
        particle.x * this.noiseScale,
        particle.y * this.noiseScale,
        this.frameCount * 0.001
      );
      
      let angle = noiseValue * TWO_PI * 4;
      let forceX = cos(angle) * this.noiseStrength;
      let forceY = sin(angle) * this.noiseStrength;
      
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
        color = lerpColor(
          color(this.colors.mint),
          color(this.colors.emerald),
          colorIndex
        );
      } else {
        color = lerpColor(
          color(this.colors.emerald),
          color(this.colors.amber),
          colorIndex - 1
        );
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
      if (!this.isMobile) { // 移动端不绘制粒子头部以提高性能
        fill(color);
        noStroke();
        ellipse(particle.x, particle.y, 2, 2);
      }
    }
  }

  setSeed(seed) {
    this.seed = seed;
    this.initializeParticles();
  }

  setParams(params) {
    if (params.numParticles) this.numParticles = params.numParticles;
    if (params.noiseScale) this.noiseScale = params.noiseScale;
    if (params.noiseStrength) this.noiseStrength = params.noiseStrength;
    if (params.particleSpeed) this.particleSpeed = params.particleSpeed;
    if (params.trailLength) this.trailLength = params.trailLength;
    if (params.collisionRadius) this.collisionRadius = params.collisionRadius;
    if (params.collisionStrength) this.collisionStrength = params.collisionStrength;
    this.initializeParticles();
  }

  // 响应式调整
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.isMobile = width < 768;
    
    // 根据屏幕尺寸调整参数
    if (this.isMobile) {
      this.numParticles = 300;
      this.trailLength = 0.03;
      this.mouseRadius = 80;
      this.mouseStrength = 0.08;
      this.collisionRadius = 6;
      this.collisionStrength = 0.4;
    } else {
      this.numParticles = 500;
      this.trailLength = 0.05;
      this.mouseRadius = 100;
      this.mouseStrength = 0.1;
      this.collisionRadius = 8;
      this.collisionStrength = 0.5;
    }
    
    this.initializeParticles();
  }

  // 设置鼠标位置
  setMousePosition(x, y) {
    this.mouseX = x;
    this.mouseY = y;
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