import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-white dark:bg-ink-900 rounded-xl border-2 border-ink-950 dark:border-white text-center shadow-md max-w-xl mx-auto my-8">
      <div className="w-12 h-12 bg-ink-950 dark:bg-white border border-ink-950 dark:border-white rounded-full flex items-center justify-center text-white dark:text-ink-950 mb-4 animate-bounce">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-bold text-mainText dark:text-white mb-1">Unable to load referrals</h3>
      <p className="text-sm text-descText dark:text-ink-400 max-w-sm mb-5 font-medium leading-relaxed">
        {message || 'An unexpected error occurred while communicating with the server.'}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-ink-700 to-ink-950 text-white hover:from-ink-600 hover:to-black dark:bg-white dark:bg-none dark:text-ink-950 dark:hover:bg-ink-100 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm cursor-pointer"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
};
