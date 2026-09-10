# Writing Section Images Folder

Place your story covers, editorial snapshots, or article illustrations in this folder (`/public/images/writing/`).

### Recommended Specifications:
- **Formats**: `.webp` (preferred) or `.jpg` / `.png`
- **Aspect Ratio**: 16:9 or 3:2 landscape (e.g., 600 × 338 px or 800 × 450 px)
- **File size**: Under 250 KB each

### Quick Naming Convention:
You can drop images named:
- `story-1.webp` (or `.jpg` / `.png`)
- `story-2.webp`
- `story-3.webp`

### How to link in code:
Open `src/data/portfolioData.ts` and set `coverImage` on the story item in `STORIES`:
```ts
{
  id: 'story-1',
  title: 'Story title one',
  teaser: 'A one or two line teaser of what this story is about...',
  coverImage: '/images/writing/story-1.webp',
  href: '#',
}
```
If no cover image is specified, the story displays as a clean editorial text piece.
