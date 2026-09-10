import React, { useState, useEffect, useRef } from 'react';
import { hover, press, animate } from 'motion';
import { GalleryTileItem } from '../types.ts';
import { INITIAL_GALLERY_TILES } from '../data/portfolioData.ts';

export const GallerySection: React.FC = () => {
  const [tiles, setTiles] = useState<GalleryTileItem[]>(INITIAL_GALLERY_TILES);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !gridRef.current) return;

    const tileElements = gridRef.current.querySelectorAll<HTMLDivElement>('.gallery-tile');
    const cleanups: (() => void)[] = [];

    tileElements.forEach((el) => {
      // Motion.dev tactile hover
      const stopHover = hover(el, (element) => {
        animate(
          element as HTMLElement,
          { transform: 'translateY(-3px) scale(1.02)' },
          { duration: 0.2, ease: 'easeOut' } as any
        );
        return () => {
          animate(
            element as HTMLElement,
            { transform: 'translateY(0px) scale(1)' },
            { duration: 0.2, ease: 'easeOut' } as any
          );
        };
      });
      cleanups.push(stopHover);

      // Motion.dev tactile press
      const stopPress = press(el, (element) => {
        animate(
          element as HTMLElement,
          { transform: 'scale(0.97)' },
          { duration: 0.12 } as any
        );
        return () => {
          animate(
            element as HTMLElement,
            { transform: 'scale(1)' },
            { duration: 0.15 } as any
          );
        };
      });
      cleanups.push(stopPress);
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [tiles]);

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTiles = [...tiles];
    const item = newTiles.splice(draggedIndex, 1)[0];
    newTiles.splice(index, 0, item);
    setDraggedIndex(index);
    setTiles(newTiles);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Accessible keyboard fallback to move tiles
  const moveTile = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tiles.length) return;

    const newTiles = [...tiles];
    const [moved] = newTiles.splice(index, 1);
    newTiles.splice(targetIndex, 0, moved);
    setTiles(newTiles);
  };

  return (
    <section id="gallery" className="py-13 border-t border-dashed border-[var(--line)]">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 mb-8 items-start">
        <h2 className="font-fraunces font-normal text-2xl text-[var(--ink)] m-0">Gallery</h2>
        <div>
          <p className="m-0 text-[var(--muted)] text-[0.95rem] max-w-[46ch] leading-relaxed">
            Photos I&apos;ve taken along the way — replace these tiles with your own shots.
          </p>
          <p className="mt-1 font-mono text-[0.72rem] text-[var(--muted)] opacity-80">
            Drag to rearrange · Keyboard accessible with arrow controls
          </p>
        </div>
      </div>

      {/* Uneven masonry-style photo grid with varying heights */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 items-start"
        role="region"
        aria-label="Gallery photo grid"
      >
        {tiles.map((tile, idx) => (
          <div
            key={tile.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className={`gallery-tile ${tile.heightClass} rounded-[var(--radius)] relative overflow-hidden flex flex-col justify-between p-3.5 cursor-grab active:cursor-grabbing border border-[var(--line)] select-none transition-shadow group focus-within:ring-2 focus-within:ring-[var(--slate)]`}
            style={{
              background: tile.gradient,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            tabIndex={0}
            aria-roledescription="sortable tile"
            aria-label={`Photo tile ${tile.title}: ${tile.subtitle}. Position ${idx + 1} of ${tiles.length}.`}
          >
            {/* Real image if provided and loaded */}
            {tile.imageUrl && !failedImages[tile.id] && (
              <>
                <img
                  src={tile.imageUrl}
                  alt={tile.subtitle || tile.title}
                  onError={() => setFailedImages((prev) => ({ ...prev, [tile.id]: true }))}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/25 pointer-events-none" />
              </>
            )}

            {/* Top row: accessibility keyboard reorder buttons */}
            <div className="flex justify-between items-center w-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity relative z-10">
              <span className="font-mono text-[0.62rem] text-white/75 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                drag / reorder
              </span>
              <div className="flex gap-1">
                {idx > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTile(idx, 'left');
                    }}
                    className="w-5 h-5 rounded bg-black/50 text-white hover:bg-black text-[0.65rem] flex items-center justify-center cursor-pointer border border-white/20"
                    aria-label={`Move ${tile.title} left`}
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                {idx < tiles.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTile(idx, 'right');
                    }}
                    className="w-5 h-5 rounded bg-black/50 text-white hover:bg-black text-[0.65rem] flex items-center justify-center cursor-pointer border border-white/20"
                    aria-label={`Move ${tile.title} right`}
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
            </div>

            {/* Bottom tag: preserved index number and subtle title */}
            <div className="flex items-center justify-between w-full relative z-10">
              <span className="font-mono text-[0.62rem] text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                {tile.title}
              </span>
              <span className="font-mono text-[0.6rem] text-white/70 truncate max-w-[110px]">
                {tile.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
