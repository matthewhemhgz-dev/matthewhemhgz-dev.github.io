import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 源文件路径
const logoPath = './public/images/logo.png';

// 输出目录
const outputDir = './public';

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成不同尺寸的 favicon
async function generateFavicon() {
  try {
    console.log('Generating favicon from logo.png...');
    
    // 读取源文件
    const logo = sharp(logoPath);
    
    // 生成 favicon.ico (包含多种尺寸)
    // 注意：sharp 不直接支持生成 .ico 文件，需要使用其他方法
    // 这里我们生成 16x16 和 32x32 的 PNG，然后使用其他工具转换
    // 或者直接使用 32x32 的 PNG 作为 favicon
    
    // 生成 16x16 favicon
    await logo
      .resize(16, 16)
      .png()
      .toFile(path.join(outputDir, 'favicon-16x16.png'));
    console.log('✓ Generated favicon-16x16.png');
    
    // 生成 32x32 favicon
    await logo
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');
    
    // 生成 48x48 favicon
    await logo
      .resize(48, 48)
      .png()
      .toFile(path.join(outputDir, 'favicon-48x48.png'));
    console.log('✓ Generated favicon-48x48.png');
    
    // 生成 64x64 favicon
    await logo
      .resize(64, 64)
      .png()
      .toFile(path.join(outputDir, 'favicon-64x64.png'));
    console.log('✓ Generated favicon-64x64.png');
    
    // 生成 128x128 favicon
    await logo
      .resize(128, 128)
      .png()
      .toFile(path.join(outputDir, 'favicon-128x128.png'));
    console.log('✓ Generated favicon-128x128.png');
    
    // 生成 256x256 favicon
    await logo
      .resize(256, 256)
      .png()
      .toFile(path.join(outputDir, 'favicon-256x256.png'));
    console.log('✓ Generated favicon-256x256.png');
    
    // 生成 512x512 favicon
    await logo
      .resize(512, 512)
      .png()
      .toFile(path.join(outputDir, 'favicon-512x512.png'));
    console.log('✓ Generated favicon-512x512.png');
    
    // 复制 logo.png 作为 favicon.png
    fs.copyFileSync(logoPath, path.join(outputDir, 'favicon.png'));
    console.log('✓ Copied logo.png as favicon.png');
    
    console.log('\nFavicon generation completed!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

// 运行脚本
generateFavicon();