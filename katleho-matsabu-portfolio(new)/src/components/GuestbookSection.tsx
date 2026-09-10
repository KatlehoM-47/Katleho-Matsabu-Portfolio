import React, { useState, useEffect } from 'react';
import { GuestbookEntry } from '../types.ts';

export const GuestbookSection: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showComposer, setShowComposer] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [stampColor, setStampColor] = useState<string>('#B8622D');
  const [honeypot, setHoneypot] = useState<string>('');

  // Fetch guestbook entries
  useEffect(() => {
    let isMounted = true;
    async function fetchEntries() {
      try {
        const res = await fetch('/api/guestbook');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.entries)) {
          setEntries(data.entries);
        }
      } catch (err) {
        console.error('Failed to load postcards:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchEntries();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (trimmedName.length > 50) {
      setErrorMessage('Name must be 50 characters or fewer.');
      return;
    }
    if (!trimmedMessage || trimmedMessage.length < 3) {
      setErrorMessage('Please write a note (at least 3 characters).');
      return;
    }
    if (trimmedMessage.length > 280) {
      setErrorMessage('Note must be 280 characters or fewer.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
          location: location.trim() || undefined,
          stampColor,
          hp_website: honeypot, // Honeypot trap
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit postcard');
      }

      // Prepend newly submitted postcard without page reload
      if (data.entry) {
        setEntries((prev) => [data.entry, ...prev]);
      }

      setSuccessMessage('Postcard stamped and added!');
      setName('');
      setMessage('');
      setLocation('');
      setHoneypot('');
      setTimeout(() => {
        setShowComposer(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-13 border-t border-dashed border-[var(--line)]">
      {/* Header matching Robin's Postcards section */}
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 mb-8 items-start">
        <div>
          <h2 className="font-fraunces font-normal text-2xl text-[var(--ink)] m-0">Postcards</h2>
          <span className="font-mono text-[0.72rem] text-[var(--muted)] block mt-1">Guestbook</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <p className="m-0 text-[var(--muted)] text-[0.95rem] max-w-[46ch] leading-relaxed">
            This website is mostly me talking. This postcard gives you a chance to talk back — even just a line.
            Drop me a postcard. Tell me what you&apos;re thinking, where you&apos;re visiting from, or simply that you stopped by.
          </p>

          {/* New Postcard Circular Stamp Button */}
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="self-start shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--line)] hover:border-[var(--clay)] bg-[var(--paper-raised)] hover:bg-[var(--paper)] text-[var(--ink)] font-mono text-[0.75rem] cursor-pointer transition-all shadow-xs group"
            aria-expanded={showComposer}
            aria-label="Write a new postcard to the guestbook"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--clay)] group-hover:scale-125 transition-transform" />
            <span>{showComposer ? 'Close Composer' : 'Drop a Postcard ✎'}</span>
          </button>
        </div>
      </div>

      {/* Postcard Composer Form */}
      {showComposer && (
        <div className="mb-10 p-5 sm:p-7 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] postcard-card relative">
          <div className="flex justify-between items-start border-b border-[var(--line)] pb-3 mb-5">
            <div>
              <h3 className="font-fraunces font-medium text-lg m-0 text-[var(--ink)]">Write a Postcard</h3>
              <p className="font-mono text-[0.72rem] text-[var(--muted)] m-0 mt-0.5">
                Will be published on this page for all visitors to read.
              </p>
            </div>
            {/* Stamp preview in composer */}
            <div
              className="w-11 h-13 border border-dashed border-[var(--line)] flex flex-col items-center justify-center p-1 rounded-xs bg-[var(--paper)]"
              style={{ borderColor: stampColor }}
            >
              <div
                className="w-full h-full rounded-xs flex items-center justify-center text-[0.7rem] text-white font-mono"
                style={{ backgroundColor: stampColor }}
              >
                POST
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot anti-spam field (hidden from humans) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_website">Leave this empty</label>
              <input
                id="hp_website"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postcard-name" className="block font-mono text-[0.75rem] text-[var(--muted)] mb-1">
                  Your Name <span className="text-[var(--clay)]">*</span>
                </label>
                <input
                  id="postcard-name"
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. Robin or Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-[var(--radius)] bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--clay)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="postcard-location" className="block font-mono text-[0.75rem] text-[var(--muted)] mb-1">
                  Location / City <span className="text-[var(--muted)] opacity-60">(optional)</span>
                </label>
                <input
                  id="postcard-location"
                  type="text"
                  maxLength={50}
                  placeholder="e.g. Johannesburg, Berlin"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-[var(--radius)] bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--clay)] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="postcard-message" className="font-mono text-[0.75rem] text-[var(--muted)]">
                  Your Note <span className="text-[var(--clay)]">*</span>
                </label>
                <span className="font-mono text-[0.68rem] text-[var(--muted)]">
                  {message.length} / 280
                </span>
              </div>
              <textarea
                id="postcard-message"
                required
                rows={3}
                maxLength={280}
                placeholder="Say hello, mention a favorite project or sketch, or just drop a kind word..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base rounded-[var(--radius)] bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] focus:border-[var(--clay)] font-handwriting text-lg leading-relaxed resize-y transition-colors"
              />
            </div>

            {/* Stamp Color Choice */}
            <div className="flex items-center gap-3 pt-1">
              <span className="font-mono text-[0.72rem] text-[var(--muted)]">Stamp ink:</span>
              <div className="flex items-center gap-2">
                {[
                  { color: '#B8622D', label: 'Terracotta' },
                  { color: '#3E5C76', label: 'Slate' },
                  { color: '#5B7065', label: 'Sage' },
                  { color: '#8A5B70', label: 'Plum' },
                ].map((s) => (
                  <button
                    key={s.color}
                    type="button"
                    onClick={() => setStampColor(s.color)}
                    className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                      stampColor === s.color ? 'scale-125 ring-2 ring-[var(--ink)] ring-offset-1' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: s.color }}
                    title={s.label}
                    aria-label={`Select ${s.label} stamp color`}
                  />
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
                {successMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 font-mono text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-[var(--radius)] bg-[var(--clay)] text-white hover:opacity-90 font-mono text-xs cursor-pointer disabled:opacity-50 transition-opacity flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mailing...</span>
                  </>
                ) : (
                  <>
                    <span>Send Postcard</span>
                    <span>✉</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Postcards List Display */}
      {isLoading ? (
        <div className="py-8 text-center font-mono text-xs text-[var(--muted)]">
          Reading postcards from archive...
        </div>
      ) : entries.length === 0 ? (
        <div className="py-8 text-center font-mono text-xs text-[var(--muted)] border border-dashed border-[var(--line)] rounded p-6">
          No postcards yet. Be the first to drop a note!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="postcard-card rounded-[var(--radius)] p-5 relative overflow-hidden flex flex-col justify-between min-h-[190px] transition-transform hover:-translate-y-0.5 duration-200"
              style={{
                backgroundColor: 'var(--paper-raised)',
              }}
            >
              {/* Postage Stamp & Cancellation mark in top-right */}
              <div className="absolute top-4 right-4 flex items-start">
                {/* Wavy Postmark */}
                <svg
                  className="w-11 h-11 text-[var(--muted)] opacity-35 -mr-3 -mt-1 pointer-events-none select-none"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <circle cx="50" cy="50" r="40" strokeDasharray="6 3" />
                  <text x="50" y="46" textAnchor="middle" fontSize="11" fill="currentColor" fontFamily="monospace">POST</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="monospace">2026</text>
                  <path d="M 0 50 Q 25 35, 50 50 T 100 50" />
                </svg>

                {/* Stamp */}
                <div
                  className="w-9 h-11 border border-dashed border-[var(--line)] p-0.5 bg-[var(--paper)] shadow-2xs rotate-2 flex flex-col items-center justify-center shrink-0"
                  style={{
                    borderColor: entry.stampColor || 'var(--clay)',
                  }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center text-[0.55rem] text-white font-mono font-bold tracking-tighter"
                    style={{ backgroundColor: entry.stampColor || 'var(--clay)' }}
                  >
                    KM
                  </div>
                </div>
              </div>

              {/* Handwritten Note Body */}
              <div className="pr-14 mb-6">
                <p className="font-handwriting text-xl sm:text-[1.32rem] leading-[1.4] text-[var(--ink)] m-0 select-text break-words">
                  {entry.message}
                </p>
              </div>

              {/* Postcard Footer: From & Date */}
              <div className="pt-3 border-t border-[var(--line)] flex items-end justify-between font-mono text-[0.74rem] text-[var(--muted)]">
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-[var(--muted)] opacity-70">
                    From:
                  </div>
                  <div className="font-semibold text-[var(--ink)] font-sans text-[0.88rem] flex items-center gap-1">
                    <span>{entry.name}</span>
                    {entry.location && (
                      <span className="font-mono text-[0.7rem] font-normal text-[var(--muted)]">
                        ({entry.location})
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[0.65rem] uppercase tracking-wider text-[var(--muted)] opacity-70">
                    Date:
                  </div>
                  <div className="text-[0.72rem]">{entry.dateFormatted}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
