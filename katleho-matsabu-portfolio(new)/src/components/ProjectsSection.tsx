import React, { useEffect, useRef } from 'react';
import { inView, animate } from 'motion';
import { PROJECTS } from '../data/portfolioData.ts';

export const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const rows = containerRef.current.querySelectorAll<HTMLAnchorElement>('.project-row');

    rows.forEach((row) => {
      // Motion.dev inView: one-time nudge on arrow and subtle tint when scrolled into view
      inView(
        row,
        () => {
          const arrow = row.querySelector('.project-arrow');
          if (arrow) {
            animate(
              arrow as HTMLElement,
              { transform: ['translateX(0px)', 'translateX(5px)', 'translateX(0px)'] },
              { duration: 0.5, ease: 'easeOut' } as any
            );
          }
          animate(
            row as HTMLElement,
            {
              backgroundColor: ['rgba(184, 98, 45, 0.08)', 'transparent'],
            },
            { duration: 0.85, ease: 'easeOut' } as any
          );
        },
        { margin: '0px 0px -10% 0px' }
      );
    });
  }, []);

  return (
    <section id="projects" className="py-13 border-t border-dashed border-[var(--line)]">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 mb-8 items-start">
        <h2 className="font-fraunces font-normal text-2xl text-[var(--ink)] m-0">Projects</h2>
        <p className="m-0 text-[var(--muted)] text-[0.95rem] max-w-[46ch] leading-relaxed">
          Code, UX experiments and things I&apos;ve built — some shipped, some still coming together.
        </p>
      </div>

      <div ref={containerRef} className="flex flex-col">
        {PROJECTS.map((p, idx) => (
          <a
            key={p.id}
            href={p.href}
            className={`project-row grid grid-cols-[60px_1fr_auto] gap-4 sm:gap-5 items-center py-4 sm:py-5 border-b border-[var(--line)] text-inherit no-underline transition-colors group ${
              idx === PROJECTS.length - 1 ? 'border-b-0' : ''
            }`}
          >
            <span className="font-mono text-[0.78rem] text-[var(--muted)]">
              {p.year}
            </span>
            <span>
              <span className="font-semibold text-[0.98rem] text-[var(--ink)] group-hover:text-[var(--clay)] transition-colors block">
                {p.name}
              </span>
              <span className="font-mono text-[0.72rem] text-[var(--muted)] block mt-0.5">
                {p.tags}
              </span>
            </span>
            <span className="project-arrow text-[var(--muted)] group-hover:text-[var(--clay)] text-sm transition-colors inline-block pr-1">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};
