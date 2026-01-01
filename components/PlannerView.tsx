
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, AlertCircle, Clock } from 'lucide-react';
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

const HOUR_HEIGHT = 100; // Aumentado para 100px para melhor visibilidade de textos em blocos curtos

const PlannerView: React.FC<PlannerViewProps> = ({ routineBlocks, onSlotClick }) => {
  const [showHelp, setShowHelp] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper to calculate minutes from a time string "HH:mm"
  const getMinutesFromTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const getPositionFromTime = (time: string) => {
    return (getMinutesFromTime(time) / 60) * HOUR_HEIGHT;
  };

  const getHeightFromTimes = (start: string, end: string) => {
    const startMins = getMinutesFromTime(start);
    let endMins = getMinutesFromTime(end);
    if (endMins <= startMins) endMins += 24 * 60; // Handle midnight wrap
    return ((endMins - startMins) / 60) * HOUR_HEIGHT;
  };

  /**
   * Layout Logic for Overlapping Events
   */
  const positionedBlocks = useMemo(() => {
    if (!routineBlocks.length) return [];

    const sorted = [...routineBlocks].sort((a, b) => 
      getMinutesFromTime(a.startTime) - getMinutesFromTime(b.startTime)
    );

    const layoutData: { block: RoutineBlock; col: number; totalCols: number }[] = [];
    let clusters: RoutineBlock[][] = [];
    let currentCluster: RoutineBlock[] = [];
    let clusterEnd = 0;

    sorted.forEach((block) => {
      const start = getMinutesFromTime(block.startTime);
      const end = getMinutesFromTime(block.endTime);
      
      if (start < clusterEnd) {
        currentCluster.push(block);
        clusterEnd = Math.max(clusterEnd, end);
      } else {
        if (currentCluster.length) clusters.push(currentCluster);
        currentCluster = [block];
        clusterEnd = end;
      }
    });
    if (currentCluster.length) clusters.push(currentCluster);

    clusters.forEach(cluster => {
      const columns: (number | null)[][] = [];
      const blockAssignments: Map<string, number> = new Map();

      cluster.forEach(block => {
        const start = getMinutesFromTime(block.startTime);
        const end = getMinutesFromTime(block.endTime);
        
        let assignedCol = -1;
        for (let i = 0; i < columns.length; i++) {
          if (columns[i][columns[i].length - 1]! <= start) {
            assignedCol = i;
            break;
          }
        }

        if (assignedCol === -1) {
          assignedCol = columns.length;
          columns.push([end]);
        } else {
          columns[assignedCol].push(end);
        }
        blockAssignments.set(block.id, assignedCol);
      });

      cluster.forEach(block => {
        layoutData.push({
          block,
          col: blockAssignments.get(block.id)!,
          totalCols: columns.length
        });
      });
    });

    return layoutData;
  }, [routineBlocks]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <button className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
          <div className="text-center">
            <h2 className="font-black text-xl tracking-tighter uppercase">Planner Precisão</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black">Timeline Organizada</p>
          </div>
          <button className="p-2 text-slate-500 hover:text-white transition-colors"><ChevronRight size={20}/></button>
        </div>
        
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="w-full py-2 glass rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <HelpCircle size={14} /> Guia de Visualização
        </button>

        {showHelp && (
          <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20 animate-in zoom-in-95 duration-200 space-y-3">
            <div className="flex items-start gap-3 mb-2">
              <Clock size={16} className="text-blue-400 shrink-0 mt-1" />
              <p className="text-xs text-blue-200 leading-relaxed font-medium">
                Os blocos agora destacam o nome da tarefa no topo. Se houver sobreposição, o Flow divide o espaço automaticamente.
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
        <div className="max-h-[600px] overflow-y-auto relative bg-slate-900/20 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          
          {/* Background Hour Lines */}
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

            {/* Smart Column Layout for Overlapping Events */}
            <div className="absolute top-0 left-16 right-4 bottom-0 pointer-events-none">
              {positionedBlocks.map(({ block, col, totalCols }) => {
                const blockColor = PRIORITY_COLORS[block.priority];
                const top = getPositionFromTime(block.startTime);
                const height = getHeightFromTimes(block.startTime, block.endTime);
                
                const widthPercent = 100 / totalCols;
                const leftPercent = col * widthPercent;

                return (
                  <div 
                    key={block.id} 
                    className="absolute p-3 rounded-2xl border-l-[6px] shadow-xl flex flex-col justify-start overflow-hidden pointer-events-auto cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all"
                    style={{ 
                      top: `${top + 1}px`,
                      height: `${height - 2}px`,
                      left: `${leftPercent}%`,
                      width: `calc(${widthPercent}% - 4px)`,
                      backgroundColor: `${blockColor}15`,
                      borderColor: blockColor,
                      color: 'white',
                      zIndex: 10 + col,
                      backdropFilter: 'blur(12px)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                       <p className="text-[11px] sm:text-xs font-black uppercase tracking-tight truncate leading-none">
                         {block.title}
                       </p>
                       {block.priority === Priority.CRITICAL && <AlertCircle size={12} className="text-red-500 animate-pulse shrink-0" />}
                    </div>
                    
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Clock size={10} style={{ color: blockColor }} />
                      <p className="text-[9px] font-bold tracking-tight">
                        {block.startTime} — {block.endTime}
                      </p>
                    </div>

                    {/* Gradient overlay to ensure text is visible on short blocks */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 bg-blue-500/5 rounded-3xl border border-blue-500/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Manhã Produtiva (Exemplos)</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black uppercase text-slate-100">ALARM</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">07:30 — 08:00</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black uppercase text-slate-100">AO TRABALHO</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">08:00 — 09:15</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerView;
