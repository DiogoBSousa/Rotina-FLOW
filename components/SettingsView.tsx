
import React, { useState } from 'react';
import { Bell, Volume2, ShieldCheck, AlertCircle, Clock, Moon, Sun, Smartphone, ChevronRight, RotateCcw, LogOut, User as UserIcon, Cloud, Check } from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  onRestartTutorial: () => void;
  user: User;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onRestartTutorial, user, onLogout }) => {
  const [annoyingAlarm, setAnnoyingAlarm] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <h2 className="text-2xl font-bold">Ajustes & Perfil</h2>

      {/* Perfil Expandido */}
      <section className="glass rounded-[40px] p-8 border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cloud size={80} className="text-blue-400" />
        </div>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img src={user.avatar} alt="User" className="w-24 h-24 rounded-[32px] border-4 border-slate-900 shadow-2xl" />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-950 flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-white">{user.name}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{user.email}</p>
          </div>

          <div className="flex gap-2">
            <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10">
              <Cloud size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase text-blue-400">Sincronizado</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 glass rounded-2xl flex items-center gap-2 border-red-500/20 text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={14} />
              <span className="text-[10px] font-black uppercase">Sair</span>
            </button>
          </div>
        </div>
      </section>

      {/* Notificações Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Sistema de Notificações</h3>
        <div className="glass rounded-[32px] overflow-hidden">
          <SettingToggle 
            icon={<AlertCircle className="text-red-500" />} 
            title="Alarmes Persistentes" 
            desc="Continua tocando até ser concluído" 
            enabled={annoyingAlarm} 
            onToggle={() => setAnnoyingAlarm(!annoyingAlarm)} 
          />
          <SettingToggle 
            icon={<ShieldCheck className="text-blue-500" />} 
            title="Alertas Críticos" 
            desc="Ignora modo silencioso/DND" 
            enabled={criticalAlerts} 
            onToggle={() => setCriticalAlerts(!criticalAlerts)} 
          />
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Ajuda & Onboarding</h3>
        <div className="glass rounded-[32px] overflow-hidden">
          <div 
            onClick={onRestartTutorial}
            className="p-5 flex items-center justify-between hover:bg-blue-500/10 transition-all border-b border-white/5 last:border-0 cursor-pointer group"
          >
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-blue-400 group-hover:rotate-180 transition-transform duration-500">
                <RotateCcw size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Reiniciar Tutorial</h4>
                <p className="text-[11px] text-slate-400">Rever as funcionalidades</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </div>
        </div>
      </section>

      <div className="p-6 glass rounded-[32px] bg-blue-500/5 border border-blue-500/10">
        <p className="text-[10px] text-blue-400 leading-relaxed font-bold uppercase tracking-wider text-center">
          Flow Cloud Sync v1.0 • {user.id === 'guest' ? 'MODO OFFLINE' : 'CONTA ATIVA'}
        </p>
      </div>
    </div>
  );
};

const SettingToggle: React.FC<{ icon: React.ReactNode, title: string, desc: string, enabled: boolean, onToggle: () => void }> = ({ icon, title, desc, enabled, onToggle }) => (
  <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-all border-b border-white/5 last:border-0">
    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-100">{title}</h4>
        <p className="text-[11px] text-slate-400">{desc}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-blue-600' : 'bg-slate-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7 shadow-lg shadow-white/20' : 'left-1'}`}></div>
    </button>
  </div>
);

export default SettingsView;
