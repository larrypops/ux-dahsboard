import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ChartDataPoint, StatusDistribution, ProductPerformance, CountryData } from '@/types';
import { formatFCFA } from '../services/lumoraService';

interface DashboardChartsProps {
  revenueData: ChartDataPoint[];
  ordersData: ChartDataPoint[];
  paymentData: StatusDistribution[];
  productsData: ProductPerformance[];
  countryData?: CountryData[];
}

const CustomTooltip = ({ active, payload, label, isCurrency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-3 border border-slate-700 shadow-2xl rounded-xl">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{label}</p>
        <p className="text-base font-black text-white">
          {isCurrency ? formatFCFA(payload[0].value) : `${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  revenueData, ordersData, paymentData, productsData, countryData = []
}) => {
  const hasRevenueData = revenueData?.length > 0;
  const hasOrdersData = ordersData?.length > 0;
  const hasProductsData = productsData?.length > 0;
  const hasCountryData = countryData?.length > 0;

  // Trier par CA décroissant
  const sortedCountryData = [...countryData].sort((a, b) => b.revenue - a.revenue);

  // Composant tick défini ici pour accéder à sortedCountryData
  const CountryYAxisTick = (props: any) => {
    const { x, y, index } = props;
    const data = sortedCountryData[index];
    if (!data) return null;
    
    const countryCode = data.countryCode?.toLowerCase() || 'xx';
    
    return (
      <g transform={`translate(${x},${y})`}>
        {/* Drapeau image */}
        <image 
          x={-140} 
          y={-10} 
          width={24} 
          height={18} 
          href={`https://flagcdn.com/w40/${countryCode}.png`}
          preserveAspectRatio="xMidYMid slice"
        />
        {/* Nom du pays */}
        <text 
          x={-110} 
          y={0} 
          dy={5} 
          textAnchor="start" 
          fill="#475569" 
          fontSize={12} 
          fontWeight={700}
        >
          {data.countryName}
        </text>
      </g>
    );
  };

  // Tooltip pour le pays
  const CountryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const index = payload[0].payload?.index; // On ajoute index aux données
      const data = sortedCountryData[index];
      if (!data) return null;
      
      const countryCode = data.countryCode?.toLowerCase() || 'xx';
      
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-4 border border-slate-700 shadow-2xl rounded-xl flex items-center gap-3">
          <img 
            src={`https://flagcdn.com/w80/${countryCode}.png`} 
            alt={data.countryName}
            className="w-8 h-6 rounded shadow-sm"
          />
          <div>
            <p className="text-sm font-bold text-white mb-1">{data.countryName}</p>
            <p className="text-xs text-slate-400">
              CA: <span className="text-emerald-400 font-bold">{formatFCFA(data.revenue)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Ajouter l'index aux données pour le tooltip
  const countryDataWithIndex = sortedCountryData.map((item, index) => ({
    ...item,
    index
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* 1. Évolution des Revenus */}
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg transition-all h-[420px] flex flex-col">
        <div className="flex flex-col mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-4 w-4 rounded-lg bg-indigo-600"></div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Flux Financier (XAF)
            </h3>
          </div>
          <p className="text-xs text-slate-400 ml-7">Performance historique des revenus nets.</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          {hasRevenueData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                  minTickGap={30}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip isCurrency />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm font-bold">Aucune donnée</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Volumes de Transactions */}
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg transition-all h-[420px] flex flex-col">
        <div className="flex flex-col mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-4 w-4 rounded-lg bg-violet-600"></div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Volume d'Activité
            </h3>
          </div>
          <p className="text-xs text-slate-400 ml-7">Quantité de commandes quotidiennes.</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. CA PAR PAYS AVEC DRAPEAUX */}
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg transition-all h-[420px] flex flex-col">
        <div className="flex flex-col mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-4 w-4 rounded-lg bg-blue-500"></div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              CA par Pays
            </h3>
          </div>
          <p className="text-xs text-slate-400 ml-7">Top pays par chiffre d'affaires.</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          {hasCountryData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={countryDataWithIndex} 
                margin={{ left: 160, right: 60, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="6 6" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="countryName"
                  type="category" 
                  width={150} 
                  tick={<CountryYAxisTick />}
                  axisLine={false} 
                  tickLine={false}
                  interval={0}
                />
                <Tooltip content={<CountryTooltip />} cursor={{fill: '#f8fafc', opacity: 0.5}} />
                <Bar 
                  dataKey="revenue" 
                  fill="#3b82f6" 
                  radius={[0, 8, 8, 0]} 
                  barSize={24} 
                  label={{
                    position: 'right',
                    fill: '#64748b',
                    fontSize: 11,
                    fontWeight: 800,
                    formatter: (val: any) => {
                      const num = Number(val);
                      if (num >= 1000000) return `${(num/1000000).toFixed(1)}M`;
                      if (num >= 1000) return `${(num/1000).toFixed(0)}k`;
                      return num.toString();
                    },
                    dx: 5
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <p className="text-sm font-bold">Aucune donnée géographique</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Top Produits */}
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg transition-all h-[420px] flex flex-col">
        <div className="flex flex-col mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-4 w-4 rounded-lg bg-amber-500"></div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Top Catalog
            </h3>
          </div>
          <p className="text-xs text-slate-400 ml-7">Les 5 produits les plus vendus.</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={productsData} margin={{ left: 90, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="6 6" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="orders" 
                fill="#4f46e5" 
                radius={[0, 12, 12, 0]} 
                barSize={22} 
                label={{
                  position: 'right',
                  fill: '#64748b',
                  fontSize: 11,
                  fontWeight: 800,
                  formatter: (val: any) => `${val}`,
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