import React from 'react';
import { ClipboardX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFilterActive?: boolean;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  isFilterActive, 
  onClearFilters 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-xl border border-borders dark:border-zinc-800 text-center shadow-sm max-w-xl mx-auto my-8">
      <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-950 border border-borders dark:border-zinc-800 rounded-full flex items-center justify-center text-metadata mb-4">
        <ClipboardX size={28} />
      </div>
      <h3 className="text-lg font-bold text-mainText dark:text-zinc-100 mb-6">
        {isFilterActive ? 'No referrals found matching the selected filters' : 'No referrals found'}
      </h3>
      {isFilterActive && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052a3] text-white rounded-lg text-xs md:text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          <RotateCcw size={16} />
          Clear Active Filters
        </button>
      )}
    </div>
  );
};
