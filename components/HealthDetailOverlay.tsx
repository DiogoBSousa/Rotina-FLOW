
import React, { useState } from 'react';
import { X, TrendingUp, Calendar, ChevronRight, Droplets, Plus, Minus, Edit3, Target } from 'lucide-react';
import { HealthStats } from '../types';

interface HealthDetailOverlayProps {
  type: 'STEPS' | 'SLEEP' | 'WATER';
  stats: HealthStats;
  onClose: () => void;
  onAddWater: () => void;
  onUpdateGoal: (type: 'STEPS' | 'SLEEP' | 'WATER', value: number) => void;
}

const HealthDetailOverlay: React.FC<HealthDetailOverlayProps> = ({ type, stats, onClose, onAddWater, onUpdateGoal }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const config = {
    STEPS: { title: 'Atividade Física', icon: 'Footprints', color: 'text-green-400', val: stats.steps, goal: stats.stepsGoal, unit: 'passos', step: 500, min: 2000, max: 20000 },
    SLEEP: { title: 'Qualidade do Sono', icon: 'Moon', color: 'text-indigo-400', val: stats.sleepHours, goal: stats.sleepGoal, unit: 'horas', step: 0.5, min: 4, max: 12 },
    WATER: { title: 'Hidratação', icon: 'Droplets', color: 'text-cyan-400', val: stats.waterGlassCount, goal: stats.waterGoal, unit: 'copos', step: 1, min: 4, max: 20 }
  }[type];

  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const values = [65, 80, 45, 90, 100, 70, 85]; // Mock data

  const handleAdjustGoal = (increment: boolean) => {
    const newValue = increment ? config.goal + config.step : config.goal - config.step;
    if (newValue >= config.min && newValue <= config.max) {
      onUpdateGoal(type, newValue);
    }
  };

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

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-[32px] p-6 text-center border-white/5 bg-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hoje</h4>
            <p className={`text-4xl font-black ${config.color}`}>{config.val}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{config.unit}</p>
          </div>
          
          <div className={`glass rounded-[32px] p-6 text-center transition-all relative group ${isEditingGoal ? 'border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20' : 'border-white/5'}`}>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Meta Diária</h4>
            <div className="flex items-center justify-center gap-2">
              {isEditingGoal && (
                <button onClick={() => handleAdjustGoal(false)} className="p-1 glass rounded-lg text-slate-400 hover:text-white active:scale-90 transition-all">
                  <Minus size={16} />
                </button>
              )}
              <p className="text-4xl font-black text-white">{config.goal}</p>
              {isEditingGoal && (
                <button onClick={() => handleAdjustGoal(true)} className="p-1 glass rounded-lg text-slate-400 hover:text-white active:scale-90 transition-all">
                  <Plus size={16} />
                </button>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{config.unit}</p>
            
            <button 
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="absolute -top-2 -right-2 p-2 bg-slate-800 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all shadow-lg"
            >
              {isEditingGoal ? <Target size={12} className="text-blue-400" /> : <Edit3 size={12} />}
            </button>
          </div>
        </div>

        {isEditingGoal && (
          <div className="mb-8 p-4 glass rounded-3xl border-blue-500/10 bg-blue-500/5 animate-in slide-in-from-top-2 duration-300">
             <p className="text-[10px] font-black uppercase text-blue-400 text-center tracking-widest mb-3">Ajuste seu Alvo</p>
             <input 
              type="range" 
              min={config.min} 
              max={config.max} 
              step={config.step}
              value={config.goal} 
              onChange={(e) => onUpdateGoal(type, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
             />
             <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
               <span>Mín: {config.min}</span>
               <span>Máx: {config.max}</span>
             </div>
          </div>
        )}

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
