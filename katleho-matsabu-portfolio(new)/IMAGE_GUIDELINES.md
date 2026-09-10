# Portfolio Image Placement Guidelines

This guide details how to place, format, and manage your images across the **Gallery**, **Pieces**, and **Writing** sections of your portfolio.

---

## 1. Quick Folder & Filename Reference

The code is pre-wired to load these exact filenames from the `/public/images/` directory:

| Section | Target Folder | Default Pre-Wired Filenames | Ideal Aspect Ratio | Recommended Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **Gallery** | `/public/images/gallery/` | `photo-1.webp`<br>`photo-2.webp`<br>`photo-3.webp`<br>`photo-4.webp` | **3:4 / 2:3** (Tall)<br>**4:3** (Compact) | 800 × 1200 px (Tall)<br>800 × 600 px (Compact) |
| **Pieces** | `/public/images/pieces/` | `piece-1.webp`<br>`piece-2.webp`<br>`piece-3.webp`<br>`piece-4.webp` | **1:1** (Square) | 800 × 800 px (min. 600 × 600 px) |
| **Writing** | `/public/images/writing/` | `story-1.webp`<br>`story-2.webp` | **16:9** or **3:2** | 600 × 338 px or 800 × 450 px |

---

## 2. Step-by-Step Placement Workflow

### Option A: Quick Drop-In (Zero Code Changes Needed)
1. Convert your image to **`.webp`** (or `.jpg` / `.png`).
2. Rename your image to match one of the default filenames (e.g. `photo-1.webp`).
3. Drag and drop the file directly into the matching folder:
   - `public/images/gallery/photo-1.webp`
   - `public/images/pieces/piece-1.webp`
   - `public/images/writing/story-1.webp`
4. The page will instantly display the real photo with smooth hover zoom animations and legibility overlays.

### Option B: Custom Filename or Different Format (.jpg, .png)
If your image has a custom name (e.g. `dune-sunset.jpg`):
1. Place `dune-sunset.jpg` into `public/images/gallery/`.
2. Open `src/data/portfolioData.ts`.
3. Update the `imageUrl` property of the target tile:
   ```ts
   {
     id: 'gal-1',
     title: '01',
     subtitle: 'Dune Sunset Study',
     imageUrl: '/images/gallery/dune-sunset.jpg', // updated path
     ...
   }
   ```

---

## 3. Section-by-Section Guidelines

### A. Gallery (`#gallery`)
- **Structure**: Uneven masonry grid with variable heights (`320px`, `220px`, `270px`, `350px`) and drag-and-drop reordering.
- **Composition**: Keep the main subject centered. A small frosted pill displays at the top (`drag / reorder`) and bottom (`01`, `subtitle`), so keep critical details away from the extreme edges.
- **Atmosphere**: Warm natural light, architectural geometry, grain, and high-contrast shadows pair best with the `--paper` background.
- **Graceful Fallback**: If an image file is missing, the tile displays its bespoke CSS gradient fallback without broken image icons.

### B. Pieces (`#pieces`)
- **Structure**: 1:1 square grid with tactile press micro-interactions.
- **Composition**:
  - **Sketches / Physical Art**: High-resolution scans showing cotton paper tooth and natural graphite/ink texture.
  - **3D Art & Shaders**: Transparent PNG background or matched to `#E8E6DF` (light) / `#21201C` (dark) so models float naturally on the card.
- **Graceful Fallback**: If no image is provided, the tile displays tactile vector pen/3D cube icons.

### C. Writing (`#writing`)
- **Structure**: Editorial article shelf with responsive thumbnails and in-site article/PDF reader.
- **Composition**: Wide landscape crops, atmospheric textures, or typography details that set the tone of the writing.
- **Story PDFs**: Place your story manuscripts in `/public/stories/` (e.g., `story-1.pdf`). When clicked, stories open directly on the site in an online article reader with a toggle between formatted article text and embedded PDF document mode.
- **Graceful Fallback**: If no cover image is assigned, the story cleanly collapses to an editorial typography layout.

---

## 4. Optimization Best Practices

- **Preferred Format**: **WebP** produces 30% smaller files than JPEG with no visible quality loss.
- **Target File Size**: **150 KB – 350 KB** per image.
- **Color Profile**: **sRGB** (prevents colors from shifting across different screens).
- **Free Web Tools for Compression**:
  - [Squoosh.app](https://squoosh.app) (fast in-browser converter to WebP)
  - [TinyPNG / TinyJPG](https://tinypng.com)
