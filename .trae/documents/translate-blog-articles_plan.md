
# Translation Plan: 4 Chinese Blog Articles to English

## Objective
Translate 4 remaining Chinese blog articles from `src/data/blog/zh/` to English in `src/data/blog/en/`, maintaining the same frontmatter, Mermaid diagrams, code examples, and internal links. Verify the build still works correctly after translation.

## Files to Translate
1. `design-tokens-system-guide.md`
2. `notion-obsidian-dual-track.md`
3. `personal-knowledge-graph.md`
4. `progressive-refactor-astro-tailwind.md`

## Translation Guidelines
1. **Frontmatter**: Update title, description, tags, category to English, set `lang: en`, keep other fields (pubDate, heroImage, author, draft) the same.
2. **Mermaid Diagrams**: Keep the diagram code exactly the same, only translate any text within the diagrams if necessary.
3. **Code Examples**: Keep all code blocks exactly the same.
4. **Internal Links**: Update internal links to point to the English version of the articles if applicable (e.g., `/blog/design-tokens-system-guide` instead of the Chinese path).
5. **Professional Tone**: Maintain a professional and technically accurate translation.
6. **Description Length**: Ensure the description stays under 160 characters to pass validation.
7. **Reference Style**: Use the already translated `css-architecture-scalable-projects.md` as a reference for translation style.

## Steps
1. Translate `design-tokens-system-guide.md` and save to `src/data/blog/en/`.
2. Translate `notion-obsidian-dual-track.md` and save to `src/data/blog/en/`.
3. Translate `personal-knowledge-graph.md` and save to `src/data/blog/en/`.
4. Translate `progressive-refactor-astro-tailwind.md` and save to `src/data/blog/en/`.
5. Run `npm run build` to verify the build still works correctly.

## Verification
- After each translation, check that the frontmatter is correctly formatted.
- After all translations are complete, run the build command to ensure there are no errors.
