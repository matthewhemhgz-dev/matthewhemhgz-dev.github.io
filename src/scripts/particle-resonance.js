class ParticleResonance {
  constructor(width, height, seed = 12345) {
    this.width = width;
    this.height = height;
    this.seed = seed;
    this.particles = [];
    this.numParticles = 300; // 减少粒子数量以提高性能
    this.attractionStrength = 0.08; // 调整吸引力强度
    this.repulsionStrength = 0.4; // 调整排斥力强度
    this.repulsionRadius = 40; // 调整排斥半径
    this.attractionRadius = 120; // 调整吸引半径
    this.particleSpeed = 1.5; // 调整粒子速度
    this.trailLength = 0.05; // 减少拖尾长度以提高性能
    this.friction = 0.02; // 摩擦力系数
    this.airResistance = 0.01; // 空气阻力系数
    this.colors = {
      emerald: '#4ade80',
      amber: '#fbbf24',
      mint: '#a7f3d0'
    };
    this.frameCount = 0;
    this.isMobile = window.innerWidth < 768;
    this.mouseX = width / 2;
    this.mouseY = height / 2;
    this.mouseRadius = 150;
    this.mouseStrength = 0.05;
    
    // 根据设备性能调整参数
    if (this.isMobile) {
      this.numParticles = 200;
      this.trailLength = 0.03;
      this.attractionRadius = 100;
      this.mouseRadius = 120;
      this.mouseStrength = 0.04;
      this.friction = 0.03;
      this.airResistance = 0.015;
    }
    
    this.initializeParticles();
  }

  initializeParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: random(this.width),
        y: random(this.height),
        vx: random(-1, 1) * 0.5, // 减少初始速度
        vy: random(-1, 1) * 0.5,
        history: []
      });
    }
  }

  update() {
    randomSeed(this.seed);
    this.frameCount++;
    
    // 每帧只更新部分粒子，提高性能
    const updateCount = Math.min(80, this.numParticles);
    for (let i = 0; i < updateCount; i++) {
      const index = (this.frameCount * 5 + i) % this.numParticles;
      const particle = this.particles[index];
      
      // Calculate forces from other particles
      let totalForceX = 0;
      let totalForceY = 0;
      let forceCount = 0;
      
      // 只计算附近的粒子，减少计算量
      for (let j = 0; j < this.particles.length; j++) {
        if (i === j) continue;
        
        let otherParticle = this.particles[j];
        let dx = otherParticle.x - particle.x;
        let dy = otherParticle.y - particle.y;
        let distance = sqrt(dx * dx + dy * dy);
        
        // 只处理一定范围内的粒子
        if (distance < this.attractionRadius) {
          if (distance < this.repulsionRadius) {
            // Repulsion force
            let force = (this.repulsionRadius - distance) / this.repulsionRadius;
            force *= this.repulsionStrength;
            totalForceX -= (dx / distance) * force;
            totalForceY -= (dy / distance) * force;
          } else {
            // Attraction force
            let force = (distance - this.repulsionRadius) / (this.attractionRadius - this.repulsionRadius);
            force *= this.attractionStrength;
            totalForceX += (dx / distance) * force;
            totalForceY += (dy / distance) * force;
          }
          forceCount++;
        }
      }
      
      // 平均力，使运动更稳定
      if (forceCount > 0) {
        totalForceX /= forceCount;
        totalForceY /= forceCount;
      }
      
      // 添加鼠标交互力
      let dx = this.mouseX - particle.x;
      let dy = this.mouseY - particle.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouseRadius) {
        let force = (this.mouseRadius - distance) / this.mouseRadius;
        force *= this.mouseStrength;
        totalForceX += (dx / distance) * force;
        totalForceY += (dy / distance) * force;
      }
      
      // Update velocity
      particle.vx += totalForceX;
      particle.vy += totalForceY;
      
      // 添加阻尼，使运动更自然
      particle.vx *= 0.92;
      particle.vy *= 0.92;
      
      // 添加摩擦力和空气阻力
      let speed = sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > 0) {
        // 计算摩擦力
        let frictionForceX = -particle.vx * this.friction;
        let frictionForceY = -particle.vy * this.friction;
        
        // 计算空气阻力（与速度平方成正比）
        let airResistanceForceX = -particle.vx * speed * this.airResistance;
        let airResistanceForceY = -particle.vy * speed * this.airResistance;
        
        // 应用力
        particle.vx += frictionForceX + airResistanceForceX;
        particle.vy += frictionForceY + airResistanceForceY;
      }
      
      // Limit speed
      speed = sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
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
      const maxHistory = this.isMobile ? 15 : 20;
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
    
    // 只在非移动端绘制粒子间的连接，提高性能
    if (!this.isMobile) {
      // Draw connections between particles
      for (let i = 0; i < this.particles.length; i++) {
        let particle = this.particles[i];
        
        // 只绘制部分粒子的连接
        if (i % 3 !== 0) continue;
        
        for (let j = i + 1; j < this.particles.length; j++) {
          let otherParticle = this.particles[j];
          let dx = otherParticle.x - particle.x;
          let dy = otherParticle.y - particle.y;
          let distance = sqrt(dx * dx + dy * dy);
          
          if (distance < this.attractionRadius) {
            let alpha = map(distance, 0, this.attractionRadius, 255, 0);
            let color = this.colors.emerald;
            
            stroke(color);
            strokeWeight(0.3);
            line(particle.x, particle.y, otherParticle.x, otherParticle.y);
          }
        }
      }
    }
    
    // Draw particles
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
    if (params.attractionStrength) this.attractionStrength = params.attractionStrength;
    if (params.repulsionStrength) this.repulsionStrength = params.repulsionStrength;
    if (params.repulsionRadius) this.repulsionRadius = params.repulsionRadius;
    if (params.attractionRadius) this.attractionRadius = params.attractionRadius;
    if (params.particleSpeed) this.particleSpeed = params.particleSpeed;
    if (params.trailLength) this.trailLength = params.trailLength;
    if (params.friction) this.friction = params.friction;
    if (params.airResistance) this.airResistance = params.airResistance;
    this.initializeParticles();
  }

  // 响应式调整
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.isMobile = width < 768;
    
    // 根据屏幕尺寸调整参数
    if (this.isMobile) {
      this.numParticles = 200;
      this.trailLength = 0.03;
      this.attractionRadius = 100;
      this.mouseRadius = 120;
      this.mouseStrength = 0.04;
      this.friction = 0.03;
      this.airResistance = 0.015;
    } else {
      this.numParticles = 300;
      this.trailLength = 0.05;
      this.attractionRadius = 120;
      this.mouseRadius = 150;
      this.mouseStrength = 0.05;
      this.friction = 0.02;
      this.airResistance = 0.01;
    }
    
    this.initializeParticles();
  }

  // 设置鼠标位置
  setMousePosition(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }
}

export { ParticleResonance };

// Usage example:
// let particles = new ParticleResonance(windowWidth, windowHeight);
// 
// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noFill();
// }
// 
// function draw() {
//   particles.update();
//   particles.draw();
// }
// 
// function mousePressed() {
//   particles.setSeed(random(100000));
// }