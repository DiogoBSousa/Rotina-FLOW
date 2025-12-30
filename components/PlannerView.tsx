
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, HelpCircle, AlertCircle } from 'lucide-react';
import { RoutineBlock, Priority } from '../types';

interface PlannerViewProps {
  routineBlocks: RoutineBlock[];
  onAddClick: () => void;
  onSlotClick: (time: string) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: '#A855F7',      // Roxo
  [Priority.MEDIUM]: '#3B82F6',   // Azul
  [Priority.HIGH]: '#F59E0B',     // Laranja
  [Priority.CRITICAL]: '#EF4444'  // Vermelho
};

const PlannerView: React.FC<PlannerViewProps> = ({ routineBlocks, onAddClick, onSlotClick }) => {
  const [showHelp, setShowHelp] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getBlocksForHour = (hour: number) => {
    return routineBlocks.filter(block => {
      const startHour = parseInt(block.startTime.split(':')[0]);
      return startHour === hour;
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <button className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
          <div className="text-center">
            <h2 className="font-bold text-lg">Timeline Diária</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Nível de Prioridade por Cor</p>
          </div>
          <button className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronRight size={20}/></button>
        </div>
        
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="w-full py-2 glass rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <HelpCircle size={14} /> Legenda de Prioridades
        </button>

        {showHelp && (
          <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20 animate-in zoom-in-95 duration-200 space-y-3">
            <p className="text-xs text-blue-200 leading-relaxed font-medium mb-2">
              No Flow, as cores dos blocos indicam o esforço e urgência necessários:
            </p>
            <div className="grid grid-cols-2 gap-2">
               {Object.entries(PRIORITY_COLORS).map(([p, color]) => (
                 <div key={p} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-[9px] font-black uppercase text-slate-400">{p}</span>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-[40px] overflow-hidden border-white/5 shadow-2xl">
        <div className="max-h-[500px] overflow-y-auto p-4 space-y-0 relative">
          {hours.map(hour => {
            const blocks = getBlocksForHour(hour);
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            
            return (
              <div key={hour} className="flex gap-4 min-h-[70px] group border-b border-white/5 last:border-0">
                <div className="w-12 text-right pt-2">
                  <span className="text-[10px] text-slate-500 font-black">{timeStr}</span>
                </div>
                
                <div className="flex-1 relative pb-2 group-hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onSlotClick(timeStr)}>
                  {blocks.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={16} className="text-blue-500/30" />
                    </div>
                  )}
                  {blocks.map(block => {
                    const blockColor = PRIORITY_COLORS[block.priority];
                    return (
                      <div 
                        key={block.id} 
                        className="p-3 rounded-2xl border-l-4 shadow-lg h-full flex flex-col justify-center"
                        style={{ 
                          backgroundColor: `${blockColor}15`,
                          borderColor: blockColor,
                          color: blockColor
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] font-black uppercase tracking-tighter truncate">{block.title}</p>
                           {block.priority === Priority.CRITICAL && <AlertCircle size={10} className="animate-pulse" />}
                        </div>
                        <p className="text-[9px] font-bold opacity-70">{block.startTime} - {block.endTime}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlannerView;
