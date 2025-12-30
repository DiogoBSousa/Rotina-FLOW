
import React from 'react';
import { ShieldCheck, Heart, Footprints, Moon, Droplets, X } from 'lucide-react';

interface HealthPermissionsOverlayProps {
  onClose: () => void;
  onGrant: () => void;
}

const HealthPermissionsOverlay: React.FC<HealthPermissionsOverlayProps> = ({ onClose, onGrant }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className="w-full max-w-sm glass rounded-[48px] p-10 shadow-2xl relative animate-in zoom-in-95 duration-500 border-white/10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-[28px] bg-blue-600/20 flex items-center justify-center mb-8 ring-8 ring-blue-600/5">
          <ShieldCheck className="text-blue-500" size={40} />
        </div>

        <h2 className="text-2xl font-black tracking-tighter mb-4">Integração de Saúde</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium px-4">
          O Rotina Flow quer acessar seus dados de saúde para sincronizar automaticamente seus passos, sono e hidratação.
        </p>

        <div className="w-full space-y-3 mb-10">
          <PermissionItem icon={<Footprints size={16} />} label="Passos e Atividade Física" color="text-green-400" />
          <PermissionItem icon={<Moon size={16} />} label="Análise de Sono" color="text-indigo-400" />
          <PermissionItem icon={<Droplets size={16} />} label="Registros de Hidratação" color="text-cyan-400" />
        </div>

        <button 
          onClick={onGrant}
          className="w-full py-5 bg-white text-slate-950 rounded-[28px] font-black text-lg shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all mb-4"
        >
          Permitir Acesso
        </button>
        <button 
          onClick={onClose}
          className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
        >
          Agora Não
        </button>
      </div>
    </div>
  );
};

const PermissionItem: React.FC<{ icon: any; label: string; color: string }> = ({ icon, label, color }) => (
  <div className="flex items-center gap-4 glass p-4 rounded-2xl border-white/5">
    <div className={color}>{icon}</div>
    <span className="text-xs font-bold text-slate-300 flex-1 text-left">{label}</span>
    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
  </div>
);

export default HealthPermissionsOverlay;
