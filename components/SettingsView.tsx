
import React, { useState } from 'react';
import { Bell, Volume2, ShieldCheck, AlertCircle, Clock, Moon, Sun, Smartphone, ChevronRight, RotateCcw, LogOut, User as UserIcon } from 'lucide-react';
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

      {/* User Profile Section */}
      <section className="glass rounded-[32px] p-6 flex items-center gap-4 border-blue-500/20 bg-blue-500/5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/30">
          <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-white">{user.name}</h3>
          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
        </div>
        <button 
          onClick={onLogout}
          className="p-3 glass rounded-xl text-red-400 hover:bg-red-400/10 transition-all active:scale-90"
        >
          <LogOut size={20} />
        </button>
      </section>

      {/* Notifications Section */}
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
          <SettingItem 
            icon={<Volume2 className="text-purple-500" />} 
            title="Som do Alarme" 
            desc="Sintetizador Digital Flow" 
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
                <p className="text-[11px] text-slate-400">Rever como usar o Rotina Flow</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-600" />
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Privacidade & Dados</h3>
        <div className="glass rounded-[32px] overflow-hidden">
          <SettingItem 
            icon={<Smartphone className="text-indigo-400" />} 
            title="Sincronização Cloud" 
            desc="Ativa para este dispositivo" 
          />
          <div className="p-5 hover:bg-white/5 transition-all cursor-pointer">
            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Apagar Todos os Dados</h4>
          </div>
        </div>
      </section>

      <div className="p-6 glass rounded-3xl bg-blue-500/5 border border-blue-500/10">
        <p className="text-[10px] text-blue-400 leading-relaxed font-bold uppercase tracking-wider text-center">
          Rotina Flow v2.6.0 • Cloud Sync v1.0
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

const SettingItem: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-all border-b border-white/5 last:border-0 cursor-pointer group">
    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 glass rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-100">{title}</h4>
        <p className="text-[11px] text-slate-400">{desc}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-600" />
  </div>
);

export default SettingsView;
