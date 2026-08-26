import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface ReferralFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedProject: string;
  onProjectChange: (value: string) => void;
  selectedLeadStatus: string;
  onLeadStatusChange: (value: string) => void;
  selectedOpportunityStatus: string;
  onOpportunityStatusChange: (value: string) => void;
  projectsList: string[];
  onClearFilters: () => void;
}

export const ReferralFilters: React.FC<ReferralFiltersProps> = ({
  search,
  onSearchChange,
  selectedProject,
  onProjectChange,
  selectedLeadStatus,
  onLeadStatusChange,
  selectedOpportunityStatus,
  onOpportunityStatusChange,
  projectsList,
  onClearFilters
}) => {
  const leadStatuses = ['All Lead Statuses', 'Open', 'Contacted', 'Qualified', 'Unqualified', 'Converted', 'DND'];
  const opportunityStatuses = [
    'All Opportunity Stages',
    'Site Visit / Walk in',
    'Blocked',
    'Pre-Sales',
    'Booking',
    'Closed Lost',
    'Booking Cancellation',
    'Closed Won'
  ];

  const hasActiveFilters =
    search !== '' ||
    selectedProject !== 'All Projects' ||
    selectedLeadStatus !== 'All Lead Statuses' ||
    selectedOpportunityStatus !== 'All Opportunity Stages';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-borders dark:border-zinc-800 p-4 md:p-6 mb-6 shadow-sm">
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-metadata pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search referrals by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-borders dark:border-zinc-800 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:bg-white focus:dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          
          {/* Project Filter */}
          <div className="w-full sm:w-auto relative">
            <select
              value={selectedProject}
              onChange={(e) => onProjectChange(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-borders dark:border-zinc-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] cursor-pointer appearance-none pr-8 text-zinc-900 dark:text-zinc-100"
            >
              <option value="All Projects">All Projects</option>
              {projectsList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-descText dark:text-zinc-400">
              <Filter size={12} />
            </div>
          </div>

          {/* Lead Status Filter */}
          <div className="w-full sm:w-auto relative">
            <select
              value={selectedLeadStatus}
              onChange={(e) => onLeadStatusChange(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-borders dark:border-zinc-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] cursor-pointer appearance-none pr-8 text-zinc-900 dark:text-zinc-100"
            >
              {leadStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-descText dark:text-zinc-400">
              <Filter size={12} />
            </div>
          </div>

          {/* Opportunity Status Filter */}
          <div className="w-full sm:w-auto relative">
            <select
              value={selectedOpportunityStatus}
              onChange={(e) => onOpportunityStatusChange(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-borders dark:border-zinc-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] cursor-pointer appearance-none pr-8 text-zinc-900 dark:text-zinc-100"
            >
              {opportunityStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-descText dark:text-zinc-400">
              <Filter size={12} />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-borders dark:border-zinc-700 text-xs font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800 text-descText dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-mainText dark:hover:text-zinc-100 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw size={13} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
