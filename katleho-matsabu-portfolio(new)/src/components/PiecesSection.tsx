import React, { useState, useEffect, useRef } from 'react';
import { hover, press, animate } from 'motion';
import { PieceTileItem } from '../types.ts';
import { INITIAL_PIECES_TILES } from '../data/portfolioData.ts';

export const PiecesSection: React.FC = () => {
  const [pieces, setPieces] = useState<PieceTileItem[]>(INITIAL_PIECES_TILES);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !gridRef.current) return;

    const tileElements = gridRef.current.querySelectorAll<HTMLDivElement>('.piece-tile');
    const cleanups: (() => void)[] = [];

    tileElements.forEach((el) => {
      const stopHover = hover(el, (element) => {
        animate(
          element as HTMLElement,
          { transform: 'translateY(-2px) scale(1.02)' },
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
  }, [pieces]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPieces = [...pieces];
    const item = newPieces.splice(draggedIndex, 1)[0];
    newPieces.splice(index, 0, item);
    setDraggedIndex(index);
    setPieces(newPieces);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const movePiece = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pieces.length) return;

    const newPieces = [...pieces];
    const [moved] = newPieces.splice(index, 1);
    newPieces.splice(targetIndex, 0, moved);
    setPieces(newPieces);
  };

  return (
    <section id="pieces" className="py-13 border-t border-dashed border-[var(--line)]">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 mb-8 items-start">
        <h2 className="font-fraunces font-normal text-2xl text-[var(--ink)] m-0">Pieces</h2>
        <div>
          <p className="m-0 text-[var(--muted)] text-[0.95rem] max-w-[46ch] leading-relaxed">
            Sketches and 3D art — swap these placeholders for scans or renders of your own work.
          </p>
          <p className="mt-1 font-mono text-[0.72rem] text-[var(--muted)] opacity-80">
            Drag to rearrange · Tactile press feedback
          </p>
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3.5"
        role="region"
        aria-label="Art pieces grid"
      >
        {pieces.map((piece, idx) => (
          <div
            key={piece.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className="piece-tile aspect-square rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] relative overflow-hidden flex flex-col justify-between p-3 cursor-grab active:cursor-grabbing select-none group focus-within:ring-2 focus-within:ring-[var(--slate)]"
            tabIndex={0}
            aria-roledescription="sortable piece"
            aria-label={`${piece.title}, ${piece.type}. Position ${idx + 1} of ${pieces.length}.`}
          >
            {/* Real Artwork Image if provided and loaded */}
            {piece.imageUrl && !failedImages[piece.id] && (
              <>
                <img
                  src={piece.imageUrl}
                  alt={piece.alt || piece.title}
                  onError={() => setFailedImages((prev) => ({ ...prev, [piece.id]: true }))}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper-raised)] via-transparent to-transparent opacity-90 dark:opacity-85 pointer-events-none" />
              </>
            )}

            {/* Top row: accessibility keyboard controls */}
            <div className="flex justify-end opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity relative z-10">
              <div className="flex gap-1">
                {idx > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      movePiece(idx, 'left');
                    }}
                    className="w-5 h-5 rounded bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--clay)] text-[0.65rem] flex items-center justify-center cursor-pointer border border-[var(--line)]"
                    aria-label={`Move ${piece.title} left`}
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                {idx < pieces.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      movePiece(idx, 'right');
                    }}
                    className="w-5 h-5 rounded bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--clay)] text-[0.65rem] flex items-center justify-center cursor-pointer border border-[var(--line)]"
                    aria-label={`Move ${piece.title} right`}
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
            </div>

            {/* Subtle textured geometric visual placeholder */}
            {(!piece.imageUrl || failedImages[piece.id]) && (
              <div className="flex-1 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                {piece.title.includes('3D') ? (
                  <svg className="w-10 h-10 text-[var(--slate)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-[var(--clay)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                  </svg>
                )}
              </div>
            )}
            {piece.imageUrl && !failedImages[piece.id] && <div className="flex-1" />}

            {/* Bottom tag: preserved label */}
            <div className="flex flex-col relative z-10">
              <span className="font-mono text-[0.72rem] text-[var(--ink)] font-medium">
                {piece.title}
              </span>
              <span className="font-mono text-[0.62rem] text-[var(--muted)]">
                {piece.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
