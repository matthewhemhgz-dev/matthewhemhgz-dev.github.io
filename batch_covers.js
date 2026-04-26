import fs from 'fs';
import path from 'path';

function extractField(content, fieldName) {
    const regex = new RegExp(`^${fieldName}:\\s*(.*)$`, 'm');
    const match = content.match(regex);
    if (!match) return null;
    let val = match[1].trim();
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
        val = val.slice(1, -1);
    }
    return val;
}

function updateFrontmatter(filePath, newImagePath) {
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    if (/^image:\s*.*$/m.test(fileContent)) {
        // replace existing
        fileContent = fileContent.replace(/^image:\s*.*$/m, `image: ${newImagePath}`);
    } else {
        // try to insert after category
        fileContent = fileContent.replace(/(^category:\s*.*$)/m, `$1\nimage: ${newImagePath}`);
    }

    fs.writeFileSync(filePath, fileContent);
}

// Ensure the directory exists
const blogImagesDir = path.join(process.cwd(), 'public/images/blog');

// Clean old files except default
if (fs.existsSync(blogImagesDir)) {
    const whitelist = ['default-cover.png'];
    fs.readdirSync(blogImagesDir).forEach(file => {
        if (!whitelist.includes(file)) {
            try { fs.unlinkSync(path.join(blogImagesDir, file)); } catch (e) { }
        }
    });
}

function generateSVG(title, category, lang) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash % 360);

    const isEn = lang === 'en';

    const bgColor = "#1e1b18";
    const gridColor = "rgba(255,255,255,0.05)";
    const accent1 = `hsl(${hue}, 70%, 60%)`;
    const accent2 = `hsl(${(hue + 45) % 360}, 60%, 50%)`;

    const formattedTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let titleChunks = [formattedTitle];
    if (formattedTitle.length > 22 && !isEn) {
        const mid = Math.floor(formattedTitle.length / 2);
        titleChunks = [formattedTitle.substring(0, mid), formattedTitle.substring(mid)];
    } else if (formattedTitle.length > 35 && isEn) {
        const words = formattedTitle.split(' ');
        const mid = Math.floor(words.length / 2);
        titleChunks = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }

    const titleY1 = titleChunks.length === 1 ? 320 : 300;
    const titleY2 = titleChunks.length === 1 ? -100 : 360;

    return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" style="background:${bgColor};">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&amp;family=Noto+Serif+SC:wght@700&amp;display=swap');
    .title { font-family: ${isEn ? "'Space Grotesk', sans-serif" : "'Noto Serif SC', serif"}; font-size: ${isEn ? "64px" : "68px"}; font-weight: bold; fill: #ffffff; letter-spacing: 0.05em; }
    .category { font-family: 'Space Grotesk', monospace; font-size: 28px; fill: ${accent1}; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em; }
    .brand { font-family: 'Space Grotesk', sans-serif; font-size: 22px; fill: #a5a5a5; opacity: 0.6; }
  </style>

  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}" />
      <stop offset="100%" stop-color="#0a0a0a" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent1}" stop-opacity="0.2" />
      <stop offset="100%" stop-color="${accent2}" stop-opacity="0.0" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${gridColor}" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#grad)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  
  <path d="M-200 630 Q 300 100 1400 300" fill="none" stroke="url(#accent)" stroke-width="60" style="filter: blur(8px);" />
  <path d="M0 630 Q 600 300 1400 630" fill="none" stroke="${accent2}" stroke-width="20" stroke-opacity="0.3" />

  <circle cx="850" cy="200" r="150" fill="${accent1}" opacity="0.1" filter="blur(40px)" />
  <circle cx="950" cy="250" r="4" fill="${accent1}" />
  <circle cx="1000" cy="180" r="2" fill="#fff" opacity="0.5" />
  <path d="M 950 250 L 1000 180" stroke="${accent1}" stroke-width="1" stroke-dasharray="4" opacity="0.4" />

  <g transform="translate(100, 0)">
    <text x="0" y="240" class="category">// ${category}</text>
    <text x="0" y="${titleY1}" class="title">${titleChunks[0]}</text>
    ${titleChunks.length > 1 ? `<text x="0" y="${titleY2}" class="title">${titleChunks[1]}</text>` : ''}
  </g>
  
  <text x="100" y="550" class="brand">QI-LAB | SYSTEMIZED ENGINEERING AESTHETICS</text>
  <text x="1000" y="550" class="brand" style="opacity: 0.3;">${isEn ? 'EN' : 'ZH'}</text>
</svg>`;
}

const contentDir = path.join(process.cwd(), 'src/data/blog');
const files = [];

function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.md')) {
            files.push(fullPath);
        }
    }
}

walk(contentDir);

let processed = 0;
for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const title = extractField(content, 'title');
    if (title) {
        const isEn = filePath.includes('\\en\\') || filePath.includes('/en/');
        const lang = isEn ? 'en' : 'zh';
        const category = extractField(content, 'category') || 'NOTE';

        const basename = path.basename(filePath, '.md');
        const svgFilename = `${basename}-${lang}.svg`;

        const svgData = generateSVG(title, category, lang);
        const destPath = path.join(blogImagesDir, svgFilename);
        fs.writeFileSync(destPath, svgData);

        updateFrontmatter(filePath, `/images/blog/${svgFilename}`);
        processed++;
    }
}

console.log(`Successfully generated ${processed} unique SVG covers!`);
