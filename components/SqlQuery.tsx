
import React, { useState } from 'react';
import { QueryResult } from '../types';
import { executeSqlQuery } from '../services/geminiService';

const SqlQuery: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await executeSqlQuery(query);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Une erreur de connexion à 109.199.118.183 est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 dark:bg-black p-3 rounded-2xl shadow-xl">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Lumora SQL Terminal</h2>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Connecté @ 109.199.118.183</p>
            </div>
          </div>
          <button
            onClick={handleRunQuery}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
            <span className="uppercase tracking-widest text-[11px]">Exécuter sur Lumora</span>
          </button>
        </div>
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            className="w-full h-64 p-8 font-mono text-sm bg-slate-900 dark:bg-black text-indigo-300 dark:text-indigo-400 focus:outline-none resize-none leading-relaxed selection:bg-indigo-500/30"
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-100 dark:border-rose-500/20 rounded-3xl p-6 flex items-start space-x-4 text-rose-700 dark:text-rose-400 shadow-sm animate-in shake-in">
          <svg className="h-6 w-6 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs font-black uppercase mb-1 tracking-widest">Database Error</p>
            <p className="text-sm font-medium opacity-90">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Dataset Output</h3>
            <div className="flex items-center space-x-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                {result.rowCount} rows
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                {result.executionTime}ms latency
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  {result.columns.map(col => (
                    <th key={col} className="px-8 py-5 border-r border-slate-100 dark:border-slate-800 last:border-0">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    {result.columns.map(col => (
                      <td key={col} className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap border-r border-slate-50 dark:border-slate-800 last:border-0 font-medium">
                        {row[col] === null ? <span className="text-slate-300 dark:text-slate-700 italic">null</span> : String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SqlQuery;
