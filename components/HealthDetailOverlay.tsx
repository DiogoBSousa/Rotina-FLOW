
import React from 'react';
import { X, TrendingUp, Calendar, ChevronRight, Droplets, Plus } from 'lucide-react';
import { HealthStats } from '../types';

interface HealthDetailOverlayProps {
  type: 'STEPS' | 'SLEEP' | 'WATER';
  stats: HealthStats;
  onClose: () => void;
  onAddWater: () => void;
}

const HealthDetailOverlay: React.FC<HealthDetailOverlayProps> = ({ type, stats, onClose, onAddWater }) => {
  const config = {
    STEPS: { title: 'Atividade Física', icon: 'Footprints', color: 'text-green-400', val: stats.steps, goal: stats.stepsGoal, unit: 'passos' },
    SLEEP: { title: 'Qualidade do Sono', icon: 'Moon', color: 'text-indigo-400', val: stats.sleepHours, goal: stats.sleepGoal, unit: 'horas' },
    WATER: { title: 'Hidratação', icon: 'Droplets', color: 'text-cyan-400', val: stats.waterGlassCount, goal: stats.waterGoal, unit: 'copos' }
  }[type];

  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const values = [65, 80, 45, 90, 100, 70, 85]; // Mock data

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="w-full max-w-xl glass rounded-[40px] p-8 relative animate-in slide-in-from-bottom-8 duration-500 border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${config.color}`}>{config.title}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Sincronizado com HealthKit</p>
          </div>
          <button onClick={onClose} className="p-3 glass rounded-2xl text-slate-500 hover:text-white transition-all"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="glass rounded-[32px] p-6 text-center border-white/5 bg-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hoje</h4>
            <p className={`text-4xl font-black ${config.color}`}>{config.val}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{config.unit}</p>
          </div>
          <div className="glass rounded-[32px] p-6 text-center border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Meta Diária</h4>
            <p className="text-4xl font-black text-white">{config.goal}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{config.unit}</p>
          </div>
        </div>

        {/* Gráfico Semanal Mock */}
        <div className="space-y-4 mb-10">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Progresso Semanal</h3>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">Top 15% Flow</span>
          </div>
          <div className="h-40 flex items-end justify-between gap-2 px-2 py-4 glass rounded-3xl border-white/5">
            {values.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className={`w-full rounded-t-xl transition-all duration-1000 ${config.color.replace('text', 'bg')} ${v >= 90 ? 'brightness-125 shadow-lg' : 'opacity-40'}`} 
                  style={{ height: `${v}%` }}
                ></div>
                <span className="text-[9px] font-black text-slate-500 uppercase">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {type === 'WATER' && (
          <button 
            onClick={onAddWater}
            className="w-full py-5 bg-cyan-500 text-slate-950 rounded-[28px] font-black uppercase tracking-widest shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all mb-4"
          >
            <Plus size={24} /> Registrar Copo
          </button>
        )}

        <div className="p-5 glass rounded-3xl border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-blue-400" />
            <p className="text-xs font-bold text-slate-300 italic">"Você está 12% mais ativo que na semana passada!"</p>
          </div>
          <ChevronRight size={16} className="text-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default HealthDetailOverlay;
