import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { animate, hover } from 'motion';
import { ArrowUpRight, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  isDark: boolean;
  onToggleTheme: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface NavItem {
  label: string;
  href: string;
  num: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', href: '#projects', num: '01' },
  { label: 'Gallery', href: '#gallery', num: '02' },
  { label: 'Pieces', href: '#pieces', num: '03' },
  { label: 'Writing', href: '#writing', num: '04' },
  { label: 'Guestbook', href: '#guestbook', num: '05', badge: 'New' },
  { label: 'Contact', href: '#contact', num: '06' },
];

export const Navigation: React.FC<NavigationProps> = ({ isDark, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const mobileToggleBtnRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on screen resize to desktop (md breakpoint: 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Spring hover animations for desktop nav links
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const links = desktopNavRef.current?.querySelectorAll<HTMLAnchorElement>('a');
    const cleanups: (() => void)[] = [];

    links?.forEach((link) => {
      const stopHover = hover(link, (element) => {
        animate(
          element as HTMLElement,
          { transform: 'translateY(-2px) scale(1.04)' },
          { type: 'spring', stiffness: 450, damping: 24 } as any
        );
        return () => {
          animate(
            element as HTMLElement,
            { transform: 'translateY(0px) scale(1)' },
            { type: 'spring', stiffness: 450, damping: 24 } as any
          );
        };
      });
      cleanups.push(stopHover);
    });

    if (toggleBtnRef.current) {
      const stopToggleHover = hover(toggleBtnRef.current, (element) => {
        animate(
          element as HTMLElement,
          { transform: 'scale(1.12) rotate(15deg)' },
          { type: 'spring', stiffness: 500, damping: 20 } as any
        );
        return () => {
          animate(
            element as HTMLElement,
            { transform: 'scale(1) rotate(0deg)' },
            { type: 'spring', stiffness: 500, damping: 20 } as any
          );
        };
      });
      cleanups.push(stopToggleHover);
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Smooth scroll if element exists
    const targetId = href.replace('#', '');
    if (targetId) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="py-6 sm:py-7 border-b border-[var(--line)] relative z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#"
          onClick={() => setMobileMenuOpen(false)}
          className="font-fraunces font-semibold text-[1.22rem] tracking-[-0.01em] text-[var(--ink)] no-underline group select-none"
        >
          katleho<span className="text-[var(--clay)] group-hover:inline-block group-hover:translate-x-0.5 transition-transform">.</span>
        </a>

        {/* Desktop Navigation (hidden on mobile, visible on md+) */}
        <nav ref={desktopNavRef} aria-label="Desktop Navigation" className="hidden md:block">
          <ul className="list-none flex items-center gap-6 m-0 p-0 font-mono text-[0.82rem]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[var(--muted)] no-underline pb-0.5 border-b border-transparent hover:text-[var(--ink)] hover:border-[var(--clay)] transition-colors inline-block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            ref={toggleBtnRef}
            onClick={onToggleTheme}
            id="themeToggle"
            className="theme-toggle w-[38px] h-[38px] rounded-full border border-[var(--line)] bg-[var(--paper-raised)] flex items-center justify-center cursor-pointer text-[var(--ink)] hover:border-[var(--clay)] shrink-0 transition-colors shadow-xs"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[var(--clay)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--slate)]" />
            )}
          </button>

          {/* Modern Animated Hamburger Button (mobile only: md:hidden) */}
          <button
            ref={mobileToggleBtnRef}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            id="mobileMenuToggle"
            className="md:hidden w-[38px] h-[38px] rounded-full border border-[var(--line)] bg-[var(--paper-raised)] flex flex-col items-center justify-center gap-[4.5px] cursor-pointer text-[var(--ink)] hover:border-[var(--clay)] focus:outline-hidden focus:ring-2 focus:ring-[var(--clay)]/40 shrink-0 transition-colors shadow-xs"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span
              className={`w-[18px] h-[1.8px] bg-current rounded-full transition-all duration-300 origin-center ${
                mobileMenuOpen ? 'translate-y-[6.3px] rotate-45 bg-[var(--clay)]' : ''
              }`}
            />
            <span
              className={`w-[18px] h-[1.8px] bg-current rounded-full transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span
              className={`w-[18px] h-[1.8px] bg-current rounded-full transition-all duration-300 origin-center ${
                mobileMenuOpen ? '-translate-y-[6.3px] -rotate-45 bg-[var(--clay)]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Modern Full Mobile Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 top-[73px] bg-black/35 dark:bg-black/60 backdrop-blur-xs z-40"
              aria-hidden="true"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 bg-[var(--paper-raised)] border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden z-50 p-5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--line)]">
                <span className="font-mono text-[0.72rem] text-[var(--muted)] tracking-wider uppercase">
                  Menu
                </span>
                <span className="font-mono text-[0.68rem] text-[var(--clay)] bg-[var(--clay)]/10 px-2 py-0.5 rounded-full">
                  Katleho&apos;s Portfolio
                </span>
              </div>

              <nav>
                <ul className="list-none m-0 p-0 flex flex-col divide-y divide-[var(--line)]/50">
                  {NAV_ITEMS.map((item, idx) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * idx, duration: 0.2 }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className="flex items-center justify-between py-3 px-2 rounded-lg text-[var(--ink)] hover:text-[var(--clay)] hover:bg-[var(--paper)] transition-all group no-underline"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[0.72rem] text-[var(--muted)] group-hover:text-[var(--clay)] transition-colors w-5">
                            {item.num}
                          </span>
                          <span className="font-fraunces text-[1.1rem] tracking-tight group-hover:translate-x-1 transition-transform">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="font-mono text-[0.6rem] bg-[var(--clay)] text-white px-1.5 py-0.5 rounded-full leading-none">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--clay)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-60 group-hover:opacity-100" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Status pill in drawer footer */}
              <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-[0.72rem] font-mono text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available for junior roles</span>
                </div>
                <span className="text-[var(--muted)] opacity-75">2026</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
