
import React from 'react';
import { Flame, Brain, Check, Trophy, TrendingUp, Info, ShieldCheck, Footprints, Moon, Droplets } from 'lucide-react';
import { Habit } from '../types';

interface HabitsViewProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  onToggleHabit: (id: string) => void;
}

const HabitsView: React.FC<HabitsViewProps> = ({ habits, onToggleHabit }) => {
  const today = new Date().toISOString().split('T')[0];

  const getIcon = (habit: Habit) => {
    if (habit.healthMetric === 'STEPS') return <Footprints size={28} />;
    if (habit.healthMetric === 'SLEEP') return <Moon size={28} />;
    if (habit.healthMetric === 'WATER') return <Droplets size={28} />;
    if (habit.icon === 'Brain') return <Brain size={28} />;
    return <Flame size={28} />;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black tracking-tighter">HÁBITOS</h2>
          <div className="flex items-center gap-2 mt-1">
             <ShieldCheck size={12} className="text-blue-400" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronização Ativa</p>
          </div>
        </div>
        <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-2xl text-[10px] font-black text-blue-400 animate-pulse">
          <TrendingUp size={14} /> LIVE TRACKING
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {habits.map(habit => {
          const isDoneToday = habit.history[today];
          return (
            <div key={habit.id} className={`glass rounded-[40px] p-7 relative overflow-hidden transition-all duration-500 ${isDoneToday ? 'border-green-500/30 bg-green-500/5' : 'border-white/5'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-5 items-center">
                  <button 
                    onClick={() => !habit.isAutoSynced && onToggleHabit(habit.id)}
                    disabled={habit.isAutoSynced}
                    className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-white transition-all active:scale-90 relative shadow-2xl ${isDoneToday ? 'shadow-green-500/40 bg-green-500' : 'bg-slate-800'}`}
                    style={{ backgroundColor: isDoneToday ? '#10B981' : habit.color }}
                  >
                    {isDoneToday ? <Check size={32} strokeWidth={3} /> : getIcon(habit)}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xl font-black transition-colors ${isDoneToday ? 'text-green-400' : 'text-white'}`}>{habit.name}</h4>
                      {habit.isAutoSynced && <ShieldCheck size={14} className="text-blue-400" title="Auto-sincronizado" />}
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{habit.streak} dias de sequência</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                  <Flame size={16} className={isDoneToday ? 'text-green-500' : 'text-orange-500'} />
                  <span className={`text-sm font-black ${isDoneToday ? 'text-green-500' : 'text-orange-500'}`}>{habit.streak}</span>
                </div>
              </div>

              {/* Status Badge */}
              {habit.isAutoSynced && (
                <div className="mb-6 px-4 py-2 bg-blue-500/10 rounded-2xl border border-blue-500/20 inline-flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Atualizado via HealthKit</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Mapa de Consistência</p>
                  <span className={`text-[10px] font-black uppercase ${isDoneToday ? 'text-green-400' : 'text-blue-400 animate-pulse'}`}>
                    {isDoneToday ? 'Meta Atingida! ✨' : `Faltam ${habit.goalValue} ${habit.healthMetric === 'STEPS' ? 'passos' : ''}`}
                  </span>
                </div>
                <div className="flex justify-between gap-1.5">
                  {[...Array(14)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 aspect-square rounded-lg border border-white/5 transition-all shadow-inner`}
                      style={{ 
                        backgroundColor: i === 13 && isDoneToday ? '#10B981' : (i % 3 === 0 ? habit.color : 'rgba(255,255,255,0.03)'),
                        opacity: i === 13 && isDoneToday ? 1 : (i % 3 === 0 ? 0.7 : 0.4),
                        boxShadow: i === 13 && isDoneToday ? '0 0 10px rgba(16,185,129,0.4)' : 'none'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-8 glass rounded-[40px] text-center space-y-4 border-white/5 bg-gradient-to-t from-blue-500/5 to-transparent">
        <Trophy size={48} className="mx-auto text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
        <div>
          <h4 className="text-xl font-black italic">Mestre do Equilíbrio</h4>
          <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">Você está no caminho certo! Mantenha a sincronização de saúde ativa para ganhar conquistas exclusivas.</p>
        </div>
      </div>
    </div>
  );
};

export default HabitsView;
