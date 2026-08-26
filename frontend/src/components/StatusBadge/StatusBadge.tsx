import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status.trim().toLowerCase();

  let styles = {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-800 dark:text-zinc-200'
  };

  switch (normalizedStatus) {
    // Lead Statuses
    case 'open':
      styles = { bg: 'bg-[#EFF6FF] dark:bg-blue-950/40', text: 'text-[#1E40AF] dark:text-blue-400' };
      break;
    case 'contacted':
      styles = { bg: 'bg-[#EEF2FF] dark:bg-indigo-950/40', text: 'text-[#3730A3] dark:text-indigo-400' };
      break;
    case 'qualified':
      styles = { bg: 'bg-[#ECFDF5] dark:bg-emerald-950/40', text: 'text-[#065F46] dark:text-emerald-400' };
      break;
    case 'unqualified':
      styles = { bg: 'bg-[#FEF2F2] dark:bg-rose-950/40', text: 'text-[#991B1B] dark:text-rose-400' };
      break;
    case 'converted':
      styles = { bg: 'bg-[#F5F3FF] dark:bg-purple-950/40', text: 'text-[#5B21B6] dark:text-purple-400' };
      break;
    case 'dnd':
      styles = { bg: 'bg-[#FFF7ED] dark:bg-orange-950/40', text: 'text-[#9A3412] dark:text-orange-400' };
      break;

    // Opportunity Stages
    case 'site visit / walk in':
    case 'site visit/walk in':
      styles = { bg: 'bg-[#F0F9FF] dark:bg-sky-950/40', text: 'text-[#075985] dark:text-sky-400' };
      break;
    case 'blocked':
      styles = { bg: 'bg-[#FFF1F2] dark:bg-rose-950/45', text: 'text-[#9F1239] dark:text-rose-400' };
      break;
    case 'pre-sales':
    case 'presales':
      styles = { bg: 'bg-[#FFFBEB] dark:bg-amber-950/40', text: 'text-[#92400E] dark:text-amber-400' };
      break;
    case 'booking':
      styles = { bg: 'bg-[#F0FDFA] dark:bg-teal-950/40', text: 'text-[#0F766E] dark:text-teal-400' };
      break;
    case 'closed lost':
      styles = { bg: 'bg-[#F8FAFC] dark:bg-slate-800/60', text: 'text-[#475569] dark:text-slate-400' };
      break;
    case 'booking cancellation':
      styles = { bg: 'bg-[#FFF5F5] dark:bg-red-950/40', text: 'text-[#C53030] dark:text-red-400' };
      break;
    case 'closed won':
      styles = { bg: 'bg-[#F0FDF4] dark:bg-green-950/40', text: 'text-[#166534] dark:text-green-400' };
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${styles.bg} ${styles.text}`}>
      {status}
    </span>
  );
};
