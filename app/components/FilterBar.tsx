
import React from 'react';
import { FilterType, DateRange } from '@/types';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
  onApplyCustom: () => void;
  selectedProduct: string;
  onProductChange: (product: string) => void;
  isLoading?: boolean;
  availableProducts?: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  customRange,
  onCustomRangeChange,
  onApplyCustom,
  selectedProduct,
  onProductChange,
  isLoading,
  availableProducts
}) => {
  const dateFilters: { label: string; value: FilterType }[] = [
    { label: 'J', value: 'day' },
    { label: 'S', value: 'week' },
    { label: 'M', value: 'month' },
    { label: 'A', value: 'year' },
    { label: 'T', value: 'all' },
    { label: 'P', value: 'custom' },
  ];

  const fullLabels: Record<FilterType, string> = {
    day: 'Jour',
    week: 'Semaine',
    month: 'Mois',
    year: 'Année',
    all: 'Tout',
    custom: 'Perso'
  };

  const defaultProducts = [
    "Tous les produits",
    "Lumora Premium",
    "Sync Engine v2",
    "Gemini AI Bridge",
    "Audit de Base",
    "API Key Pro"
  ];

  const products = availableProducts && availableProducts.length > 0 ? availableProducts : defaultProducts;
  
  // Debug log
  console.log('FilterBar - availableProducts:', availableProducts);
  console.log('FilterBar - products to display:', products);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 md:gap-4 bg-white dark:bg-slate-900 p-2 md:p-3 rounded-2xl md:rounded-[28px] shadow-sm border border-slate-100 dark:border-slate-800 ring-1 ring-slate-900/5 dark:ring-white/5 transition-colors w-full lg:w-auto">
      {/* Date Selectors */}
      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 md:p-1.5 rounded-xl md:rounded-[20px] w-full sm:w-auto overflow-x-auto no-scrollbar">
        {dateFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            disabled={isLoading}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-[10px] md:text-[11px] font-black transition-all whitespace-nowrap ${
              currentFilter === f.value
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 active:scale-95'
            }`}
          >
            <span className="hidden md:inline">{fullLabels[f.value].toUpperCase()}</span>
            <span className="md:hidden">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Product Selector */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 md:p-1.5 rounded-xl md:rounded-[20px] w-full sm:min-w-[180px]">
        <div className="pl-3">
          <svg className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <select
          value={selectedProduct}
          onChange={(e) => onProductChange(e.target.value)}
          disabled={isLoading}
          className="bg-transparent text-[10px] md:text-[11px] font-black text-slate-600 dark:text-slate-400 outline-none pr-4 cursor-pointer uppercase tracking-wider flex-1"
        >
          {products.map((p) => (
            <option key={p} value={p} className="dark:bg-slate-900">{p}</option>
          ))}
        </select>
      </div>

      {currentFilter === 'custom' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-3 py-2 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl md:rounded-2xl animate-in slide-in-from-top-4 sm:slide-in-from-right-4 duration-500 border border-indigo-100 dark:border-indigo-500/20 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="date"
              value={customRange.start}
              onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
              className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-2 rounded-lg outline-none ring-1 ring-indigo-200 dark:ring-indigo-500/30 focus:ring-2 focus:ring-indigo-400 transition flex-1"
            />
            <span className="text-indigo-300 dark:text-indigo-500 font-black text-[9px]">AU</span>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
              className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-2 rounded-lg outline-none ring-1 ring-indigo-200 dark:ring-indigo-500/30 focus:ring-2 focus:ring-indigo-400 transition flex-1"
            />
          </div>
          <button
            onClick={onApplyCustom}
            disabled={isLoading || !customRange.start || !customRange.end}
            className="py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg md:rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600 transition active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
