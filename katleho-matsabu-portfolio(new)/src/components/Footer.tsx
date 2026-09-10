import React from 'react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 pb-14 font-mono text-[0.72rem] text-[var(--muted)] flex justify-between items-center flex-wrap gap-3 border-t border-[var(--line)]">
      <span>© {new Date().getFullYear()} Katleho Matsabu</span>
      <div className="flex items-center gap-4">
        <span>Built with care</span>
        <button
          onClick={scrollToTop}
          className="cursor-pointer text-[var(--muted)] hover:text-[var(--clay)] transition-colors border-b border-transparent hover:border-[var(--clay)] pb-0.5 bg-transparent p-0 flex items-center gap-1"
          aria-label="Back to top"
        >
          <span>Back to top</span>
          <span>↑</span>
        </button>
      </div>
    </footer>
  );
};
