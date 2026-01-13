
import React from 'react';

interface AiInsightsBoxProps {
  insight: string;
  onRefresh?: () => void;
}

const AiInsightsBox: React.FC<AiInsightsBoxProps> = ({ insight, onRefresh }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl shadow-xl text-white h-full relative overflow-hidden group min-h-[400px]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -m-12 opacity-10 transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12">
        <svg className="h-64 w-64" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight leading-none uppercase italic">Gemini Insights</h2>
            <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mt-1 opacity-80">Analyse IA en temps réel</p>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          {insight ? (
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl animate-in fade-in zoom-in-95 duration-700">
              <p className="text-base leading-relaxed whitespace-pre-wrap font-medium text-white/90">
                {insight}
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-20 bg-white/10 rounded-2xl w-full"></div>
              <div className="h-24 bg-white/10 rounded-2xl w-full"></div>
              <div className="h-12 bg-white/10 rounded-2xl w-4/5"></div>
            </div>
          )}
        </div>
        
        <div className="mt-8 space-y-3">
          <button 
            onClick={onRefresh}
            className="w-full py-3.5 bg-white text-indigo-600 rounded-xl text-sm font-black shadow-2xl hover:bg-indigo-50 transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Régénérer l'analyse</span>
          </button>
          <p className="text-[10px] text-center text-indigo-300 font-medium">L'IA analyse vos KPIs Postgres pour identifier les opportunités de croissance.</p>
        </div>
      </div>
    </div>
  );
};

export default AiInsightsBox;
