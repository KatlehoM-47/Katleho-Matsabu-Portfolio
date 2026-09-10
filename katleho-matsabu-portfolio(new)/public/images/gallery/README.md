# Gallery Images Folder

Place your gallery photography or aesthetic imagery in this folder (`/public/images/gallery/`).

### Recommended Specifications:
- **Formats**: `.webp` (preferred) or `.jpg` / `.png`
- **Resolution**: 800 × 1200 px (tall tiles) or 800 × 600 px (compact tiles)
- **File size**: Under 350 KB each for fast loading
- **Color profile**: sRGB

### Quick Naming Convention:
You can drop images named:
- `photo-1.webp` (or `.jpg`)
- `photo-2.webp`
- `photo-3.webp`
- `photo-4.webp`

### How to link in code:
Open `src/data/portfolioData.ts` and set `imageUrl` on the corresponding tile in `INITIAL_GALLERY_TILES`:
```ts
{
  id: 'gal-1',
  title: '01',
  subtitle: 'Golden Hour Study',
  imageUrl: '/images/gallery/photo-1.webp',
  ...
}
```
If the image file is missing, the tile will automatically display its warm CSS gradient fallback.
