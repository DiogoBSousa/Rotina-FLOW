
import React, { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { RoutineBlock, Priority } from '../types';

interface AddRoutineBlockOverlayProps {
  prefilledStart?: string;
  onClose: () => void;
  onAdd: (block: Omit<RoutineBlock, 'id'>) => void;
}

const PRIORITIES = [
  { label: 'Baixa', value: Priority.LOW, color: '#A855F7', desc: 'Rotina leve' },
  { label: 'Média', value: Priority.MEDIUM, color: '#3B82F6', desc: 'Foco normal' },
  { label: 'Alta', value: Priority.HIGH, color: '#F59E0B', desc: 'Atenção extra' },
  { label: 'Crítica', value: Priority.CRITICAL, color: '#EF4444', desc: 'Inadiável' },
];

const AddRoutineBlockOverlay: React.FC<AddRoutineBlockOverlayProps> = ({ prefilledStart, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(prefilledStart || '09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.MEDIUM);

  useEffect(() => {
    if (prefilledStart) {
      setStartTime(prefilledStart);
      const [h] = prefilledStart.split(':').map(Number);
      setEndTime(`${(h + 1).toString().padStart(2, '0')}:00`);
    }
  }, [prefilledStart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, startTime, endTime, priority: selectedPriority, icon: 'Calendar' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="w-full max-w-lg glass rounded-[40px] p-8 relative animate-in zoom-in-95 duration-500 border-white/10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Planejar Bloco</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Agenda Inteligente</p>
          </div>
          <button onClick={onClose} className="p-2 glass rounded-full text-slate-500"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Título do Evento</label>
            <input 
              autoFocus
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reunião de Equipe..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Início</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 [color-scheme:dark]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Fim</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 [color-scheme:dark]" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nível de Prioridade (Cor do Bloco)</label>
            <div className="grid grid-cols-2 gap-3">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSelectedPriority(p.value)}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${selectedPriority === p.value ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent opacity-60'}`}
                >
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: p.color }}></div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-100">{p.label}</p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm">
            Confirmar na Agenda
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoutineBlockOverlay;
