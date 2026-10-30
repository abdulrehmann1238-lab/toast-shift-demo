import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationMs = 1800
}) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    'Preparing your workspace...',
    'Organizing today\'s operations...',
    'Loading shift information...'
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (elapsed > durationMs * 0.6) {
        setMessageIndex(2);
      } else if (elapsed > durationMs * 0.3) {
        setMessageIndex(1);
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F6F2] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-300">
      <div className="max-w-xs w-full flex flex-col items-center text-center">
        {/* Logo / Badge */}
        <div className="w-12 h-12 rounded-2xl bg-brand-sidebar text-white flex items-center justify-center mb-6 shadow-elevated border border-stone-800">
          <svg
            className="w-6 h-6 text-brand-sage-soft"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        {/* Wordmark */}
        <h1 className="text-xl font-heading font-bold tracking-[0.2em] text-brand-text mb-1">
          SERVICE DESK
        </h1>
        <p className="text-xs uppercase tracking-widest text-brand-text-secondary font-medium mb-8">
          Restaurant Operations
        </p>

        {/* Circular indicator / spinner */}
        <div className="relative w-14 h-14 mb-8 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#E8E6DF"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#758775"
              strokeWidth="3"
              fill="none"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (125.6 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-100 ease-out"
            />
          </svg>
          <span className="absolute text-xs font-semibold tabular-nums text-brand-text">
            {progress}%
          </span>
        </div>

        {/* Subtle horizontal progress bar */}
        <div className="w-48 h-1 bg-[#E8E6DF] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-brand-sage rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic rotating message */}
        <p className="text-xs font-medium text-brand-text-secondary h-5 transition-opacity duration-200">
          {messages[messageIndex]}
        </p>
      </div>

      <div className="absolute bottom-6 text-[11px] text-brand-text-secondary tracking-wide">
        The Copper Room – Las Vegas
      </div>
    </div>
  );
};

