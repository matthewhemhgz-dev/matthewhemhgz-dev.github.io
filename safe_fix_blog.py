import os
import re

dir_path = r'd:\Project\GithubPage_PerBrand\src\data\blog'
mapping = {
    'ai-era-knowledge-worker': 'ai-era-knowledge-worker.png',
    'design-tokens-best-practices': 'design-tokens-best-practices.png',
    'zettelkasten-practical-guide': 'zettelkasten-practical-guide.png',
    'astro-ssg-why-i-chose': 'astro-ssg-why-i-chose.png',
    'css-architecture-scalable-projects': 'css-architecture-scalable-projects.png',
    'design-system-from-scratch': 'design-system-from-scratch.png',
    'personal-knowledge-graph': 'personal-knowledge-graph.png',
    'knowledge-management-system-foundation': 'knowledge-management-foundation.png'
}

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.md'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find the slug from filename
                slug = os.path.splitext(file)[0]
                new_img = mapping.get(slug, 'ai-era-knowledge-worker.png') # Fallback to generic KM cover

                # Update frontmatter fields
                # image: ...
                content = re.sub(r'image:\s*"?/images/blog/[\w.-]+"?', f'image: /images/blog/{new_img}', content)
                # heroImage: ...
                content = re.sub(r"heroImage:\s*'/images/blog/([\w.-]+)'", f"heroImage: '/images/blog/{new_img}'", content)
                
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file}")
            except Exception as e:
                print(f"Error processing {file}: {e}")

print("Done.")
