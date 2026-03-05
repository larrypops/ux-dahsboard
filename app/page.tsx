"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { User, AppView } from '../types';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import Performance from './components/Performance';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import Toast, { ToastType } from './components/Toast';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isGlobalRefreshing, setIsGlobalRefreshing] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('app_user', JSON.stringify(u));
    showToast(`Bienvenue, ${u.name}`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
    showToast('Déconnexion réussie', 'info');
  };

  const triggerGlobalRefresh = useCallback(() => {
    setIsGlobalRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setIsGlobalRefreshing(false);
      showToast('Données synchronisées avec succès', 'success');
    }, 1200);
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const renderView = () => {
    const commonProps = { showToast };
    switch (currentView) {
      case 'overview': return <Overview key={refreshKey} {...commonProps} />;
      case 'performance': return <Performance key={refreshKey} {...commonProps} />;
      case 'transactions': return <Transactions key={refreshKey} {...commonProps} />;
      case 'settings': return <Settings user={user} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400 dark:text-slate-600">
            <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-900 mb-6">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 italic uppercase">{currentView}</h2>
            <p className="max-w-xs mx-auto text-slate-500 font-medium">Ce module est en cours de développement.</p>
            <button onClick={() => setCurrentView('overview')} className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg">Retour</button>
          </div>
        );
    }
  };

  return (
    <div className="dark">
      <div className="flex h-screen overflow-hidden bg-[#fbfcfd] dark:bg-slate-950 font-inter text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={toast.isVisible} 
          onClose={hideToast} 
        />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          currentView={currentView} 
          onViewChange={(v) => setCurrentView(v)} 
          onLogout={handleLogout} 
          onGlobalRefresh={triggerGlobalRefresh}
          isRefreshing={isGlobalRefreshing}
        />
        <main className="flex-1 overflow-y-auto flex flex-col relative">
          <Header 
            user={user} 
            toggleSidebar={() => setIsSidebarOpen(true)} 
          />
          <div className="flex-1">{renderView()}</div>
        </main>
      </div>
    </div>
  );
}
