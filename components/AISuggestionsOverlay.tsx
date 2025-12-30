
import React from 'react';
import { X, Sparkles, Clock, Target, TrendingUp } from 'lucide-react';

interface AISuggestionsOverlayProps {
  onClose: () => void;
  onAction: (type: string) => void;
}

const AISuggestionsOverlay: React.FC<AISuggestionsOverlayProps> = ({ onClose, onAction }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="w-full max-w-xl glass rounded-[40px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-500 border-blue-500/20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white"><Sparkles size={24} /></div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Flow Assist</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500"><X size={24} /></button>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-blue-500/10 rounded-3xl border border-blue-500/20">
            <p className="text-sm font-bold leading-relaxed text-blue-100 italic">
              "Hoje você atingiu sua meta de passos, mas a hidratação está baixa. Sugiro focar nisso agora para manter a energia alta."
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => onAction('HABIT')}
              className="w-full glass rounded-3xl p-5 flex items-center gap-4 hover:bg-blue-500/10 transition-all group text-left"
            >
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Target size={20} /></div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-blue-400">Ativar Novo Hábito</h4>
                <p className="text-sm font-bold">Adicionar "Beber 2L de Água" à rotina</p>
              </div>
            </button>

            <button className="w-full glass rounded-3xl p-5 flex items-center gap-4 opacity-50 cursor-not-allowed text-left">
              <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400"><TrendingUp size={20} /></div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Otimizar Horários</h4>
                <p className="text-sm font-bold">Disponível após 3 dias de uso</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsOverlay;
