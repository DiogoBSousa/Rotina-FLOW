
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, HelpCircle, AlertCircle, Clock } from 'lucide-react';
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

const HOUR_HEIGHT = 80; // pixels per hour

const PlannerView: React.FC<PlannerViewProps> = ({ routineBlocks, onAddClick, onSlotClick }) => {
  const [showHelp, setShowHelp] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper to calculate top position in pixels from a time string "HH:mm"
  const getPositionFromTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return (h * HOUR_HEIGHT) + (m / 60 * HOUR_HEIGHT);
  };

  // Helper to calculate height in pixels between two time strings
  const getHeightFromTimes = (start: string, end: string) => {
    const startPx = getPositionFromTime(start);
    let endPx = getPositionFromTime(end);
    
    // Handle overnight blocks or exact midnight
    if (endPx <= startPx) endPx += (24 * HOUR_HEIGHT);
    
    return endPx - startPx;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <button className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
          <div className="text-center">
            <h2 className="font-black text-xl tracking-tighter uppercase">Planner Precisão</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Suporte para minutos (7:30, 9:15...)</p>
          </div>
          <button className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronRight size={20}/></button>
        </div>
        
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="w-full py-2 glass rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <HelpCircle size={14} /> Legenda & Tutorial
        </button>

        {showHelp && (
          <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20 animate-in zoom-in-95 duration-200 space-y-3">
            <div className="flex items-start gap-3 mb-2">
              <Clock size={16} className="text-blue-400 shrink-0 mt-1" />
              <p className="text-xs text-blue-200 leading-relaxed font-medium">
                Toque em qualquer lugar da timeline para agendar. O Flow agora posiciona blocos exatamente no minuto escolhido.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-500/10">
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
        <div className="max-h-[600px] overflow-y-auto relative bg-slate-900/20" style={{ scrollbarWidth: 'none' }}>
          
          {/* Background Hour Lines & Clickable slots */}
          <div className="relative">
            {hours.map(hour => (
              <div 
                key={hour} 
                className="flex gap-4 border-b border-white/5 group"
                style={{ height: `${HOUR_HEIGHT}px` }}
                onClick={() => onSlotClick(`${hour.toString().padStart(2, '0')}:00`)}
              >
                <div className="w-12 text-right pt-2 shrink-0">
                  <span className="text-[10px] text-slate-600 font-black tracking-tighter">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
                <div className="flex-1 relative group-hover:bg-white/5 transition-colors">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-white/[0.02] border-dashed"></div>
                </div>
              </div>
            ))}

            {/* Absolute Positioned Blocks */}
            <div className="absolute top-0 left-16 right-4 bottom-0 pointer-events-none">
              {routineBlocks.map(block => {
                const blockColor = PRIORITY_COLORS[block.priority];
                const top = getPositionFromTime(block.startTime);
                const height = getHeightFromTimes(block.startTime, block.endTime);
                
                return (
                  <div 
                    key={block.id} 
                    className="absolute left-0 right-0 p-3 rounded-2xl border-l-4 shadow-xl flex flex-col justify-start overflow-hidden pointer-events-auto cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
                    style={{ 
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: `${blockColor}25`,
                      borderColor: blockColor,
                      color: blockColor,
                      zIndex: 10
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Logic to edit or view block details could go here
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                       <p className="text-[10px] font-black uppercase tracking-tighter truncate leading-none">
                         {block.title}
                       </p>
                       {block.priority === Priority.CRITICAL && <AlertCircle size={10} className="animate-pulse shrink-0" />}
                    </div>
                    <p className="text-[9px] font-black opacity-80 mt-1">
                      {block.startTime} — {block.endTime}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center justify-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ajuste fino ativado: 15min / 30min / 45min</p>
      </div>
    </div>
  );
};

export default PlannerView;
