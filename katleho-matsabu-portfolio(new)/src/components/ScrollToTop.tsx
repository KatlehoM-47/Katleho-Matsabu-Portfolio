import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate scroll progress percentage (0 - 100)
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
      }

      // Show button after scrolling down 300px
      if (scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circular progress calculation
  const size = 44;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 flex items-center"
        >
          <button
            onClick={scrollToTop}
            id="scrollToTopBtn"
            className="group relative w-[44px] h-[44px] rounded-full bg-[var(--paper-raised)] border border-[var(--line)] flex items-center justify-center cursor-pointer shadow-md hover:border-[var(--clay)] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--clay)]/40 text-[var(--ink)] hover:text-[var(--clay)]"
            aria-label="Scroll to top of page"
            title="Scroll to top"
          >
            {/* Circular Scroll Progress Ring */}
            <svg
              className="absolute inset-0 -rotate-90 pointer-events-none"
              width={size}
              height={size}
            >
              {/* Background track circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--line)"
                strokeWidth={strokeWidth}
                className="opacity-40"
              />
              {/* Active scroll progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--clay)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150"
              />
            </svg>

            {/* Up arrow icon with micro-interaction */}
            <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-active:translate-y-0" />
            
            {/* Accessible screen reader text */}
            <span className="sr-only">Scroll back to top</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
