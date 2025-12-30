
import React from 'react';
import { BarChart3, TrendingUp, Download, FileText, CheckCircle2, Heart, Footprints, Zap } from 'lucide-react';
import { HealthStats, Task, Habit } from '../types';

interface StatsViewProps {
  healthStats: HealthStats;
  tasks: Task[];
  habits: Habit[];
}

const StatsView: React.FC<StatsViewProps> = ({ healthStats, tasks, habits }) => {
  const completedRate = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estatísticas</h2>
        <button className="flex items-center gap-2 glass px-4 py-2 rounded-2xl text-xs font-bold text-blue-400 hover:bg-blue-400/10 transition-all border-blue-500/20">
          <Download size={14} /> Exportar PDF
        </button>
      </div>

      {/* Main Stats Graph Mock */}
      <section className="glass rounded-[40px] p-8 border-white/5 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <TrendingUp size={120} className="text-blue-500" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Produtividade Semanal</h3>
          <p className="text-4xl font-black mt-2 text-gradient">92.4%</p>
        </div>
        
        <div className="flex items-end justify-between h-32 gap-3 pt-4">
          {[40, 65, 80, 55, 95, 70, 85].map((val, i) => (
            <div key={i} className="flex-1 group flex flex-col items-center gap-2">
              <div className="w-full bg-slate-800 rounded-full relative overflow-hidden h-full">
                <div 
                  className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ${i === 4 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`} 
                  style={{ height: `${val}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-300 transition-colors uppercase">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Health Correlative Insights */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Correlação Saúde x Foco</h3>
        <div className="grid grid-cols-1 gap-4">
          <InsightCard 
            icon={<Heart className="text-red-400" />} 
            title="Cardio & Foco" 
            desc="Sua atenção nas tarefas críticas aumenta 18% em dias de exercício aeróbico." 
            val="+18%"
          />
          <InsightCard 
            icon={<Zap className="text-amber-400" />} 
            title="Eficiência Matinal" 
            desc="Você completa 60% das tarefas antes das 11h. Sua energia cai após o almoço." 
            val="Peak: 10h"
          />
        </div>
      </section>

      {/* Data Summary List */}
      <section className="glass rounded-[32px] overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Resumo do Mês (Dez 2025)</h4>
        </div>
        <div className="divide-y divide-white/5">
          <SummaryRow label="Tarefas Concluídas" val={tasks.filter(t => t.completed).length.toString()} icon={<CheckCircle2 size={16} />} />
          <SummaryRow label="Média de Passos" val={`${healthStats.steps} steps/dia`} icon={<Footprints size={16} />} />
          <SummaryRow label="Backup em Nuvem" val="Sincronizado" icon={<FileText size={16} />} status="active" />
        </div>
      </section>
    </div>
  );
};

const InsightCard: React.FC<{ icon: any; title: string; desc: string; val: string }> = ({ icon, title, desc, val }) => (
  <div className="glass rounded-3xl p-5 flex items-start gap-4 border-white/5 hover:bg-white/5 transition-all">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-sm text-slate-100">{title}</h4>
        <span className="text-xs font-black text-blue-400">{val}</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SummaryRow: React.FC<{ label: string; val: string; icon: any; status?: string }> = ({ label, val, icon, status }) => (
  <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
    <div className="flex items-center gap-3">
      <div className="text-slate-500">{icon}</div>
      <span className="text-xs font-bold text-slate-300">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {status === 'active' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
      <span className="text-xs font-black text-slate-100 uppercase tracking-tighter">{val}</span>
    </div>
  </div>
);

export default StatsView;
