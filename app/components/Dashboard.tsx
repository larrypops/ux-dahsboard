import React, { useState, useEffect } from 'react';
import { DashboardResponse, DateRange } from '@/types';
import StatsCard from './StatsCard';
import DataTable from './DataTable';
import DashboardCharts from './DashboardCharts';
import { fetchLumoraData } from '../services/lumoraService';

type FilterType = 'day' | 'week' | 'month' | 'year' | 'custom' | 'all';

const DashboardContent: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('month');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [selectedProduct, setSelectedProduct] = useState<string>('Tous les produits');
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    let range: DateRange | undefined;

    if (filter === 'custom' && customRange.start && customRange.end) {
      range = { start: customRange.start, end: customRange.end };
    }

    try {
      const response = await fetchLumoraData(
        filter, 
        range, 
        selectedProduct !== 'Tous les produits' ? selectedProduct : undefined
      );
      
      console.log('Data fetched:', {
        totalRevenue: response.stats.totalRevenue,
        totalOrders: response.stats.totalOrders,
        countryData: response.charts.ordersByCountry?.length,
      });
      
      setData(response);
      
      if (response.availableProducts) {
        setAvailableProducts(['Tous les produits', ...response.availableProducts]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter !== 'custom') {
      fetchData();
    }
  }, [filter, selectedProduct]);

  const handleCustomFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-full max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header avec filtres */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
            Performance Engine
          </h1>
          <p className="text-slate-500 text-sm font-medium">Analyse temps réel de votre base de données Postgres.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1 rounded-xl">
            {(['day', 'week', 'month', 'year', 'all', 'custom'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                  filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f === 'day' ? 'Jour' : f === 'week' ? 'Semaine' : f === 'month' ? 'Mois' : f === 'year' ? 'Année' : f === 'all' ? 'Tout' : 'Perso'}
              </button>
            ))}
          </div>

          {filter === 'custom' && (
            <form onSubmit={handleCustomFilterSubmit} className="flex items-center gap-2 px-2 animate-in slide-in-from-right-4 duration-300">
              <input 
                type="date" 
                className="text-xs p-2 bg-slate-50 border-none outline-none rounded-lg font-bold text-slate-700" 
                required
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <span className="text-slate-300 font-bold">/</span>
              <input 
                type="date" 
                className="text-xs p-2 bg-slate-50 border-none outline-none rounded-lg font-bold text-slate-700" 
                required
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
              />
              <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </form>
          )}

          <div className="h-6 w-px bg-slate-100 mx-1"></div>

          <div className="relative">
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setTimeout(() => fetchData(), 100);
              }}
              className="appearance-none bg-slate-50 border-none outline-none rounded-lg text-xs font-bold text-slate-700 px-3 py-2 pr-8 cursor-pointer hover:bg-slate-100 transition-colors"
              disabled={loading}
            >
              {availableProducts.length > 0 ? (
                availableProducts.map((product) => (
                  <option key={product} value={product}>{product}</option>
                ))
              ) : (
                <option value="Tous les produits">Tous les produits</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-100 mx-1"></div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-50 transition active:scale-95 disabled:opacity-50"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>ACTUALISER</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {!data || loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-32 shadow-sm"></div>
          ))
        ) : (
          <>
            <StatsCard title="Chiffre d'affaires total" value={data.stats.totalRevenue} isCurrency type="revenue" />
            <StatsCard title="Nombre de commandes" value={data.stats.totalOrders} type="orders" />
            <StatsCard title="Paiements réussis (%)" value={`${data.stats.paymentSuccessRate.toFixed(1)}%`} type="rate" />
            <StatsCard title="Paiements échoués" value={data.stats.failedPayments} type="danger" />
            <StatsCard title="Panier moyen" value={data.stats.averageBasket} isCurrency type="revenue" />
            <StatsCard title="Produit top" value={data.stats.topProduct} type="product" />
            <StatsCard title="Utilisateurs (période)" value={data.stats.userCount} type="users" />
            <StatsCard title="Leads capturés" value={data.stats.leadCount} type="users" />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-8 h-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Santé de la base</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">EN LIGNE</span>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Temps de réponse moyen</span>
                   <span className="font-bold text-slate-900">42ms</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-indigo-500 h-full w-[85%]"></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Utilisation Storage</span>
                   <span className="font-bold text-slate-900">2.4 GB / 10 GB</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-amber-400 h-full w-[24%]"></div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {!loading && data && (
            <DashboardCharts 
              revenueData={data.charts.revenueEvolution}
              ordersData={data.charts.ordersHistogram}
              paymentData={data.charts.paymentDistribution}
              productsData={data.charts.topProducts}
              countryData={data.charts.ordersByCountry}
            />
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-md">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Flux de Transactions</h2>
            <p className="text-xs text-slate-400 font-medium">Analyse granulaire des 10 derniers événements Postgres.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase">Live Monitoring</span>
             </div>
             <button className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition uppercase tracking-widest border-b-2 border-indigo-100 hover:border-indigo-600 pb-0.5">
               Tout exporter
             </button>
          </div>
        </div>
        
        <div className="relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
               <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching DB...</span>
               </div>
            </div>
          )}
          <DataTable data={data?.orders || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;