
import React from 'react';
import { User } from '@/types';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto transition-colors">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Paramètres</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gérez vos préférences de compte et la synchronisation Lumora DB.</p>
      </div>

      <div className="grid gap-8 pb-12">
        {/* Profile Section */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">Profil Administrateur</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-24 h-24 rounded-[24px] object-cover ring-8 ring-slate-50 dark:ring-slate-800 border-2 border-white dark:border-slate-700"
              />
              <button className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition active:scale-90">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
            <div className="space-y-1 flex-1 text-center sm:text-left">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Compte: lumoradat_admin</p>
              <div className="pt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-full">Root Privilege</span>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase rounded-full">DB Owner</span>
              </div>
            </div>
          </div>
        </section>

        {/* Database Configuration */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lumora PostgreSQL Core</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Synchronisé @ 109.199.118.183</span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Instance Host (Postgres URL)</label>
              <div className="relative group">
                <input 
                  type="text" 
                  readOnly 
                  value="postgresql://postgres:pops2356%23@109.199.118.183:5432/lumora_db" 
                  className="w-full bg-slate-900 dark:bg-black border border-slate-800 rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-sm font-mono text-indigo-400 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all shadow-inner overflow-hidden text-ellipsis"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[24px]">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Base de données</p>
                <p className="text-base font-black text-slate-800 dark:text-slate-200">lumora_db</p>
              </div>
              <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[24px]">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Port de communication</p>
                <p className="text-base font-black text-slate-800 dark:text-slate-200">5432 (SSL)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security / Password change */}
        <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">Sécurité du Compte</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100">Mot de passe secret</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Dernière modification: 12 Mai 2024</p>
                   </div>
                </div>
                <button className="hidden sm:block px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition">Modifier</button>
             </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button className="flex-1 py-5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95">
            Synchroniser les changements
          </button>
          <button className="px-10 py-5 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-black text-sm uppercase tracking-widest rounded-[24px] hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95">
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
