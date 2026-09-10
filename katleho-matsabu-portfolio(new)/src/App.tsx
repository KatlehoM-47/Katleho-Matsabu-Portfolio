import React, { useState, useEffect } from 'react';
import anime from './lib/anime.ts';
import { Navigation } from './components/Navigation.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { PiecesSection } from './components/PiecesSection.tsx';
import { WritingSection } from './components/WritingSection.tsx';
import { GuestbookSection } from './components/GuestbookSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ScrollToTop } from './components/ScrollToTop.tsx';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Soft radial wipe theme toggle using Anime.js
  const handleToggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextThemeIsDark = !isDark;

    if (prefersReducedMotion) {
      setIsDark(nextThemeIsDark);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const maxDist = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    // Target background color: #171714 for dark mode, #F0EFE9 for light mode
    const targetBg = nextThemeIsDark ? '#171714' : '#F0EFE9';

    // Create radial wipe overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = targetBg;
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '99999';
    overlay.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
    document.body.appendChild(overlay);

    anime({
      targets: overlay,
      clipPath: [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxDist * 1.05}px at ${cx}px ${cy}px)`,
      ],
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
      duration: 520,
      complete: () => {
        setIsDark(nextThemeIsDark);
        overlay.remove();
      },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--clay)] selection:text-white transition-colors duration-200">
      <div className="max-w-[760px] mx-auto px-6">
        <Navigation isDark={isDark} onToggleTheme={handleToggleTheme} />
        <main>
          <HeroSection />
          <ProjectsSection />
          <GallerySection />
          <PiecesSection />
          <WritingSection />
          <GuestbookSection />
          <ContactSection />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}
