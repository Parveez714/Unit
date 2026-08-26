import React from 'react';
import type { Referral } from '../../types/referral';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { Building2, Compass, Layers } from 'lucide-react';

interface ReferralTableProps {
  referrals: Referral[];
}

export const ReferralTable: React.FC<ReferralTableProps> = ({ referrals }) => {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-borders dark:border-zinc-800 shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-950/80 border-b border-borders dark:border-zinc-800">
              <th className="px-6 py-4 text-xs font-semibold text-descText dark:text-zinc-300 uppercase tracking-wider">
                Referral Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-descText dark:text-zinc-300 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-descText dark:text-zinc-300 uppercase tracking-wider">
                Lead Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-descText dark:text-zinc-300 uppercase tracking-wider">
                Opportunity Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borders dark:divide-zinc-800">
            {referrals.map((referral) => (
              <tr
                key={referral.id}
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150"
              >
                <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-[#1F2937] dark:text-zinc-100">
                  {referral.referralName}
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap text-sm text-[#4B5563] dark:text-zinc-400 font-normal">
                  {referral.project}
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <StatusBadge status={referral.leadStatus || 'Open'} />
                </td>
                <td className="px-6 py-4.5 whitespace-nowrap">
                  <StatusBadge status={referral.opportunityStatus || 'Pre-Sales'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {referrals.map((referral) => (
          <div
            key={referral.id}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-borders dark:border-zinc-800 shadow-sm hover:border-[#0066CC]/20 dark:hover:border-[#0066CC]/30 transition-all flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-base font-semibold text-[#1F2937] dark:text-zinc-100 leading-tight">
                {referral.referralName}
              </h4>
            </div>

            <div className="flex items-center text-xs text-descText dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium dark:text-zinc-300">
                <Building2 size={14} className="text-metadata" />
                {referral.project}
              </span>
            </div>

            <div className="h-[1px] bg-borders dark:bg-zinc-800 w-full my-1"></div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-metadata tracking-wider flex items-center gap-1">
                  <Compass size={11} /> Lead Status
                </span>
                <div>
                  <StatusBadge status={referral.leadStatus || 'Open'} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-metadata tracking-wider flex items-center gap-1">
                  <Layers size={11} /> Opportunity Status
                </span>
                <div>
                  <StatusBadge status={referral.opportunityStatus || 'Pre-Sales'} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
