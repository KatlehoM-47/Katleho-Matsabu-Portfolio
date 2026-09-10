# Art Pieces Images Folder

Place your art scans, sketches, drawings, and 3D renders in this folder (`/public/images/pieces/`).

### Recommended Specifications:
- **Formats**: `.webp` (preferred) or `.png` / `.jpg`
- **Aspect Ratio**: 1:1 square (e.g., 800 × 800 px) or 4:5 subtle portrait
- **File size**: Under 300 KB each
- **Style Tip**:
  - For pencil/ink sketches: high-resolution scans showing natural paper grain.
  - For 3D renders: transparent PNGs or rendered on background matched to `#E8E6DF`.

### Quick Naming Convention:
You can drop images named:
- `piece-1.webp` (or `.jpg` / `.png`)
- `piece-2.webp`
- `piece-3.webp`
- `piece-4.webp`

### How to link in code:
Open `src/data/portfolioData.ts` and set `imageUrl` on the corresponding item in `INITIAL_PIECES_TILES`:
```ts
{
  id: 'piece-1',
  title: 'Sketch 01',
  type: 'Pencil on Cotton Paper',
  imageUrl: '/images/pieces/piece-1.webp',
  ...
}
```
If no image is specified or yet added, the tile automatically shows its tactile vector icon and paper backdrop.
