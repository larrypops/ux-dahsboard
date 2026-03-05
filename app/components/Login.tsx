
import React, { useState } from 'react';
import { User } from '@/types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Identifiants mis à jour selon la demande de l'utilisateur
    if (username === 'admin' && password === 'NMI2003lArry') {
      onLogin({
        id: 'lumora_admin_1',
        email: 'admin@lumora.db',
        name: 'Lumora Administrator',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=Lumora`,
        role: 'admin',
        is_verified: true,
        email_status: 'verified',
        created_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      setError('Identifiants invalides. Veuillez vérifier votre nom d\'utilisateur et votre code secret.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 md:p-6 relative overflow-y-auto">
      {/* Background decoration */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 p-8 md:p-10 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800 my-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7a2 2 0 012-2h12a2 2 0 012 2M4 7l8 5 8-5" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Lumora Data</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">Instance Postgres 109.199.118.183</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl animate-in shake-in">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Utilisateur</label>
            <input
              type="text"
              required
              className="block w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 transition-all"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Code Secret</label>
            <input
              type="password"
              required
              className="block w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-2xl bg-indigo-600 py-4 font-black text-sm text-white uppercase tracking-widest transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-none active:scale-95"
          >
            Accéder au Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Lumora Engine v4.2.1 • SSL Secured
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
