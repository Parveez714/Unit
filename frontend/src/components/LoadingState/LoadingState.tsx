import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-ink-900 rounded-xl border border-borders dark:border-ink-800 overflow-hidden shadow-sm animate-pulse">
      {/* Table Header Skeleton */}
      <div className="hidden md:flex bg-shell dark:bg-ink-950/80 border-b border-borders dark:border-ink-800 px-6 py-4">
        <div className="w-1/4 h-4 bg-ink-200 dark:bg-ink-800 rounded"></div>
        <div className="w-1/4 h-4 bg-ink-200 dark:bg-ink-800 rounded ml-4"></div>
        <div className="w-1/4 h-4 bg-ink-200 dark:bg-ink-800 rounded ml-4"></div>
        <div className="w-1/4 h-4 bg-ink-200 dark:bg-ink-800 rounded ml-4"></div>
      </div>

      {/* Skeleton Rows */}
      <div className="divide-y divide-borders dark:divide-ink-800">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex flex-col md:flex-row p-6 md:px-6 md:py-5 justify-between gap-4 md:gap-0"
          >
            {/* Name/Primary */}
            <div className="md:w-1/4 space-y-2">
              <div className="h-5 bg-ink-200 dark:bg-ink-800 rounded w-2/3"></div>
              <div className="h-3.5 bg-ink-100 dark:bg-ink-850 rounded w-1/2 md:hidden"></div>
            </div>

            {/* Project */}
            <div className="md:w-1/4">
              <div className="h-4 bg-ink-150 dark:bg-ink-800 rounded w-1/2 hidden md:block"></div>
            </div>

            {/* Unit */}
            <div className="md:w-1/4">
              <div className="h-4 bg-ink-150 dark:bg-ink-800 rounded w-1/3 hidden md:block"></div>
            </div>

            {/* Status */}
            <div className="md:w-1/4 flex justify-between md:justify-start items-center">
              <div className="h-6 bg-ink-200 dark:bg-ink-800 rounded-full w-20"></div>
              <div className="h-4 bg-ink-100 dark:bg-ink-850 rounded w-1/4 md:hidden"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
