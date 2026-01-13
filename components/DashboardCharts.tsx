
import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { ChartDataPoint, StatusDistribution, ProductPerformance } from '../types';
import { formatFCFA } from '../services/lumoraService';

interface DashboardChartsProps {
  revenueData: ChartDataPoint[];
  ordersData: ChartDataPoint[];
  paymentData: StatusDistribution[];
  productsData: ProductPerformance[];
}

const CustomTooltip = ({ active, payload, label, isCurrency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md p-3 md:p-4 border border-slate-700 dark:border-slate-600 shadow-2xl rounded-2xl ring-1 ring-white/10">
        <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-2 tracking-[0.2em]">{label}</p>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }}></div>
           <p className="text-base md:text-lg font-black text-white">
            {isCurrency ? formatFCFA(payload[0].value) : `${payload[0].value.toLocaleString()} unités`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  revenueData, ordersData, paymentData, productsData 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 pb-12 transition-colors">
      {/* 1. Évolution des Revenus */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] transition-all duration-500 group">
        <div className="flex flex-col mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-4 w-4 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform"></div>
            <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
              Flux Financier (XAF)
            </h3>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium ml-7">Performance historique des revenus nets.</p>
        </div>
        <div className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 9, fontWeight: '700', fill: '#94a3b8'}}
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 9, fontWeight: '700', fill: '#94a3b8'}}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip isCurrency />} cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4f46e5" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
                animationDuration={2500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Volumes de Transactions */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.08)] transition-all duration-500 group">
        <div className="flex flex-col mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-4 w-4 rounded-lg bg-violet-600 shadow-lg shadow-violet-200 group-hover:rotate-12 transition-transform"></div>
            <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
              Volume d'Activité
            </h3>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium ml-7">Quantité de commandes quotidiennes.</p>
        </div>
        <div className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 9, fontWeight: '700', fill: '#94a3b8'}}
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 9, fontWeight: '700', fill: '#94a3b8'}}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.05, radius: 10 }} />
              <Bar 
                dataKey="value" 
                fill="#818cf8" 
                radius={[8, 8, 2, 2]} 
                barSize={12} 
                animationDuration={2000} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Santé de la Passerelle */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-500 group">
        <div className="flex flex-col mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-4 w-4 rounded-lg bg-emerald-500 shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform"></div>
            <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
              Qualité de Conversion
            </h3>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium ml-7">Analyse de la fiabilité des paiements.</p>
        </div>
        <div className="h-[350px] md:h-[420px] w-full flex items-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={8}
                dataKey="value"
                stroke="none"
                animationBegin={300}
                animationDuration={2000}
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                iconType="rect" 
                iconSize={10}
                wrapperStyle={{ 
                  fontSize: '9px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  paddingTop: '20px', 
                  color: '#64748b',
                  letterSpacing: '0.1em'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px] md:mt-[-40px]">
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">MIX</span>
            <span className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">LIVE</span>
          </div>
        </div>
      </div>

      {/* 4. Top Produits */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)] transition-all duration-500 group">
        <div className="flex flex-col mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-4 w-4 rounded-lg bg-amber-500 shadow-lg shadow-amber-200 group-hover:rotate-12 transition-transform"></div>
            <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
              Top Catalog
            </h3>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium ml-7">Les 5 produits les plus plébiscités.</p>
        </div>
        <div className="h-[350px] md:h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={productsData} margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="6 6" horizontal={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                tick={{ fontSize: 9, fontWeight: '900', fill: '#475569' }} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip cursor={{fill: '#f8fafc', opacity: 0.05}} content={<CustomTooltip />} />
              <Bar 
                dataKey="orders" 
                fill="#4f46e5" 
                radius={[0, 15, 15, 0]} 
                barSize={18} 
                animationDuration={2800}
                label={{ 
                  position: 'right', 
                  fill: '#64748b', 
                  fontSize: 10, 
                  fontWeight: '900',
                  formatter: (val: number) => `${val}`,
                  dx: 5
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
