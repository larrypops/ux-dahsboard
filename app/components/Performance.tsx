import React, { useState, useEffect } from 'react';
import { DashboardResponse, FilterType, DateRange } from '@/types';
import DashboardCharts from './DashboardCharts';
import FilterBar from './FilterBar';
import { fetchLumoraData } from '../services/lumoraService';

const Performance: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('month');
  const [productFilter, setProductFilter] = useState<string>('Tous les produits');
  const [customRange, setCustomRange] = useState<DateRange>({ start: '', end: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchLumoraData(
        filter, 
        filter === 'custom' ? customRange : undefined, 
        productFilter
      );
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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Analyses Graphiques</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Visualisation détaillée des tendances et distributions.</p>
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

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {Array.from({length: 4}).map((_, i) => (
             <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm h-[480px] animate-pulse"></div>
           ))}
        </div>
      ) : (
        <div className="pb-12">
          {data && (
            <DashboardCharts 
              revenueData={data.charts.revenueEvolution}
              ordersData={data.charts.ordersHistogram}
              paymentData={data.charts.paymentDistribution}
              productsData={data.charts.topProducts}
              countryData={data.charts.ordersByCountry}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Performance;