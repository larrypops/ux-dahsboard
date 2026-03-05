
import React, { useState, useEffect } from 'react';
import { AdminStats, DashboardResponse, FilterType, DateRange } from '@/types';
import StatsCard from './StatsCard';
import FilterBar from './FilterBar';
import { fetchLumoraData } from '../services/lumoraService';
import { ToastType } from './Toast';

interface OverviewProps {
  showToast?: (message: string, type: ToastType) => void;
}

const Overview: React.FC<OverviewProps> = ({ showToast }) => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('month');
  const [productFilter, setProductFilter] = useState<string>('Tous les produits');
  const [customRange, setCustomRange] = useState<DateRange>({ start: '', end: '' });
  const [availableProducts, setAvailableProducts] = useState<string[]>(['Tous les produits']);

  const fetchData = async (isManual = false) => {
    setLoading(true);
    try {
      const response = await fetchLumoraData(filter, filter === 'custom' ? customRange : undefined, productFilter);
      setData(response);
      
      // Mettre à jour la liste des produits disponibles
      if (response.availableProducts) {
        const products = ['Tous les produits', ...response.availableProducts];
        // Éviter les doublons
        setAvailableProducts(prev => 
          JSON.stringify(prev) === JSON.stringify(products) ? prev : products
        );
      }
      
      if (isManual && showToast) {
        showToast('Instance PostgreSQL (Simulée) rafraîchie', 'success');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Erreur de connexion à lumora_db', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter !== 'custom') fetchData();
  }, [filter, productFilter]);

  // Debug log
  useEffect(() => {
    console.log('Overview - availableProducts:', availableProducts);
  }, [availableProducts]);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Lumora DB Live</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium flex items-center gap-2 mt-1">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Mode Simulation • 109.199.118.183
          </p>
        </div>
        <FilterBar 
          currentFilter={filter}
          onFilterChange={setFilter}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          onApplyCustom={() => fetchData(true)}
          selectedProduct={productFilter}
          onProductChange={setProductFilter}
          isLoading={loading}
          availableProducts={availableProducts}
        />
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {!data || loading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse h-32 shadow-sm"></div>) : (
          <>
            <StatsCard title="CA TOTAL REEL" value={data.stats.totalRevenue} isCurrency type="revenue" />
            <StatsCard title="COMMANDES SYNC" value={data.stats.totalOrders} type="orders" />
            <StatsCard title="TAUX SUCCÈS" value={`${data.stats.paymentSuccessRate.toFixed(1)}%`} type="rate" />
            <StatsCard title="ÉCHECS DB" value={data.stats.failedPayments} type="danger" />
            <StatsCard title="PANIER LUMORA" value={data.stats.averageBasket} isCurrency type="revenue" />
            <StatsCard title="TOP VENTE IA" value={data.stats.topProduct} type="product" />
            <StatsCard title="CLIENTS ACTIFS" value={data.stats.userCount} type="users" />
            <StatsCard title="LEADS LUMORA" value={data.stats.leadCount} type="users" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:gap-10">
        <div className="space-y-6 md:space-y-8">
           <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <svg className="w-24 md:w-32 h-24 md:h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             </div>
             <h3 className="text-[10px] md:text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-6">Status de Synchronisation</h3>
             <div className="space-y-4 md:space-y-6">
                <div className="p-4 md:p-5 bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/30">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7a2 2 0 012-2h12a2 2 0 012 2M4 7l8 5 8-5" /></svg>
                      </div>
                      <div className="overflow-hidden">
                         <p className="text-sm font-bold text-white truncate">Connexion PostgreSQL Live</p>
                         <p className="text-[9px] text-slate-500 font-mono truncate">109.199.118.183:5432/lumora_db</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                      <span className="text-[10px] font-black text-emerald-500 uppercase">Production</span>
                      <span className="text-[9px] text-slate-600 font-mono">PostgreSQL Active</span>
                   </div>
                </div>
                
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                         <p className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Source de Données</p>
                         <p className="text-sm font-black text-slate-900 dark:text-slate-100">PostgreSQL Live</p>
                      </div>
                      <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                         <p className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Etat du Pont</p>
                         <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter italic">API Déployée & Connectée</p>
                      </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
