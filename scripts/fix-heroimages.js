import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blogDir = path.join(__dirname, '../src/data/blog');

// 修复heroImage引用
function fixHeroImageReferences() {
  // 遍历中英文目录
  const langDirs = ['zh', 'en'];
  
  langDirs.forEach(lang => {
    const langPath = path.join(blogDir, lang);
    
    // 读取目录下的所有md文件
    const files = fs.readdirSync(langPath).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(langPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 提取文件名（不含扩展名）
      const fileName = path.basename(file, '.md');
      
      // 生成正确的heroImage路径
      const correctHeroImage = `/images/blog/${fileName}.svg`;
      
      // 替换heroImage行
      const updatedContent = content.replace(/heroImage: '.*'/g, `heroImage: '${correctHeroImage}'`);
      
      // 写入更新后的内容
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Fixed heroImage in ${lang}/${file}`);
    });
  });
  
  console.log('All heroImage references fixed!');
}

// 执行修复
fixHeroImageReferences();