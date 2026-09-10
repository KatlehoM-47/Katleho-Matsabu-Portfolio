import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { HERO_DATA } from '../data/portfolioData.ts';

interface TypeToken {
  id: number;
  char: string;
  isSemibold?: boolean;
  isClayItalic?: boolean;
  isEmoji?: boolean;
  emojiTitle?: string;
  pauseAfter?: number;
}

const RAW_SEGMENTS = [
  { text: "Hey, ", pauseAtEnd: 160 },
  { text: "I'm " },
  { text: "Katleho Matsabu", isSemibold: true, pauseAtEnd: 200 },
  { text: " — a Junior Developer ", pauseAtEnd: 100 },
  { text: "💻", isEmoji: true, emojiTitle: "Code", pauseAtEnd: 220 },
  { text: " & UX Designer ", pauseAtEnd: 100 },
  { text: "🎨", isEmoji: true, emojiTitle: "Design", pauseAtEnd: 220 },
  { text: " who dabbles in ", pauseAtEnd: 80 },
  { text: "the arts", isClayItalic: true, pauseAtEnd: 180 },
  { text: " " },
  { text: "🎭", isEmoji: true, emojiTitle: "Arts", pauseAtEnd: 220 },
  { text: ".", pauseAtEnd: 250 },
];

function buildTokens(): TypeToken[] {
  const list: TypeToken[] = [];
  let id = 0;

  for (const seg of RAW_SEGMENTS) {
    if (seg.isEmoji) {
      list.push({
        id: id++,
        char: seg.text,
        isEmoji: true,
        emojiTitle: seg.emojiTitle,
        pauseAfter: seg.pauseAtEnd,
      });
    } else {
      const chars = Array.from(seg.text);
      chars.forEach((c, idx) => {
        let pause: number | undefined = undefined;
        if (idx === chars.length - 1 && seg.pauseAtEnd) {
          pause = seg.pauseAtEnd;
        } else if (c === ',') {
          pause = 150;
        } else if (c === '—') {
          pause = 170;
        }
        list.push({
          id: id++,
          char: c,
          isSemibold: seg.isSemibold,
          isClayItalic: seg.isClayItalic,
          pauseAfter: pause,
        });
      });
    }
  }

  return list;
}

export const HeroSection: React.FC = () => {
  const tokens = useRef(buildTokens()).current;
  const totalTokens = tokens.length;

  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTypewriter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRevealedCount(totalTokens);
      setIsTyping(false);
      setIsComplete(true);
      return;
    }

    setRevealedCount(0);
    setIsTyping(true);
    setIsComplete(false);

    let currentIndex = 0;

    const typeNext = () => {
      if (currentIndex >= totalTokens) {
        setIsTyping(false);
        setIsComplete(true);
        return;
      }

      currentIndex++;
      setRevealedCount(currentIndex);

      if (currentIndex >= totalTokens) {
        setIsTyping(false);
        setIsComplete(true);
        return;
      }

      const currentToken = tokens[currentIndex - 1];
      const baseDelay = 28 + Math.random() * 12; // 28ms-40ms natural cadence
      const extraDelay = currentToken.pauseAfter || 0;
      const nextDelay = baseDelay + extraDelay;

      timeoutRef.current = setTimeout(typeNext, nextDelay);
    };

    // Soft initial delay before first keystroke
    timeoutRef.current = setTimeout(typeNext, 220);
  }, [tokens, totalTokens]);

  useEffect(() => {
    startTypewriter();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startTypewriter]);

  // Click on headline to fast-forward if user doesn't want to wait
  const handleFastForward = () => {
    if (!isComplete) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setRevealedCount(totalTokens);
      setIsTyping(false);
      setIsComplete(true);
    }
  };

  const visibleTokens = tokens.slice(0, revealedCount);

  return (
    <section className="py-16 md:py-20" aria-label="Introduction">
      <div className="relative">
        <h1
          onClick={handleFastForward}
          className="font-fraunces font-normal text-[clamp(1.9rem,5vw,2.65rem)] leading-[1.26] m-0 mb-5 max-w-[24ch] text-[var(--ink)] cursor-pointer select-text"
          title={!isComplete ? 'Click to skip typewriter animation' : undefined}
          aria-label="Hey, I'm Katleho Matsabu — a Junior Developer and UX Designer who dabbles in the arts."
        >
          <span aria-hidden="true">
            {visibleTokens.map((token) => {
              if (token.isEmoji) {
                return (
                  <span
                    key={token.id}
                    title={token.emojiTitle}
                    className="inline-block transform hover:scale-125 transition-transform cursor-default select-none mx-0.5"
                  >
                    {token.char}
                  </span>
                );
              }

              let className = 'inline';
              if (token.isSemibold) {
                className = 'font-semibold inline';
              } else if (token.isClayItalic) {
                className = 'italic text-[var(--clay)] inline';
              }

              return (
                <span key={token.id} className={className}>
                  {token.char}
                </span>
              );
            })}
          </span>

          {/* Typewriter insertion caret */}
          <span
            className={`typewriter-cursor ${isTyping ? 'solid' : 'blinking'}`}
            aria-hidden="true"
          />
        </h1>

        {/* Replay typewriter button indicator */}
        <div className="min-h-[28px] mb-4">
          <AnimatePresence>
            {isComplete && (
              <motion.button
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                onClick={startTypewriter}
                className="font-mono text-[0.7rem] text-[var(--muted)] hover:text-[var(--ink)] inline-flex items-center gap-1.5 transition-colors border border-[var(--line)] hover:border-[var(--clay)] px-2.5 py-0.5 rounded-full bg-[var(--paper-raised)] cursor-pointer select-none"
                title="Replay typewriter effect"
                aria-label="Replay typewriter effect"
              >
                <RotateCcw className="w-3 h-3 text-[var(--clay)]" />
                <span>Replay typewriter</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bio Note with Framer Motion entry transition */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono text-[0.85rem] text-[var(--muted)] max-w-[44ch] p-4 sm:p-5 border-l-2 border-[var(--clay)] bg-[var(--paper-raised)] rounded-r-[var(--radius)] leading-relaxed"
      >
        {HERO_DATA.bioNote}
      </motion.div>

      {/* Role Tags with Framer Motion entry transition */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex gap-2 flex-wrap mt-5 font-mono text-[0.72rem] text-[var(--muted)]"
      >
        {HERO_DATA.roleTags.map((tag) => (
          <span
            key={tag.label}
            className="border border-[var(--line)] py-[3px] px-[10px] rounded-full flex items-center gap-1.5 hover:border-[var(--clay)] hover:text-[var(--ink)] transition-colors cursor-default"
          >
            <span className="text-[0.85rem] leading-none">{tag.icon}</span>
            <span>{tag.label}</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
};
