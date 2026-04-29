import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import sharp from 'sharp';

// 博客文章目录
const blogDirs = {
  zh: './src/data/blog/zh',
  en: './src/data/blog/en',
};

// 图片输出目录
const outputDir = './public/images/blog';

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 主题颜色方案
const colorSchemes = {
  design: ['#4CAF50', '#2196F3', '#9C27B0'],
  technology: ['#FF5722', '#2196F3', '#4CAF50'],
  knowledge: ['#FFC107', '#9C27B0', '#2196F3'],
  performance: ['#4CAF50', '#FFC107', '#FF5722'],
  architecture: ['#2196F3', '#9C27B0', '#FF5722'],
  practice: ['#9C27B0', '#4CAF50', '#FFC107'],
};

// 文章主题映射
const articleThemes = {
  'design-system': 'design',
  'design-tokens': 'design',
  'css-architecture': 'design',
  'astro-ssg': 'technology',
  'frontend-architecture': 'architecture',
  'frontend-performance': 'performance',
  'ssg-best-practices': 'technology',
  'progressive-refactor': 'practice',
  'ai-era': 'technology',
  'knowledge-graph': 'knowledge',
  'notion-obsidian': 'knowledge',
  'personal-knowledge': 'knowledge',
  zettelkasten: 'knowledge',
};

// 生成随机颜色
function getRandomColor(theme) {
  const scheme = colorSchemes[theme] || colorSchemes.design;
  return scheme[Math.floor(Math.random() * scheme.length)];
}

// 生成封面图
async function generateCoverImage(title, slug, theme) {
  const outputPath = path.join(outputDir, `${slug}.png`);

  // 检查文件是否已存在
  if (fs.existsSync(outputPath)) {
    console.log(`✓ Image already exists: ${slug}.png`);
    return;
  }

  try {
    // 生成一个简单的封面图
    const width = 640;
    const height = 640;

    // 生成随机形状和颜色
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- 背景 -->
        <rect width="${width}" height="${height}" fill="#f8f9fa" />
        
        <!-- 装饰元素 -->
        <circle cx="${width * 0.2}" cy="${height * 0.2}" r="${width * 0.1}" fill="${getRandomColor(theme)}80" />
        <circle cx="${width * 0.8}" cy="${height * 0.3}" r="${width * 0.15}" fill="${getRandomColor(theme)}60" />
        <circle cx="${width * 0.3}" cy="${height * 0.8}" r="${width * 0.12}" fill="${getRandomColor(theme)}70" />
        <circle cx="${width * 0.7}" cy="${height * 0.7}" r="${width * 0.08}" fill="${getRandomColor(theme)}90" />
        
        <!-- 网格线 -->
        <g stroke="${getRandomColor(theme)}20" stroke-width="1">
          ${Array.from({ length: 10 })
            .map((_, i) => {
              const y = ((i + 1) * height) / 11;
              return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" />`;
            })
            .join('')}
          ${Array.from({ length: 10 })
            .map((_, i) => {
              const x = ((i + 1) * width) / 11;
              return `<line x1="${x}" y1="0" x2="${x}" y2="${height}" />`;
            })
            .join('')}
        </g>
      </svg>
    `;

    // 将 SVG 转换为 PNG
    await sharp(Buffer.from(svg)).png().toFile(outputPath);

    console.log(`✓ Generated image: ${slug}.png`);
  } catch (error) {
    console.error(`✗ Error generating image for ${slug}:`, error);
    // 如果生成失败，使用默认图片
    const defaultImagePath = path.join(outputDir, 'default-cover.png');
    if (fs.existsSync(defaultImagePath)) {
      fs.copyFileSync(defaultImagePath, outputPath);
      console.log(`✓ Using default image for ${slug}`);
    } else {
      // 如果默认图片也不存在，创建一个简单的默认图片
      const defaultSvg = `
        <svg width="640" height="640" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="640" fill="#f8f9fa" />
          <circle cx="320" cy="320" r="100" fill="#4CAF5080" />
          <text x="320" y="320" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="24" fill="#333">${title}</text>
        </svg>
      `;
      await sharp(Buffer.from(defaultSvg)).png().toFile(outputPath);
      console.log(`✓ Created default image for ${slug}`);
    }
  }
}

// 处理所有博客文章
async function processBlogPosts() {
  console.log('Generating blog cover images...');

  for (const [lang, dir] of Object.entries(blogDirs)) {
    console.log(`\nProcessing ${lang} blog posts...`);

    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // 提取标题和 slug
      const titleMatch = content.match(/^title:\s*["'](.*?)["']/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled';

      const slug = path.basename(file, '.md');

      // 确定主题
      let theme = 'design';
      for (const [key, value] of Object.entries(articleThemes)) {
        if (slug.includes(key)) {
          theme = value;
          break;
        }
      }

      // 生成封面图
      await generateCoverImage(title, slug, theme);
    }
  }

  console.log('\nImage generation completed!');
}

// 生成默认封面图片
async function generateDefaultCover() {
  const defaultImagePath = path.join(outputDir, 'default-cover.png');

  try {
    const width = 640;
    const height = 640;

    const defaultSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- 背景 -->
        <rect width="${width}" height="${height}" fill="#f8f9fa" />
        
        <!-- 装饰元素 -->
        <circle cx="${width * 0.2}" cy="${height * 0.2}" r="${width * 0.1}" fill="#4CAF5080" />
        <circle cx="${width * 0.8}" cy="${height * 0.3}" r="${width * 0.15}" fill="#2196F360" />
        <circle cx="${width * 0.3}" cy="${height * 0.8}" r="${width * 0.12}" fill="#9C27B070" />
        <circle cx="${width * 0.7}" cy="${height * 0.7}" r="${width * 0.08}" fill="#FF572290" />
        
        <!-- 网格线 -->
        <g stroke="#33333320" stroke-width="1">
          ${Array.from({ length: 10 })
            .map((_, i) => {
              const y = ((i + 1) * height) / 11;
              return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" />`;
            })
            .join('')}
          ${Array.from({ length: 10 })
            .map((_, i) => {
              const x = ((i + 1) * width) / 11;
              return `<line x1="${x}" y1="0" x2="${x}" y2="${height}" />`;
            })
            .join('')}
        </g>
        
        <!-- 文字 -->
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="24" fill="#333">祈研所</text>
        <text x="${width / 2}" y="${height / 2 + 30}" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="16" fill="#666">Qi-Lab</text>
      </svg>
    `;

    await sharp(Buffer.from(defaultSvg)).png().toFile(defaultImagePath);

    console.log(`✓ Generated default cover image`);
  } catch (error) {
    console.error(`✗ Error generating default cover image:`, error);
  }
}

// 运行脚本
async function run() {
  // 先生成默认封面图片
  await generateDefaultCover();
  // 然后处理博客文章
  await processBlogPosts();
}

run();
