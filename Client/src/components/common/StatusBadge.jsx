import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const statusConfig = {
    // Inquiry statuses
    New: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    Contacted: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    Qualified: { bg: 'bg-[#0AE3DA]/10 text-[#0AE3DA] border-[#0AE3DA]/30' },
    'Proposal Sent': { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    Converted: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    Closed: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },

    // Project statuses
    Planning: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    'In Progress': { bg: 'bg-[#0AE3DA]/10 text-[#0AE3DA] border-[#0AE3DA]/30' },
    Review: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    'On Hold': { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    Completed: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    Cancelled: { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },

    // Milestone statuses
    Pending: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },

    // General user/account status
    active: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    suspended: { bg: 'bg-red-500/10 text-red-400 border-red-500/30' },
    published: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    draft: { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
  };

  const current = statusConfig[status] || { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' };
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${sizeClasses} ${current.bg} whitespace-nowrap`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;

