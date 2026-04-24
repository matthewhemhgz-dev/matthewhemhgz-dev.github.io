import p5 from 'https://cdn.skypack.dev/p5@1.9.0';

class BrandVisuals {
  constructor(canvasId, options = {}) {
    this.canvasId = canvasId;
    this.options = {
      type: 'logo', // logo, pattern, abstract
      size: 200,
      colors: {
        emerald: '#4ade80',
        amber: '#fbbf24',
        mint: '#a7f3d0'
      },
      ...options
    };
    
    this.p5Instance = null;
  }

  init() {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(this.options.size, this.options.size);
        canvas.parent(this.canvasId);
        p.noLoop();
        this._drawVisual(p);
      };
    };

    this.p5Instance = new p5(sketch);
  }

  _drawVisual(p) {
    p.background(255);
    
    switch (this.options.type) {
      case 'pattern':
        this._drawPattern(p);
        break;
      case 'abstract':
        this._drawAbstract(p);
        break;
      case 'logo':
      default:
        this._drawLogo(p);
        break;
    }
  }

  _drawLogo(p) {
    const size = this.options.size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // 绘制外圆
    p.noFill();
    p.stroke(this.options.colors.emerald);
    p.strokeWeight(size * 0.05);
    p.ellipse(centerX, centerY, radius * 2);
    
    // 绘制内圆
    p.stroke(this.options.colors.amber);
    p.ellipse(centerX, centerY, radius * 1.2);
    
    // 绘制中心图案
    p.fill(this.options.colors.mint);
    p.noStroke();
    p.push();
    p.translate(centerX, centerY);
    p.rotate(p.PI / 4);
    p.rectMode(p.CENTER);
    p.rect(0, 0, radius * 0.6, radius * 0.6);
    p.pop();
    
    // 绘制交叉线条
    p.stroke(this.options.colors.emerald);
    p.strokeWeight(size * 0.03);
    p.line(centerX - radius * 0.8, centerY, centerX + radius * 0.8, centerY);
    p.line(centerX, centerY - radius * 0.8, centerX, centerY + radius * 0.8);
  }

  _drawPattern(p) {
    const size = this.options.size;
    const gridSize = size / 5;
    
    for (let x = 0; x < size; x += gridSize) {
      for (let y = 0; y < size; y += gridSize) {
        const colorIndex = (x + y) % 3;
        let color;
        
        switch (colorIndex) {
          case 0:
            color = this.options.colors.emerald;
            break;
          case 1:
            color = this.options.colors.amber;
            break;
          case 2:
            color = this.options.colors.mint;
            break;
        }
        
        p.fill(color);
        p.noStroke();
        
        // 绘制不同形状
        if ((x / gridSize + y / gridSize) % 2 === 0) {
          p.ellipse(x + gridSize / 2, y + gridSize / 2, gridSize * 0.8);
        } else {
          p.rectMode(p.CENTER);
          p.rect(x + gridSize / 2, y + gridSize / 2, gridSize * 0.8, gridSize * 0.8);
        }
      }
    }
  }

  _drawAbstract(p) {
    const size = this.options.size;
    const colors = [this.options.colors.emerald, this.options.colors.amber, this.options.colors.mint];
    
    // 绘制背景渐变
    for (let y = 0; y < size; y++) {
      const gradient = p.map(y, 0, size, 0, 1);
      const color1 = p.color(this.options.colors.mint);
      const color2 = p.color(this.options.colors.emerald);
      const color = p.lerpColor(color1, color2, gradient);
      p.stroke(color);
      p.line(0, y, size, y);
    }
    
    // 绘制抽象形状
    p.noFill();
    p.strokeWeight(2);
    
    for (let i = 0; i < 5; i++) {
      p.stroke(colors[i % colors.length]);
      p.beginShape();
      for (let j = 0; j < 8; j++) {
        const angle = (p.TWO_PI / 8) * j;
        const radius = size * 0.3 + p.sin(i * 0.5 + j * 0.3) * size * 0.1;
        const x = size / 2 + p.cos(angle) * radius;
        const y = size / 2 + p.sin(angle) * radius;
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }
  }

  setType(type) {
    this.options.type = type;
    if (this.p5Instance) {
      this._drawVisual(this.p5Instance);
    }
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
    if (this.p5Instance) {
      this._drawVisual(this.p5Instance);
    }
  }

  destroy() {
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }
  }
}

export { BrandVisuals };
