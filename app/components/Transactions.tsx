
import React, { useState, useEffect } from 'react';
import { Order, DashboardResponse, FilterType, DateRange } from '@/types';
import DataTable from './DataTable';
import FilterBar from './FilterBar';
import { fetchLumoraData } from '../services/lumoraService';

const Transactions: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [productFilter, setProductFilter] = useState<string>('Tous les produits');
  const [customRange, setCustomRange] = useState<DateRange>({ start: '', end: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchLumoraData(filter, filter === 'custom' ? customRange : undefined, productFilter);
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter !== 'custom') fetchData();
  }, [filter, productFilter]);

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto transition-colors">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Transactions Réelles</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Flux direct depuis lumora_db @ 109.199.118.183</p>
        </div>
        <FilterBar 
          currentFilter={filter}
          onFilterChange={setFilter}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          onApplyCustom={fetchData}
          selectedProduct={productFilter}
          onProductChange={setProductFilter}
          isLoading={loading}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px] relative transition-colors">
        {loading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <div className="animate-spin h-10 w-10 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 rounded-full"></div>
               <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Querying 109.199.118.183...</span>
            </div>
          </div>
        )}
        <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sync Active • PostgreSQL v16.4</span>
            </div>
          </div>
        </div>
        <div className="p-2">
          <DataTable data={data?.orders || []} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
