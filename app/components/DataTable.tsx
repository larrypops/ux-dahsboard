
import React from 'react';
import { Order } from '@/types';
import { formatFCFA } from '../services/lumoraService';

interface DataTableProps {
  data: Order[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto w-full transition-colors pb-4">
      <table className="w-full text-left min-w-[600px] md:min-w-[800px]">
        <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md">
          <tr>
            <th className="px-5 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Référence</th>
            <th className="px-5 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Client</th>
            <th className="px-5 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Produit</th>
            <th className="px-5 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Montant</th>
            <th className="px-5 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Statut</th>
            <th className="px-5 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-600 font-medium italic">
                Aucune commande trouvée pour cette période.
              </td>
            </tr>
          ) : (
            data.map((order) => (
              <tr key={order.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                <td className="px-5 md:px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                    <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">{order.order_reference}</span>
                  </div>
                </td>
                <td className="px-5 md:px-6 py-4">
                  <div className="flex flex-col max-w-[150px] md:max-w-none">
                    <span className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{order.customer_name}</span>
                    <span className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">{order.customer_email}</span>
                  </div>
                </td>
                <td className="px-5 md:px-6 py-4">
                  <span className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md whitespace-nowrap">{order.product_name}</span>
                </td>
                <td className="px-5 md:px-6 py-4 text-right">
                  <span className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">{formatFCFA(order.amount)}</span>
                </td>
                <td className="px-5 md:px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm border whitespace-nowrap ${
                    order.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                    order.status === 'pending' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                      'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                  }`}>
                    {order.status === 'completed' ? 'Paiement Réussi' : order.status === 'pending' ? 'En Attente' : 'Échoué'}
                  </span>
                </td>
                <td className="px-5 md:px-6 py-4 text-right whitespace-nowrap">
                  <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {new Date(order.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
