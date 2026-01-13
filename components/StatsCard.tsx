
import React from 'react';
import { formatFCFA } from '../services/lumoraService';

interface StatsCardProps {
  title: string;
  value: string | number;
  isCurrency?: boolean;
  type: 'revenue' | 'orders' | 'users' | 'rate' | 'danger' | 'product';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, isCurrency, type }) => {
  const displayValue = typeof value === 'number' && isCurrency ? formatFCFA(value) : value;

  const icons = {
    revenue: (
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    orders: (
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    users: (
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    rate: (
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    danger: (
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    product: (
      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  };

  const colors = {
    revenue: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    orders: 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400',
    users: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400',
    rate: 'text-violet-600 bg-violet-50 border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400',
    danger: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400',
    product: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 md:p-3 rounded-xl border ${colors[type]}`}>
          {icons[type]}
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="space-y-1">
        <h4 className="text-slate-400 dark:text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] leading-tight">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white truncate">
            {displayValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
