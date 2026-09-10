import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { STORIES } from '../data/portfolioData.ts';
import { StoryItem } from '../types.ts';
import { StoryReaderModal } from './StoryReaderModal.tsx';

export const WritingSection: React.FC = () => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);

  return (
    <section id="writing" className="py-13 border-t border-dashed border-[var(--line)]">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 mb-8 items-start">
        <h2 className="font-fraunces font-normal text-2xl text-[var(--ink)] m-0">Writing</h2>
        <p className="m-0 text-[var(--muted)] text-[0.95rem] max-w-[46ch] leading-relaxed">
          Short stories and fragments — an extra shelf for words, alongside the images.
        </p>
      </div>

      <div className="flex flex-col">
        {STORIES.map((story, idx) => (
          <article
            key={story.id}
            className={`py-5 border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors group ${
              idx === STORIES.length - 1 ? 'border-b-0' : ''
            }`}
          >
            <div className="flex-1">
              <h3
                onClick={() => setSelectedStory(story)}
                className="font-fraunces font-medium text-[1.12rem] m-0 mb-1.5 text-[var(--ink)] cursor-pointer group-hover:text-[var(--clay)] transition-colors inline-block"
              >
                {story.title}
              </h3>
              <p className="m-0 mb-3 text-[var(--muted)] text-[0.92rem] leading-relaxed max-w-[54ch]">
                {story.teaser}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedStory(story)}
                  className="font-mono text-[0.75rem] text-[var(--slate)] hover:text-[var(--clay)] border-b border-[var(--slate)] hover:border-[var(--clay)] inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent p-0 pb-0.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read the story →</span>
                </button>
                <span className="font-mono text-[0.68rem] text-[var(--muted)] bg-[var(--paper-raised)] px-2 py-0.5 rounded-full border border-[var(--line)]">
                  PDF Article
                </span>
              </div>
            </div>

            {story.coverImage && !failedImages[story.id] && (
              <div
                onClick={() => setSelectedStory(story)}
                className="w-full sm:w-36 sm:h-24 h-40 rounded-[var(--radius)] overflow-hidden shrink-0 border border-[var(--line)] bg-[var(--paper-raised)] cursor-pointer"
                title={`Read ${story.title}`}
              >
                <img
                  src={story.coverImage}
                  alt={story.alt || story.title}
                  onError={() => setFailedImages((prev) => ({ ...prev, [story.id]: true }))}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}
          </article>
        ))}
      </div>

      {/* In-Site Online Story & PDF Reader Modal */}
      <StoryReaderModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </section>
  );
};
