# Katleho Matsabu — Portfolio & Creative Shelf

A personal portfolio, sketchbook, and digital shelf for **Katleho Matsabu**, a Junior Developer & UX Designer working at the intersection of code, design, and art.

Built with a tactile, editorial aesthetic inspired by physical paper, warm typography, and organic micro-interactions.

---

## ✨ Features & Highlights

### 1. Interactive Hero & Status
- **Dynamic Identity**: Interactive title and status line reflecting work across code, design, and art.
- **Tactile Details**: Live location ticker, status indicator, and a reset micro-interaction.

### 2. Selected Projects (`#work`)
- Clean, typography-driven list of selected works and experimental prototypes.
- Highlights production status (`In Progress` tags), technical tags, and project links.
- Includes a dedicated, stylized **Coming Soon** showcase page (`/coming-soon.html`).

### 3. Uneven Masonry Gallery (`#gallery`)
- **Visual Rhythm**: Uneven masonry grid with alternating tile heights (`320px`, `220px`, `270px`, `350px`).
- **Drag-and-Drop Reordering**: Interactive drag-and-drop tile sorting with accessible keyboard fallback (arrow button controls).
- **Graceful Image Fallback**: Automatically displays real photography from `/public/images/gallery/` with smooth hover zoom, or falls back to bespoke dual-tone CSS gradients if no file is present.

### 4. Art Pieces & Sketches (`#pieces`)
- **1:1 Square Grid**: Tactile shelf for pencil sketches on cotton paper, ink crosshatching, and 3D shader experiments.
- **Physical Feedback**: Press and hover physics powered by `motion`.
- **Vector Fallbacks**: Automatically falls back to clean vector pen and 3D wireframe illustrations when image files are awaiting upload.

### 5. Writing & In-Site PDF Article Reader (`#writing`)
- **In-Site Reading Experience**: Clicking any story opens an elegant, full-screen reader modal on the site—no external redirects or unexpected file downloads.
- **Dual Reading Modes**:
  - **Article View**: Editorial magazine layout with comfortable margins, drop caps, reading time indicators, and an interactive scroll progress bar.
  - **Original Document (PDF) View**: Embedded interactive PDF viewer with browser zoom, navigation, print, and full-screen controls.
- **Story File Management**: Story PDFs can simply be dropped into `/public/stories/` (e.g., `story-1.pdf`). Quick action buttons allow readers to also download or open the PDF in a new tab if desired.

### 6. Postcard Guestbook (`#guestbook`)
- **Tactile Postal Experience**: Interactive postcard card with customizable postage stamps, location tag, and live handwritten preview using the *Caveat* script font.
- **Full-Stack Persistence**: Connected to a local server API (`/api/guestbook`) storing entries in `data/guestbook.json`.
- **Security & Integrity**: Includes client-side rate limiting and an invisible honeypot anti-spam field.

### 7. Radial Wipe Theme Engine
- Soft radial circular clip-path transition between warm paper light mode (`#F0EFE9`) and deep editorial dark mode (`#171714`) powered by Anime.js.
- Respects user's `prefers-reduced-motion` settings.

---

## 🛠️ Tech Stack

- **Framework**: React 18+ (with TypeScript)
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS with custom design tokens for paper, ink, clay, and slate
- **Animations & Micro-interactions**:
  - `motion` and `motion/react` for physics-based gestures, drag-and-drop, and entry transitions
  - `animejs` for the radial wipe theme toggle
- **Typography**:
  - *Fraunces* (Editorial Display Serif)
  - *Inter* (Clean Body Text)
  - *IBM Plex Mono* (Technical Tags & Metadata)
  - *Caveat* (Handwritten Guestbook Signature)
- **Icons**: Lucide React
- **Backend API**: Node.js & Express (`server.ts`) for guestbook persistence

---

## 📁 Directory Structure

```text
├── public/
│   ├── images/
│   │   ├── gallery/     # Photography tiles (photo-1.webp, photo-2.webp, etc.)
│   │   ├── pieces/      # Sketches & 3D renders (piece-1.webp, piece-2.webp, etc.)
│   │   └── writing/     # Story covers & illustrations (story-1.webp, etc.)
│   ├── stories/         # PDF manuscripts & articles (story-1.pdf, story-2.pdf)
│   └── assets/          # Static assets
├── src/
│   ├── components/      # UI sections (Hero, Gallery, Pieces, Guestbook, etc.)
│   ├── data/            # Static data & content configs (portfolioData.ts)
│   ├── lib/             # Helper utilities (anime.ts, fetchShim.ts)
│   ├── types.ts         # TypeScript data structures & interfaces
│   ├── App.tsx          # Main layout & theme controller
│   └── main.tsx         # React root entry point
├── server/
│   └── guestbook-db.ts  # Guestbook JSON disk persistence logic
├── api/
│   └── guestbook.ts     # Express guestbook API route handlers
├── data/
│   └── guestbook.json   # Stored guestbook postcards
├── coming-soon.html     # Dedicated standalone coming soon page
├── index.html           # Main SPA entry point
├── IMAGE_GUIDELINES.md  # Detailed guide for image dimensions and placement
├── package.json         # Dependencies and scripts
└── server.ts            # Express full-stack server & Vite middleware
```

---

## 🖼️ Adding Your Own Images & Story PDFs

The codebase is pre-configured with drop-in folders under `/public/`.

| Section | Target Folder | Default Filenames | Notes |
| :--- | :--- | :--- | :--- |
| **Gallery** | `/public/images/gallery/` | `photo-1.webp`, `photo-2.webp`, etc. | Landscape & portrait photos |
| **Art Pieces** | `/public/images/pieces/` | `piece-1.webp`, `piece-2.webp`, etc. | 1:1 square sketches and 3D art |
| **Writing (Covers)** | `/public/images/writing/` | `story-1.webp`, `story-2.webp` | Optional story thumbnail images |
| **Writing (Story PDFs)** | `/public/stories/` | `story-1.pdf`, `story-2.pdf` | **Opens directly in in-site article reader** |

> 💡 **Tip**: For detailed image sizing, aspect ratios, and format recommendations, refer to [IMAGE_GUIDELINES.md](./IMAGE_GUIDELINES.md).

---

## 🚀 Getting Started

### Development
Start the full-stack development server on port `3000`:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Linting
Validate TypeScript types and syntax:
```bash
npm run lint
```

### Production Build
Build both the frontend bundle and server binary:
```bash
npm run build
```

### Production Start
Run the compiled production server:
```bash
npm start
```

---

## 📬 Contact

- **Email**: [kmatsabu0@gmail.com](mailto:kmatsabu0@gmail.com)
- **Portfolio**: [Katleho Matsabu](https://ais-pre-f2rv7hpwqjpmh6ezq2zohb-231592417593.europe-west2.run.app)
