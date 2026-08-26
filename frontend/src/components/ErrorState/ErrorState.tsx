import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-red-50/50 dark:bg-red-950/10 rounded-xl border border-red-200 dark:border-red-900/30 text-center shadow-sm max-w-xl mx-auto my-8">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4 animate-bounce">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-bold text-red-800 dark:text-red-350 mb-1">Unable to load referrals</h3>
      <p className="text-sm text-red-700 dark:text-red-400 max-w-sm mb-5 font-medium leading-relaxed">
        {message || 'An unexpected error occurred while communicating with the server.'}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm cursor-pointer"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
};
