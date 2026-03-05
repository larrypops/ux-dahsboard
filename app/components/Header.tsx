
import React from 'react';
import { User } from '@/types';

interface HeaderProps {
  user: User;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar }) => {
  return (
    <header className="h-16 md:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
      <div className="flex items-center space-x-3 md:space-x-6">
        <button onClick={toggleSidebar} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors">
          <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-2 md:space-x-3">
           <div className="relative">
             <div className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <div className="absolute inset-0 h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
           </div>
           <div className="flex flex-col">
             <span className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Sync</span>
             <span className="text-[10px] md:text-xs font-black text-slate-700 dark:text-slate-300 tracking-tight mt-0.5 truncate max-w-[120px] md:max-w-none">
              lumora_db
             </span>
           </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="hidden sm:flex flex-col items-end mr-1 md:mr-2">
          <span className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full mb-0.5">
            Real-time
          </span>
          <span className="text-[8px] md:text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">24ms</span>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4 pl-3 md:pl-6 border-l border-slate-100 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none">{user.name}</p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">Admin</p>
          </div>
          <div className="relative">
            <img
              src={user.avatar}
              className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl ring-2 md:ring-4 ring-slate-50 dark:ring-slate-800 border border-slate-200 dark:border-slate-700 object-cover"
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
