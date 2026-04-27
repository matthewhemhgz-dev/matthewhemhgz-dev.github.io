import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import sharp from 'sharp';

// 博客文章目录
const blogDirs = {
  zh: './src/data/blog/zh',
  en: './src/data/blog/en'
};

// 图片输出目录
const outputDir = './public/images/blog';

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 主题颜色方案 - 基于品牌色彩
const colorSchemes = {
  design: {
    primary: '#4CAF50', // 绿色
    secondary: '#2196F3', // 蓝色
    accent: '#9C27B0', // 紫色
    background: '#f8f9fa',
    text: '#333333'
  },
  technology: {
    primary: '#FF5722', // 橙色
    secondary: '#2196F3', // 蓝色
    accent: '#4CAF50', // 绿色
    background: '#f8f9fa',
    text: '#333333'
  },
  knowledge: {
    primary: '#FFC107', // 黄色
    secondary: '#9C27B0', // 紫色
    accent: '#2196F3', // 蓝色
    background: '#f8f9fa',
    text: '#333333'
  },
  performance: {
    primary: '#4CAF50', // 绿色
    secondary: '#FFC107', // 黄色
    accent: '#FF5722', // 橙色
    background: '#f8f9fa',
    text: '#333333'
  },
  architecture: {
    primary: '#2196F3', // 蓝色
    secondary: '#9C27B0', // 紫色
    accent: '#FF5722', // 橙色
    background: '#f8f9fa',
    text: '#333333'
  },
  practice: {
    primary: '#9C27B0', // 紫色
    secondary: '#4CAF50', // 绿色
    accent: '#FFC107', // 黄色
    background: '#f8f9fa',
    text: '#333333'
  }
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
  'zettelkasten': 'knowledge',
  'how-to-optimize-frontend': 'performance',
  'how-to-build-personal': 'knowledge',
  'knowledge-management': 'knowledge'
};



// 生成主题相关的装饰元素
function generateDecorativeElements(width, height, theme) {
  const scheme = colorSchemes[theme] || colorSchemes.design;
  const elements = [];
  
  switch (theme) {
    case 'design':
      // 设计主题：使用几何形状
      elements.push(`
        <circle cx="${width * 0.1}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.primary}20" />
        <rect x="${width * 0.8}" y="${height * 0.1}" width="${width * 0.15}" height="${width * 0.15}" 
              fill="${scheme.secondary}20" rx="8" />
        <circle cx="${width * 0.2}" cy="${height * 0.9}" r="${width * 0.06}" fill="${scheme.accent}20" />
        <rect x="${width * 0.7}" y="${height * 0.8}" width="${width * 0.12}" height="${width * 0.12}" 
              fill="${scheme.primary}20" rx="8" />
      `);
      break;
    case 'technology':
      // 技术主题：使用科技感元素
      elements.push(`
        <path d="M${width * 0.1},${height * 0.1} L${width * 0.2},${height * 0.2} L${width * 0.1},${height * 0.3} Z" 
              fill="${scheme.primary}20" />
        <path d="M${width * 0.8},${height * 0.1} L${width * 0.9},${height * 0.2} L${width * 0.8},${height * 0.3} Z" 
              fill="${scheme.secondary}20" />
        <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${width * 0.02}" fill="${scheme.accent}40" />
        <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${width * 0.04}" fill="${scheme.accent}20" />
        <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${width * 0.06}" fill="${scheme.accent}10" />
      `);
      break;
    case 'knowledge':
      // 知识主题：使用书籍和灯泡元素
      elements.push(`
        <rect x="${width * 0.1}" y="${height * 0.8}" width="${width * 0.1}" height="${width * 0.15}" 
              fill="${scheme.primary}20" rx="4" />
        <rect x="${width * 0.12}" y="${height * 0.75}" width="${width * 0.06}" height="${width * 0.2}" 
              fill="${scheme.secondary}20" rx="4" />
        <circle cx="${width * 0.8}" cy="${height * 0.2}" r="${width * 0.08}" fill="${scheme.accent}20" />
        <path d="M${width * 0.8},${height * 0.28} L${width * 0.82},${height * 0.35} L${width * 0.78},${height * 0.35} Z" 
              fill="${scheme.accent}20" />
      `);
      break;
    case 'performance':
      // 性能主题：使用速度和图表元素
      elements.push(`
        <path d="M${width * 0.1},${height * 0.9} L${width * 0.3},${height * 0.7} L${width * 0.5},${height * 0.8} L${width * 0.7},${height * 0.6} L${width * 0.9},${height * 0.7}" 
              stroke="${scheme.primary}40" stroke-width="4" fill="none" />
        <circle cx="${width * 0.1}" cy="${height * 0.9}" r="${width * 0.02}" fill="${scheme.primary}40" />
        <circle cx="${width * 0.3}" cy="${height * 0.7}" r="${width * 0.02}" fill="${scheme.primary}40" />
        <circle cx="${width * 0.5}" cy="${height * 0.8}" r="${width * 0.02}" fill="${scheme.primary}40" />
        <circle cx="${width * 0.7}" cy="${height * 0.6}" r="${width * 0.02}" fill="${scheme.primary}40" />
        <circle cx="${width * 0.9}" cy="${height * 0.7}" r="${width * 0.02}" fill="${scheme.primary}40" />
      `);
      break;
    case 'architecture':
      // 架构主题：使用建筑和结构元素
      elements.push(`
        <rect x="${width * 0.1}" y="${height * 0.7}" width="${width * 0.15}" height="${width * 0.2}" 
              fill="${scheme.primary}20" rx="4" />
        <rect x="${width * 0.3}" y="${height * 0.6}" width="${width * 0.15}" height="${width * 0.3}" 
              fill="${scheme.secondary}20" rx="4" />
        <rect x="${width * 0.5}" y="${height * 0.5}" width="${width * 0.15}" height="${width * 0.4}" 
              fill="${scheme.accent}20" rx="4" />
        <rect x="${width * 0.7}" y="${height * 0.6}" width="${width * 0.15}" height="${width * 0.3}" 
              fill="${scheme.primary}20" rx="4" />
        <rect x="${width * 0.9}" y="${height * 0.7}" width="${width * 0.15}" height="${width * 0.2}" 
              fill="${scheme.secondary}20" rx="4" />
      `);
      break;
    case 'practice':
      // 实践主题：使用工具和实践元素
      elements.push(`
        <circle cx="${width * 0.2}" cy="${width * 0.2}" r="${width * 0.08}" fill="${scheme.primary}20" />
        <rect x="${width * 0.15}" y="${width * 0.15}" width="${width * 0.1}" height="${width * 0.1}" 
              fill="${scheme.primary}10" rx="4" />
        <circle cx="${width * 0.8}" cy="${width * 0.2}" r="${width * 0.08}" fill="${scheme.secondary}20" />
        <rect x="${width * 0.75}" y="${width * 0.15}" width="${width * 0.1}" height="${width * 0.1}" 
              fill="${scheme.secondary}10" rx="4" />
        <circle cx="${width * 0.5}" cy="${width * 0.8}" r="${width * 0.08}" fill="${scheme.accent}20" />
        <rect x="${width * 0.45}" y="${width * 0.75}" width="${width * 0.1}" height="${width * 0.1}" 
              fill="${scheme.accent}10" rx="4" />
      `);
      break;
    default:
      // 默认主题：使用通用装饰元素
      elements.push(`
        <circle cx="${width * 0.1}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.primary}20" />
        <circle cx="${width * 0.9}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.secondary}20" />
        <circle cx="${width * 0.1}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.secondary}20" />
        <circle cx="${width * 0.9}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.primary}20" />
      `);
  }
  
  return elements.join('');
}

// 处理标题，确保它在图片中显示良好
function processTitle(title) {
  // 限制标题长度
  const maxLength = 50;
  if (title.length <= maxLength) {
    return title;
  }
  
  // 截断标题并添加省略号
  return title.substring(0, maxLength) + '...';
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
    // 生成一个美观的封面图
    const width = 1200;
    const height = 630;
    const scheme = colorSchemes[theme] || colorSchemes.design;
    
    // 生成主题相关的装饰元素
    const decorativeElements = generateDecorativeElements(width, height, theme);
    
    // 处理标题，确保它在图片中显示良好
    const processedTitle = processTitle(title);
    
    // 生成 SVG
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- 背景 -->
        <rect width="${width}" height="${height}" fill="${scheme.background}" />
        
        <!-- 渐变背景 -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${scheme.primary}10" />
            <stop offset="100%" stop-color="${scheme.secondary}10" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGradient)" />
        
        <!-- 装饰元素 -->
        ${decorativeElements}
        
        <!-- 标题区域 -->
        <rect x="${width * 0.05}" y="${height * 0.3}" width="${width * 0.9}" height="${height * 0.4}" 
              fill="${scheme.background}E6" rx="12" />
        
        <!-- 标题文本 -->
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" 
              font-family="'Arial', 'Helvetica', sans-serif" font-size="40" font-weight="bold" fill="${scheme.text}">
          ${processedTitle}
        </text>
        
        <!-- 品牌标识 -->
        <rect x="${width * 0.05}" y="${height * 0.85}" width="120" height="40" 
              fill="${scheme.primary}" rx="8" />
        <text x="${width * 0.05 + 60}" y="${height * 0.85 + 25}" text-anchor="middle" dominant-baseline="middle" 
              font-family="'Arial', 'Helvetica', sans-serif" font-size="18" font-weight="bold" fill="white">
          祈研所
        </text>
      </svg>
    `;
    
    // 将 SVG 转换为 PNG
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
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
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="630" fill="#f8f9fa" />
          <rect x="60" y="189" width="1080" height="252" fill="#ffffffE6" rx="12" />
          <text x="600" y="315" text-anchor="middle" dominant-baseline="middle" 
                font-family="'Arial', 'Helvetica', sans-serif" font-size="40" font-weight="bold" fill="#333333">
            ${title}
          </text>
          <rect x="60" y="535.5" width="120" height="40" fill="#4CAF50" rx="8" />
          <text x="120" y="555.5" text-anchor="middle" dominant-baseline="middle" 
                font-family="'Arial', 'Helvetica', sans-serif" font-size="18" font-weight="bold" fill="white">
            祈研所
          </text>
        </svg>
      `;
      await sharp(Buffer.from(defaultSvg))
        .png()
        .toFile(outputPath);
      console.log(`✓ Created default image for ${slug}`);
    }
  }
}

// 处理所有博客文章
async function processBlogPosts() {
  console.log('Generating blog cover images...');
  
  for (const [lang, dir] of Object.entries(blogDirs)) {
    console.log(`\nProcessing ${lang} blog posts...`);
    
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 提取标题和 slug
      const titleMatch = content.match(/^title:\s*["'](.*?)["']/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled';
      
      const slug = path.basename(file, '.md');
      
      // 提取 heroImage 字段
      const heroImageMatch = content.match(/^heroImage:\s*["'](.*?)["']/m);
      let imageName = slug;
      
      if (heroImageMatch) {
        // 从 heroImage 字段中提取文件名
        const heroImagePath = heroImageMatch[1];
        const heroImageFileName = path.basename(heroImagePath, '.png');
        imageName = heroImageFileName;
      }
      
      // 确定主题
      let theme = 'design';
      for (const [key, value] of Object.entries(articleThemes)) {
        if (slug.includes(key)) {
          theme = value;
          break;
        }
      }
      
      // 生成封面图
      await generateCoverImage(title, imageName, theme);
    }
  }
  
  console.log('\nImage generation completed!');
}

// 生成默认封面图片
async function generateDefaultCover() {
  const defaultImagePath = path.join(outputDir, 'default-cover.png');
  
  try {
    const width = 1200;
    const height = 630;
    const scheme = colorSchemes.design;
    
    const defaultSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- 背景 -->
        <rect width="${width}" height="${height}" fill="${scheme.background}" />
        
        <!-- 渐变背景 -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${scheme.primary}10" />
            <stop offset="100%" stop-color="${scheme.secondary}10" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGradient)" />
        
        <!-- 装饰元素 -->
        <circle cx="${width * 0.1}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.primary}20" />
        <circle cx="${width * 0.9}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.secondary}20" />
        <circle cx="${width * 0.1}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.secondary}20" />
        <circle cx="${width * 0.9}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.primary}20" />
        
        <!-- 标题区域 -->
        <rect x="${width * 0.05}" y="${height * 0.3}" width="${width * 0.9}" height="${height * 0.4}" 
              fill="${scheme.background}E6" rx="12" />
        
        <!-- 标题文本 -->
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" 
              font-family="'Arial', 'Helvetica', sans-serif" font-size="40" font-weight="bold" fill="${scheme.text}">
          祈研所
        </text>
        <text x="${width / 2}" y="${height / 2 + 40}" text-anchor="middle" dominant-baseline="middle" 
              font-family="'Arial', 'Helvetica', sans-serif" font-size="24" fill="${scheme.text}">
          Qi-Lab
        </text>
        
        <!-- 品牌标识 -->
        <rect x="${width * 0.05}" y="${height * 0.85}" width="120" height="40" 
              fill="${scheme.primary}" rx="8" />
        <text x="${width * 0.05 + 60}" y="${height * 0.85 + 25}" text-anchor="middle" dominant-baseline="middle" 
              font-family="'Arial', 'Helvetica', sans-serif" font-size="18" font-weight="bold" fill="white">
          祈研所
        </text>
      </svg>
    `;
    
    await sharp(Buffer.from(defaultSvg))
      .png()
      .toFile(defaultImagePath);
    
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