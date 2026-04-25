import p5 from 'https://cdn.skypack.dev/p5@1.9.0';

class DocumentCover {
  constructor(canvasId, options = {}) {
    this.canvasId = canvasId;
    this.options = {
      title: 'Document Title',
      subtitle: 'Subtitle',
      author: 'Qi-Lab',
      date: new Date().toLocaleDateString('zh-CN'),
      size: { width: 800, height: 1000 },
      colors: {
        emerald: '#4ade80',
        amber: '#fbbf24',
        mint: '#a7f3d0',
        background: '#ffffff',
        text: '#000000',
      },
      style: 'modern', // modern, minimal, artistic
      ...options,
    };

    this.p5Instance = null;
  }

  init() {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(this.options.size.width, this.options.size.height);
        canvas.parent(this.canvasId);
        p.noLoop();
        this._drawCover(p);
      };
    };

    this.p5Instance = new p5(sketch);
  }

  _drawCover(p) {
    const { width, height } = this.options.size;

    // 绘制背景
    this._drawBackground(p, width, height);

    // 绘制标题
    this._drawTitle(p, width, height);

    // 绘制副标题
    if (this.options.subtitle) {
      this._drawSubtitle(p, width, height);
    }

    // 绘制作者和日期
    this._drawFooter(p, width, height);
  }

  _drawBackground(p, width, height) {
    p.background(this.options.colors.background);

    switch (this.options.style) {
      case 'artistic':
        this._drawArtisticBackground(p, width, height);
        break;
      case 'minimal':
        this._drawMinimalBackground(p, width, height);
        break;
      case 'modern':
      default:
        this._drawModernBackground(p, width, height);
        break;
    }
  }

  _drawModernBackground(p, width, height) {
    // 绘制渐变背景
    for (let y = 0; y < height; y++) {
      const gradient = p.map(y, 0, height, 0, 1);
      const color1 = p.color(this.options.colors.mint);
      const color2 = p.color(this.options.colors.emerald);
      const color = p.lerpColor(color1, color2, gradient);
      p.stroke(color);
      p.line(0, y, width, y);
    }

    // 绘制几何形状
    p.noFill();
    p.stroke(this.options.colors.amber);
    p.strokeWeight(5);

    // 绘制圆形
    p.ellipse(width * 0.2, height * 0.2, width * 0.3);
    p.ellipse(width * 0.8, height * 0.8, width * 0.4);

    // 绘制矩形
    p.rectMode(p.CENTER);
    p.rect(width * 0.7, height * 0.3, width * 0.2, width * 0.2);
    p.rect(width * 0.3, height * 0.7, width * 0.25, width * 0.25);
  }

  _drawMinimalBackground(p, width, height) {
    p.background(this.options.colors.background);

    // 绘制简单的线条
    p.stroke(this.options.colors.emerald);
    p.strokeWeight(2);

    // 水平线
    p.line(0, height * 0.2, width, height * 0.2);
    p.line(0, height * 0.8, width, height * 0.8);

    // 垂直线
    p.line(width * 0.2, 0, width * 0.2, height);
    p.line(width * 0.8, 0, width * 0.8, height);
  }

  _drawArtisticBackground(p, width, height) {
    // 绘制抽象背景
    for (let i = 0; i < 20; i++) {
      p.noFill();
      p.stroke(p.color(this.options.colors.emerald, p.random(50, 150)));
      p.strokeWeight(p.random(1, 5));

      p.beginShape();
      for (let j = 0; j < 10; j++) {
        const x = p.random(width);
        const y = p.random(height);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }

    // 绘制品牌色彩的圆点
    const colors = [
      this.options.colors.emerald,
      this.options.colors.amber,
      this.options.colors.mint,
    ];

    for (let i = 0; i < 50; i++) {
      p.fill(colors[p.floor(p.random(colors.length))]);
      p.noStroke();
      p.ellipse(p.random(width), p.random(height), p.random(5, 20));
    }
  }

  _drawTitle(p, width, height) {
    p.fill(this.options.colors.text);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.font('Noto Serif SC', 'bold');
    p.text(this.options.title, width / 2, height / 2 - 50);
  }

  _drawSubtitle(p, width, height) {
    p.fill(this.options.colors.text);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.font('Noto Serif SC', 'regular');
    p.text(this.options.subtitle, width / 2, height / 2 + 20);
  }

  _drawFooter(p, width, height) {
    p.fill(this.options.colors.text);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.font('Noto Serif SC', 'regular');

    p.text(`${this.options.author} · ${this.options.date}`, width / 2, height - 50);
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
    if (this.p5Instance) {
      this._drawCover(this.p5Instance);
    }
  }

  destroy() {
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }
  }
}

export { DocumentCover };
