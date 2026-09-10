import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Download, BookOpen, FileText, ArrowLeft } from 'lucide-react';
import { StoryItem } from '../types.ts';

interface StoryReaderModalProps {
  story: StoryItem | null;
  onClose: () => void;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({ story, onClose }) => {
  const [viewMode, setViewMode] = useState<'article' | 'pdf'>('article');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset to article view on open, handle Escape key & scroll lock
  useEffect(() => {
    if (!story) return;
    setViewMode('article');
    setScrollProgress(0);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [story, onClose]);

  // Track article scroll progress for the top reading line
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const total = scrollHeight - clientHeight;
    if (total > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollTop / total) * 100)));
    }
  };

  if (!story) return null;

  const pdfHref = story.pdfUrl || `/stories/${story.id}.pdf`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={`Reading: ${story.title}`}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl h-[92vh] max-h-[900px] bg-[var(--paper)] text-[var(--ink)] rounded-[12px] border border-[var(--line)] shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Reading progress bar */}
          {viewMode === 'article' && (
            <div
              className="absolute top-0 left-0 h-[2px] bg-[var(--clay)] transition-all duration-150 z-30"
              style={{ width: `${scrollProgress}%` }}
              aria-hidden="true"
            />
          )}

          {/* Reader Top Navigation Bar */}
          <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-[var(--line)] bg-[var(--paper-raised)] shrink-0 z-20">
            {/* Back button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 font-mono text-[0.75rem] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer py-1 px-2 rounded hover:bg-black/5 dark:hover:bg-white/5"
              title="Close reader (Esc)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to shelf</span>
            </button>

            {/* View Mode Toggle: Article vs PDF */}
            <div className="flex items-center bg-[var(--paper)] p-0.5 rounded-full border border-[var(--line)] shadow-xs">
              <button
                onClick={() => setViewMode('article')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem] font-mono transition-all cursor-pointer ${
                  viewMode === 'article'
                    ? 'bg-[var(--clay)] text-white shadow-xs font-medium'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Article View</span>
              </button>
              <button
                onClick={() => setViewMode('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem] font-mono transition-all cursor-pointer ${
                  viewMode === 'pdf'
                    ? 'bg-[var(--clay)] text-white shadow-xs font-medium'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Original PDF</span>
              </button>
            </div>

            {/* Actions: Open New Tab, Download, Close */}
            <div className="flex items-center gap-1">
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Open PDF in new tab"
                aria-label="Open PDF in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={pdfHref}
                download={`${story.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Download PDF"
                aria-label="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors ml-1 cursor-pointer"
                title="Close (Esc)"
                aria-label="Close reader"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Reader Body */}
          <div className="flex-1 overflow-hidden relative bg-[var(--paper)]">
            {viewMode === 'article' ? (
              /* Article View: Formatted Editorial Layout */
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto px-6 sm:px-12 md:px-16 py-10 md:py-14"
              >
                <article className="max-w-[620px] mx-auto">
                  {/* Article Metadata */}
                  <div className="flex items-center gap-3 font-mono text-[0.72rem] text-[var(--muted)] mb-4 tracking-wide uppercase">
                    <span>{story.date || 'Fragment'}</span>
                    <span>•</span>
                    <span>{story.readTime || '3 min read'}</span>
                    <span>•</span>
                    <span>By Katleho Matsabu</span>
                  </div>

                  {/* Article Title */}
                  <h1 className="font-fraunces text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight m-0 mb-3 leading-[1.15]">
                    {story.title}
                  </h1>

                  {/* Subtitle / Lead Excerpt */}
                  {story.subtitle && (
                    <p className="font-fraunces italic text-lg sm:text-xl text-[var(--muted)] m-0 mb-8 leading-relaxed">
                      {story.subtitle}
                    </p>
                  )}

                  <hr className="border-t border-dashed border-[var(--line)] my-8" />

                  {/* Cover Image if available */}
                  {story.coverImage && (
                    <div className="my-8 rounded-[8px] overflow-hidden border border-[var(--line)] shadow-xs">
                      <img
                        src={story.coverImage}
                        alt={story.alt || story.title}
                        className="w-full max-h-[360px] object-cover"
                      />
                    </div>
                  )}

                  {/* Story Text Paragraphs */}
                  <div className="flex flex-col gap-6 text-[1.02rem] text-[var(--ink)] leading-[1.8] font-normal">
                    {story.fullText && story.fullText.length > 0 ? (
                      story.fullText.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className={`m-0 ${
                            pIdx === 0
                              ? 'first-letter:font-fraunces first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[var(--clay)]'
                              : ''
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <>
                        <p className="m-0 first-letter:font-fraunces first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[var(--clay)]">
                          {story.teaser}
                        </p>
                        <p className="m-0 text-[var(--muted)] italic">
                          Manuscript text preview. You can toggle to the Original PDF view above to inspect the fully typeset document.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Bottom Manuscript Action Banner */}
                  <div className="mt-14 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--paper-raised)] p-5 rounded-[8px] border border-[var(--line)]">
                    <div>
                      <h4 className="font-fraunces font-medium text-base text-[var(--ink)] m-0 mb-1">
                        Original Document Available
                      </h4>
                      <p className="font-mono text-[0.75rem] text-[var(--muted)] m-0">
                        Read with formatted typography, diagrams, or original layouts.
                      </p>
                    </div>
                    <button
                      onClick={() => setViewMode('pdf')}
                      className="inline-flex items-center gap-2 font-mono text-[0.78rem] bg-[var(--ink)] text-[var(--paper)] px-3.5 py-2 rounded-[6px] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Switch to PDF View →</span>
                    </button>
                  </div>
                </article>
              </div>
            ) : (
              /* PDF View: Embedded in-site document reader */
              <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-[var(--paper-raised)] border-b border-[var(--line)] text-[0.75rem] font-mono text-[var(--muted)]">
                  <span>Viewing: {story.title}.pdf</span>
                  <span className="hidden sm:inline">Use PDF controls to zoom, scroll, or print</span>
                </div>
                <div className="flex-1 w-full h-full bg-[#323639]">
                  <object
                    data={`${pdfHref}#toolbar=1&view=FitH`}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    {/* Fallback iframe */}
                    <iframe
                      src={`${pdfHref}#toolbar=1&view=FitH`}
                      title={story.title}
                      className="w-full h-full border-0"
                    >
                      <div className="p-8 text-center text-white font-mono text-sm">
                        <p className="mb-4">Your browser does not support inline PDF viewing.</p>
                        <a
                          href={pdfHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--clay)] text-white rounded font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download or View PDF
                        </a>
                      </div>
                    </iframe>
                  </object>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
