import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import sharp from 'sharp';

const blogDirs = {
  zh: './src/data/blog/zh',
  en: './src/data/blog/en'
};

const outputDir = './public/images/blog';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const colorSchemes = {
  design: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    accent: '#9C27B0',
    background: '#f8f9fa',
    text: '#333333'
  },
  technology: {
    primary: '#FF5722',
    secondary: '#2196F3',
    accent: '#4CAF50',
    background: '#f8f9fa',
    text: '#333333'
  },
  knowledge: {
    primary: '#FFC107',
    secondary: '#9C27B0',
    accent: '#2196F3',
    background: '#f8f9fa',
    text: '#333333'
  },
  performance: {
    primary: '#4CAF50',
    secondary: '#FFC107',
    accent: '#FF5722',
    background: '#f8f9fa',
    text: '#333333'
  },
  architecture: {
    primary: '#2196F3',
    secondary: '#9C27B0',
    accent: '#FF5722',
    background: '#f8f9fa',
    text: '#333333'
  },
  practice: {
    primary: '#9C27B0',
    secondary: '#4CAF50',
    accent: '#FFC107',
    background: '#f8f9fa',
    text: '#333333'
  }
};

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

function generateDecorativeElements(width, height, theme) {
  const scheme = colorSchemes[theme] || colorSchemes.design;
  const elements = [];
  
  switch (theme) {
    case 'design':
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
      elements.push(`
        <circle cx="${width * 0.1}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.primary}20" />
        <circle cx="${width * 0.9}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.secondary}20" />
        <circle cx="${width * 0.1}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.secondary}20" />
        <circle cx="${width * 0.9}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.primary}20" />
      `);
  }
  
  return elements.join('');
}

function processTitle(title) {
  const maxLength = 50;
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength) + '...';
}

async function generateCoverImage(title, slug, theme) {
  const width = 1200;
  const height = 630;
  const scheme = colorSchemes[theme] || colorSchemes.design;
  const processedTitle = processTitle(title);
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${scheme.background}" />
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${scheme.primary}10" />
          <stop offset="100%" stop-color="${scheme.secondary}10" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGradient)" />
      ${generateDecorativeElements(width, height, theme)}
      <rect x="${width * 0.05}" y="${height * 0.3}" width="${width * 0.9}" height="${height * 0.4}" 
            fill="${scheme.background}E6" rx="12" />
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" 
            font-family="'Arial', 'Helvetica', sans-serif" font-size="40" font-weight="bold" fill="${scheme.text}">
        ${processedTitle}
      </text>
      <rect x="${width * 0.05}" y="${height * 0.85}" width="120" height="40" 
            fill="${scheme.primary}" rx="8" />
      <text x="${width * 0.05 + 60}" y="${height * 0.85 + 25}" text-anchor="middle" dominant-baseline="middle" 
            font-family="'Arial', 'Helvetica', sans-serif" font-size="18" font-weight="bold" fill="white">
        祈研所
      </text>
    </svg>
  `;
  
  const svgBuffer = Buffer.from(svg);
  
  await Promise.all([
    sharp(svgBuffer)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${slug}.webp`)),
    sharp(svgBuffer)
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, `${slug}.avif`)),
    sharp(svgBuffer)
      .png()
      .toFile(path.join(outputDir, `${slug}.png`))
  ]);
  
  console.log(`✓ Generated images: ${slug}.webp, ${slug}.avif, ${slug}.png`);
}

async function processBlogPosts() {
  console.log('Generating blog cover images in multiple formats...');
  
  for (const [lang, dir] of Object.entries(blogDirs)) {
    console.log(`\nProcessing ${lang} blog posts...`);
    
    if (!fs.existsSync(dir)) {
      console.log(`  Directory ${dir} does not exist, skipping...`);
      continue;
    }
    
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const titleMatch = content.match(/^title:\s*["'](.*?)["']/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled';
      
      const slug = path.basename(file, '.md');
      
      const heroImageMatch = content.match(/^heroImage:\s*["'](.*?)["']/m);
      let imageName = slug;
      
      if (heroImageMatch) {
        const heroImagePath = heroImageMatch[1];
        const heroImageFileName = path.basename(heroImagePath, '.png');
        imageName = heroImageFileName;
      }
      
      let theme = 'design';
      for (const [key, value] of Object.entries(articleThemes)) {
        if (slug.includes(key)) {
          theme = value;
          break;
        }
      }
      
      await generateCoverImage(title, imageName, theme);
    }
  }
  
  console.log('\nImage generation completed!');
}

async function generateDefaultCover() {
  const width = 1200;
  const height = 630;
  const scheme = colorSchemes.design;
  
  const defaultSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${scheme.background}" />
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${scheme.primary}10" />
          <stop offset="100%" stop-color="${scheme.secondary}10" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGradient)" />
      <circle cx="${width * 0.1}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.primary}20" />
      <circle cx="${width * 0.9}" cy="${height * 0.1}" r="${width * 0.08}" fill="${scheme.secondary}20" />
      <circle cx="${width * 0.1}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.secondary}20" />
      <circle cx="${width * 0.9}" cy="${height * 0.9}" r="${width * 0.08}" fill="${scheme.primary}20" />
      <rect x="${width * 0.05}" y="${height * 0.3}" width="${width * 0.9}" height="${height * 0.4}" 
            fill="${scheme.background}E6" rx="12" />
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" 
            font-family="'Arial', 'Helvetica', sans-serif" font-size="40" font-weight="bold" fill="${scheme.text}">
        祈研所
      </text>
      <text x="${width / 2}" y="${height / 2 + 40}" text-anchor="middle" dominant-baseline="middle" 
            font-family="'Arial', 'Helvetica', sans-serif" font-size="24" fill="${scheme.text}">
        Qi-Lab
      </text>
      <rect x="${width * 0.05}" y="${height * 0.85}" width="120" height="40" 
            fill="${scheme.primary}" rx="8" />
      <text x="${width * 0.05 + 60}" y="${height * 0.85 + 25}" text-anchor="middle" dominant-baseline="middle" 
            font-family="'Arial', 'Helvetica', sans-serif" font-size="18" font-weight="bold" fill="white">
        祈研所
      </text>
    </svg>
  `;
  
  const svgBuffer = Buffer.from(defaultSvg);
  
  await Promise.all([
    sharp(svgBuffer)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'default-cover.webp')),
    sharp(svgBuffer)
      .avif({ quality: 80 })
      .toFile(path.join(outputDir, 'default-cover.avif')),
    sharp(svgBuffer)
      .png()
      .toFile(path.join(outputDir, 'default-cover.png'))
  ]);
  
  console.log(`✓ Generated default cover images`);
}

async function optimizeExistingImages() {
  console.log('\nOptimizing existing images...');
  
  const imageDirs = ['./public', './dist'];
  
  for (const dir of imageDirs) {
    if (!fs.existsSync(dir)) continue;
    
    const pngFiles = fs.readdirSync(dir, { recursive: true })
      .filter(file => file.endsWith('.png') && !file.includes('/favicon-'));
    
    for (const file of pngFiles) {
      const filePath = path.join(dir, file);
      const baseName = path.basename(file, '.png');
      const outputDirPath = path.dirname(filePath);
      
      try {
        const webpPath = path.join(outputDirPath, `${baseName}.webp`);
        const avifPath = path.join(outputDirPath, `${baseName}.avif`);
        
        if (!fs.existsSync(webpPath)) {
          await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          console.log(`✓ Generated WebP: ${webpPath}`);
        }
        
        if (!fs.existsSync(avifPath)) {
          await sharp(filePath)
            .avif({ quality: 80 })
            .toFile(avifPath);
          console.log(`✓ Generated AVIF: ${avifPath}`);
        }
      } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error);
      }
    }
  }
  
  console.log('\nImage optimization completed!');
}

async function run() {
  await generateDefaultCover();
  await processBlogPosts();
  await optimizeExistingImages();
}

run();
