
import React from 'react';
import { Footprints, Moon, Droplets, ChevronRight, Plus, RefreshCcw, ShieldCheck, AlertCircle, Edit2 } from 'lucide-react';
import { HealthStats, Task, Habit, RoutineBlock } from '../types';

interface HomeViewProps {
  tasks: Task[];
  habits: Habit[];
  healthStats: HealthStats;
  routineBlocks: RoutineBlock[];
  onTriggerDemo: (type: any, title?: string, body?: string) => void;
  onOpenAI: () => void;
  onAddWater: () => void;
  onDetailClick: (type: 'STEPS' | 'SLEEP' | 'WATER') => void;
  onSyncRequest: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ healthStats, onAddWater, onDetailClick, onSyncRequest }) => {
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sincronização e Status */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          {healthStats.permissionsGranted ? (
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">HealthKit Ativo</span>
            </div>
          ) : (
            <button onClick={onSyncRequest} className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
              <AlertCircle size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Ativar Integração</span>
            </button>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Última Sincronização</p>
          <p className="text-xs font-bold text-slate-400">{formatTime(healthStats.lastUpdated)}</p>
        </div>
      </div>

      {/* Grid de Saúde em Tempo Real */}
      <section className="grid grid-cols-2 gap-4">
        <HealthMetricCard 
          icon={<Footprints size={20} />}
          label="Passos"
          value={healthStats.steps.toLocaleString()}
          goal={healthStats.stepsGoal}
          unit="steps"
          color="text-green-400"
          bgColor="bg-green-400/10"
          isSyncing={healthStats.isSyncing}
          onClick={() => onDetailClick('STEPS')}
        />
        <HealthMetricCard 
          icon={<Moon size={20} />}
          label="Sono"
          value={healthStats.sleepHours}
          goal={healthStats.sleepGoal}
          unit="horas"
          color="text-indigo-400"
          bgColor="bg-indigo-400/10"
          isSyncing={healthStats.isSyncing}
          onClick={() => onDetailClick('SLEEP')}
        />
        <div 
          onClick={() => onDetailClick('WATER')}
          className="col-span-2 glass rounded-[32px] p-6 flex items-center justify-between border-cyan-500/10 group cursor-pointer hover:bg-cyan-500/5 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 ${healthStats.isSyncing ? 'animate-pulse' : ''}`}>
              <Droplets size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hidratação Diária</p>
                <Edit2 size={10} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-xl font-black">{healthStats.waterGlassCount} de {healthStats.waterGoal} copos</h4>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-1000 shadow-[0_0_8px_rgba(34,211,238,0.4)]" 
                  style={{ width: `${Math.min((healthStats.waterGlassCount / healthStats.waterGoal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddWater(); }}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-all shadow-lg active:scale-90"
          >
            <Plus size={24} />
          </button>
        </div>
      </section>

      {/* Notificações do Dia */}
      <div className="p-6 glass rounded-[36px] bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/10">
        <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-3">Insight Flow</h3>
        <p className="text-sm font-bold leading-relaxed text-slate-200 italic">
          {healthStats.waterGlassCount >= healthStats.waterGoal 
            ? "Você bateu sua meta de hidratação hoje! Corpo nota 10! ✨" 
            : `Você já bebeu ${healthStats.waterGlassCount} de ${healthStats.waterGoal} copos hoje! Falta pouco pra bater a meta 🔥`}
        </p>
      </div>
    </div>
  );
};

const HealthMetricCard: React.FC<{ icon: any; label: string; value: any; goal: number; unit: string; color: string; bgColor: string; isSyncing: boolean; onClick: () => void }> = ({ icon, label, value, goal, unit, color, bgColor, isSyncing, onClick }) => {
  const progress = Math.min((parseFloat(value.toString().replace(',', '')) / goal) * 100, 100);

  return (
    <div 
      onClick={onClick}
      className="glass rounded-[32px] p-6 border-white/5 space-y-4 hover:bg-white/5 transition-all cursor-pointer group active:scale-[0.98]"
    >
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color} ${isSyncing ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`}>
          {icon}
        </div>
        {isSyncing && <RefreshCcw size={12} className="animate-spin text-slate-500" />}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <h4 className="text-2xl font-black">{value}</h4>
          <span className="text-[10px] font-bold text-slate-500 uppercase">{unit}</span>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{label} do Dia</p>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
          <span className={color}>{Math.round(progress)}% da meta</span>
          <span className="text-slate-600">Alvo: {goal}</span>
        </div>
        <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color.replace('text', 'bg')} rounded-full transition-all duration-1000 shadow-lg`} 
            style={{ width: `${progress}%`, boxShadow: `0 0 10px ${color.includes('green') ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
