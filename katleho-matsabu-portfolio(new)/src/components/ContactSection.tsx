import React, { useEffect, useRef } from 'react';
import { hover, animate } from 'motion';
import { CONTACT_LINKS } from '../data/portfolioData.ts';

export const ContactSection: React.FC = () => {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !tableRef.current) return;

    const links = tableRef.current.querySelectorAll<HTMLAnchorElement>('a');
    const cleanups: (() => void)[] = [];

    links.forEach((link) => {
      // Minimal subtle hover shift on row links
      const stopHover = hover(link, (element) => {
        animate(
          element as HTMLElement,
          { transform: 'translateX(3px)' },
          { duration: 0.18, ease: 'easeOut' } as any
        );
        return () => {
          animate(
            element as HTMLElement,
            { transform: 'translateX(0px)' },
            { duration: 0.18, ease: 'easeOut' } as any
          );
        };
      });
      cleanups.push(stopHover);
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section id="contact" className="py-13 border-t border-dashed border-[var(--line)] relative">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 mb-8 items-start">
        <h2 className="font-fraunces font-normal text-2xl text-[var(--ink)] m-0">Contact</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="m-0 text-[var(--muted)] text-[0.95rem] max-w-[46ch] leading-relaxed">
            Don&apos;t be a stranger — happy to hear from you.
          </p>

          {/* Hand-drawn annotation doodle adapted from Robin's design pattern */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto select-none rotate-[-2deg]">
            <span className="font-handwriting text-[1.25rem] text-[var(--clay)] tracking-wide">
              don&apos;t be a stranger :)
            </span>
            <svg
              className="w-8 h-8 text-[var(--clay)] -mt-1"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Organic hand-drawn curved arrow pointing down toward email */}
              <path d="M 6 12 C 14 10, 26 14, 28 26" />
              <path d="M 22 24 L 28 27 L 31 20" />
            </svg>
          </div>
        </div>
      </div>

      <table ref={tableRef} className="w-full border-collapse">
        <tbody>
          {CONTACT_LINKS.map((item, idx) => (
            <tr key={item.label}>
              <td className="py-3.5 border-b border-[var(--line)] font-mono text-[0.78rem] text-[var(--muted)] w-[120px]">
                {item.label}
              </td>
              <td className={`py-3.5 border-b border-[var(--line)] text-[0.95rem] ${idx === CONTACT_LINKS.length - 1 ? 'border-b-0' : ''}`}>
                <a
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  className="text-[var(--ink)] no-underline border-b border-[var(--line)] hover:border-[var(--clay)] hover:text-[var(--clay)] transition-colors inline-block"
                >
                  {item.value}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
