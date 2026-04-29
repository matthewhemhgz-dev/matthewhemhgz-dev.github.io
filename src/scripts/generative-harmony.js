class GenerativeHarmony {
  constructor(p, width, height, seed = 12345) {
    this.p = p;
    this.width = width;
    this.height = height;
    this.seed = seed;
    this.shapes = [];
    this.numShapes = 50;
    this.shapeSize = 50;
    const cs =
      typeof window !== 'undefined' ? window.getComputedStyle(document.documentElement) : null;
    this.colors = {
      emerald: cs ? cs.getPropertyValue('--qi-brand-emerald').trim() || '#4ade80' : '#4ade80',
      amber: cs ? cs.getPropertyValue('--qi-brand-amber').trim() || '#fbbf24' : '#fbbf24',
      mint: cs ? cs.getPropertyValue('--qi-brand-mint').trim() || '#a7f3d0' : '#a7f3d0',
    };
    this.isMobile = window.innerWidth < 768;
    this.mouseX = width / 2;
    this.mouseY = height / 2;
    this.mouseRadius = 120;
    this.mouseStrength = 0.02;

    // 根据设备性能调整参数
    if (this.isMobile) {
      this.numShapes = 30;
      this.shapeSize = 30;
      this.mouseRadius = 100;
      this.mouseStrength = 0.015;
    }

    this.initializeShapes();
  }

  initializeShapes() {
    this.shapes = [];
    this.p.randomSeed(this.seed);

    for (let i = 0; i < this.numShapes; i++) {
      this.shapes.push({
        x: this.p.random(this.width),
        y: this.p.random(this.height),
        size: this.p.random(this.shapeSize * 0.5, this.shapeSize * 1.5),
        rotation: this.p.random(this.p.TWO_PI),
        color: this.getRandomColor(),
        speed: this.p.random(0.1, 0.3), // 减少速度以提高性能
        phase: this.p.random(this.p.TWO_PI),
      });
    }
  }

  getRandomColor() {
    const colorKeys = Object.keys(this.colors);
    return this.colors[colorKeys[this.p.floor(this.p.random(colorKeys.length))]];
  }

  update() {
    // 每帧只更新部分形状，提高性能
    const updateCount = Math.min(20, this.numShapes);
    for (let i = 0; i < updateCount; i++) {
      const index = (this.p.frameCount * 7 + i) % this.numShapes;
      const shape = this.shapes[index];

      // Update position with harmonic motion
      shape.x += this.p.sin(shape.phase) * shape.speed;
      shape.y += this.p.cos(shape.phase) * shape.speed;

      // 添加鼠标交互力
      let dx = this.mouseX - shape.x;
      let dy = this.mouseY - shape.y;
      let distance = this.p.sqrt(dx * dx + dy * dy);

      if (distance < this.mouseRadius) {
        let force = (this.mouseRadius - distance) / this.mouseRadius;
        force *= this.mouseStrength;
        shape.x += (dx / distance) * force;
        shape.y += (dy / distance) * force;
      }

      shape.rotation += 0.01;
      shape.phase += 0.05;

      // Wrap around boundaries
      if (shape.x < -shape.size) shape.x = this.width + shape.size;
      if (shape.x > this.width + shape.size) shape.x = -shape.size;
      if (shape.y < -shape.size) shape.y = this.height + shape.size;
      if (shape.y > this.height + shape.size) shape.y = -shape.size;
    }
  }

  draw() {
    for (let shape of this.shapes) {
      this.p.push();
      this.p.translate(shape.x, shape.y);
      this.p.rotate(shape.rotation);

      // Draw geometric shape
      this.p.noFill();
      this.p.stroke(shape.color);
      this.p.strokeWeight(this.isMobile ? 1 : 2);

      // Draw a polygon with varying sides based on seed (4-8 sides, no triangles)
      let sides = 4 + this.p.floor((this.seed + shape.x + shape.y) % 5);
      this.p.beginShape();
      for (let i = 0; i < sides; i++) {
        let angle = (this.p.TWO_PI / sides) * i;
        let radius = shape.size * 0.5;
        this.p.vertex(this.p.cos(angle) * radius, this.p.sin(angle) * radius);
      }
      this.p.endShape(this.p.CLOSE);

      // Draw inner details
      if (!this.isMobile) {
        // 移动端不绘制内部细节以提高性能
        this.p.strokeWeight(1);
        for (let i = 0; i < sides; i++) {
          let angle1 = (this.p.TWO_PI / sides) * i;
          let angle2 = (this.p.TWO_PI / sides) * ((i + 2) % sides);
          let radius1 = shape.size * 0.2;
          let radius2 = shape.size * 0.4;
          this.p.line(
            this.p.cos(angle1) * radius1,
            this.p.sin(angle1) * radius1,
            this.p.cos(angle2) * radius2,
            this.p.sin(angle2) * radius2,
          );
        }
      }

      this.p.pop();
    }

    // 只在非移动端绘制形状间的连接，提高性能
    if (!this.isMobile) {
      this.drawConnections();
    }
  }

  drawConnections() {
    for (let i = 0; i < this.shapes.length; i++) {
      // 只绘制部分形状的连接
      if (i % 4 !== 0) continue;

      for (let j = i + 1; j < this.shapes.length; j++) {
        let shape1 = this.shapes[i];
        let shape2 = this.shapes[j];

        let dx = shape2.x - shape1.x;
        let dy = shape2.y - shape1.y;
        let distance = this.p.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          let alpha = this.p.map(distance, 0, 100, 255, 0);
          this.p.stroke(255, alpha);
          this.p.strokeWeight(0.3);
          this.p.line(shape1.x, shape1.y, shape2.x, shape2.y);
        }
      }
    }
  }

  setSeed(seed) {
    this.seed = seed;
    this.initializeShapes();
  }

  setParams(params) {
    if (params.numShapes) this.numShapes = params.numShapes;
    if (params.shapeSize) this.shapeSize = params.shapeSize;
    this.initializeShapes();
  }

  // 响应式调整
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.isMobile = width < 768;

    // 根据屏幕尺寸调整参数
    if (this.isMobile) {
      this.numShapes = 30;
      this.shapeSize = 30;
      this.mouseRadius = 100;
      this.mouseStrength = 0.015;
    } else {
      this.numShapes = 50;
      this.shapeSize = 50;
      this.mouseRadius = 120;
      this.mouseStrength = 0.02;
    }

    this.initializeShapes();
  }

  // 设置鼠标位置
  setMousePosition(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }
}

export { GenerativeHarmony };

// Usage example:
// let generative = new GenerativeHarmony(windowWidth, windowHeight);
//
// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noFill();
// }
//
// function draw() {
//   background(255);
//   generative.update();
//   generative.draw();
// }
//
// function mousePressed() {
//   generative.setSeed(random(100000));
// }
