import p5 from 'https://cdn.skypack.dev/p5@1.9.0';

class BrandVisuals {
  constructor(canvasId, options = {}) {
    this.canvasId = canvasId;
    this.options = {
      type: 'logo', // logo, pattern, abstract, material
      size: 200,
      colors: {
        emerald: '#4ade80',
        amber: '#fbbf24',
        mint: '#a7f3d0'
      },
      material: 'metal', // metal, wood, fabric, leather, glass
      materialState: 'default', // default, hover, active, disabled
      microTexture: false, // 微质感效果
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
      case 'material':
        this._drawMaterial(p);
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

  _drawMaterial(p) {
    const size = this.options.size;
    
    switch (this.options.material) {
      case 'wood':
        this._drawWoodMaterial(p);
        break;
      case 'fabric':
        this._drawFabricMaterial(p);
        break;
      case 'leather':
        this._drawLeatherMaterial(p);
        break;
      case 'glass':
        this._drawGlassMaterial(p);
        break;
      case 'metal':
      default:
        this._drawMetalMaterial(p);
        break;
    }
    
    // 应用微质感效果
    if (this.options.microTexture) {
      this._applyMicroTexture(p);
    }
    
    // 应用材质状态效果
    this._applyMaterialState(p);
  }

  _drawMetalMaterial(p) {
    const size = this.options.size;
    
    // 绘制金属渐变背景
    for (let y = 0; y < size; y++) {
      const gradient = p.map(y, 0, size, 0, 1);
      const color1 = p.color(200, 200, 200);
      const color2 = p.color(120, 120, 120);
      const color = p.lerpColor(color1, color2, gradient);
      p.stroke(color);
      p.line(0, y, size, y);
    }
    
    // 绘制金属高光
    p.noFill();
    p.stroke(255, 255, 255, 150);
    p.strokeWeight(2);
    p.beginShape();
    for (let i = 0; i <= 10; i++) {
      const x = (size / 10) * i;
      const y = size * 0.3 + p.sin(i * 0.5) * size * 0.1;
      p.vertex(x, y);
    }
    p.endShape();
    
    // 绘制品牌颜色点缀
    p.fill(this.options.colors.emerald);
    p.noStroke();
    p.ellipse(size * 0.2, size * 0.2, size * 0.1);
    p.fill(this.options.colors.amber);
    p.ellipse(size * 0.8, size * 0.8, size * 0.1);
  }

  _drawWoodMaterial(p) {
    const size = this.options.size;
    
    // 绘制木纹背景
    for (let y = 0; y < size; y++) {
      const baseColor = p.color(180, 120, 60);
      const variation = p.random(-20, 20);
      const color = p.color(p.red(baseColor) + variation, p.green(baseColor) + variation, p.blue(baseColor) + variation);
      p.stroke(color);
      p.line(0, y, size, y);
    }
    
    // 绘制木纹纹理
    p.stroke(120, 80, 40, 100);
    p.strokeWeight(1);
    for (let i = 0; i < 10; i++) {
      p.beginShape();
      for (let j = 0; j <= size; j += 5) {
        const x = j;
        const y = (size / 10) * i + p.sin(j * 0.01) * size * 0.05;
        p.vertex(x, y);
      }
      p.endShape();
    }
  }

  _drawFabricMaterial(p) {
    const size = this.options.size;
    const colors = [this.options.colors.emerald, this.options.colors.amber, this.options.colors.mint];
    
    // 绘制布料纹理
    p.noFill();
    p.strokeWeight(1);
    
    for (let i = 0; i < size; i += 5) {
      p.stroke(colors[i % colors.length]);
      for (let j = 0; j < size; j += 5) {
        const x1 = i;
        const y1 = j;
        const x2 = i + p.random(-2, 2);
        const y2 = j + p.random(-2, 2);
        p.line(x1, y1, x2, y2);
      }
    }
  }

  _drawLeatherMaterial(p) {
    const size = this.options.size;
    
    // 绘制皮革背景
    for (let y = 0; y < size; y++) {
      const baseColor = p.color(150, 80, 50);
      const variation = p.random(-10, 10);
      const color = p.color(p.red(baseColor) + variation, p.green(baseColor) + variation, p.blue(baseColor) + variation);
      p.stroke(color);
      p.line(0, y, size, y);
    }
    
    // 绘制皮革纹理
    p.stroke(100, 60, 40, 80);
    p.strokeWeight(1);
    for (let i = 0; i < 20; i++) {
      const x = p.random(size);
      const y = p.random(size);
      const radius = p.random(5, 15);
      p.ellipse(x, y, radius, radius * 0.5);
    }
  }

  _drawGlassMaterial(p) {
    const size = this.options.size;
    
    // 绘制玻璃背景（半透明）
    p.background(240, 240, 240);
    
    // 绘制玻璃反光
    p.noFill();
    p.stroke(255, 255, 255, 100);
    p.strokeWeight(3);
    p.arc(size * 0.2, size * 0.2, size * 0.6, size * 0.6, 0, p.HALF_PI);
    
    // 绘制品牌颜色的折射效果
    p.fill(this.options.colors.emerald, 50);
    p.noStroke();
    p.ellipse(size * 0.3, size * 0.3, size * 0.2);
    p.fill(this.options.colors.amber, 50);
    p.ellipse(size * 0.7, size * 0.7, size * 0.2);
  }

  _applyMicroTexture(p) {
    const size = this.options.size;
    
    // 绘制微质感纹理
    p.noFill();
    p.stroke(0, 0, 0, 10);
    p.strokeWeight(0.5);
    
    for (let i = 0; i < size * 2; i++) {
      const x1 = p.random(size);
      const y1 = p.random(size);
      const x2 = x1 + p.random(-5, 5);
      const y2 = y1 + p.random(-5, 5);
      p.line(x1, y1, x2, y2);
    }
  }

  _applyMaterialState(p) {
    const size = this.options.size;
    
    switch (this.options.materialState) {
      case 'hover':
        // 悬停状态 - 增加亮度
        p.fill(255, 255, 255, 50);
        p.noStroke();
        p.rect(0, 0, size, size);
        break;
      case 'active':
        // 激活状态 - 增加暗度
        p.fill(0, 0, 0, 50);
        p.noStroke();
        p.rect(0, 0, size, size);
        break;
      case 'disabled':
        // 禁用状态 - 灰度效果
        p.filter(p.GRAY);
        p.fill(0, 0, 0, 30);
        p.noStroke();
        p.rect(0, 0, size, size);
        break;
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
